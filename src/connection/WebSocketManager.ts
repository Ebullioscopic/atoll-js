import WebSocket from 'ws';
import { JSONRPCRequest, JSONRPCResponse, JSONRPCNotification, createRequest } from './JSONRPCMessages';
import { AtollError, AtollErrorCode } from '../errors/AtollError';

export const ATOLL_DEFAULT_HOST = 'localhost';
export const ATOLL_DEFAULT_PORT = 9020;

interface PendingRequest {
  resolve: (response: JSONRPCResponse) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

/**
 * Manages WebSocket connection to Atoll's JSON-RPC server.
 */
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private host: string;
  private port: number;
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseReconnectDelay = 1000;
  private shouldReconnect = true;
  private _isConnected = false;

  /** Enable debug logging of JSON-RPC messages to console. */
  public debug = false;

  public onNotification?: (method: string, params?: Record<string, unknown>) => void;
  public onDisconnect?: () => void;
  public onConnect?: () => void;

  constructor(host: string = ATOLL_DEFAULT_HOST, port: number = ATOLL_DEFAULT_PORT) {
    this.host = host;
    this.port = port;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  // ─── Connection Lifecycle ───────────────────────────────────────

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._isConnected && this.ws) {
        resolve();
        return;
      }

      const url = `ws://${this.host}:${this.port}`;
      this.ws = new WebSocket(url);

      this.ws.on('open', () => {
        this._isConnected = true;
        this.reconnectAttempts = 0;
        this.onConnect?.();
        resolve();
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        this.handleMessage(data);
      });

      this.ws.on('close', () => {
        this.handleDisconnection();
      });

      this.ws.on('error', (err: Error) => {
        if (!this._isConnected) {
          reject(new AtollError(AtollErrorCode.AtollNotReachable, `Connection failed: ${err.message}`));
        }
      });

      // Connection timeout
      setTimeout(() => {
        if (!this._isConnected) {
          this.ws?.close();
          reject(new AtollError(AtollErrorCode.Timeout, 'Connection timed out'));
        }
      }, 5000);
    });
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this._isConnected = false;

    // Fail all pending requests
    for (const [id, pending] of this.pendingRequests) {
      clearTimeout(pending.timer);
      pending.reject(new AtollError(AtollErrorCode.ServiceUnavailable, 'Disconnected'));
    }
    this.pendingRequests.clear();

    this.ws?.close();
    this.ws = null;
  }

  // ─── JSON-RPC Transport ─────────────────────────────────────────

  async sendRequest(method: string, params?: Record<string, unknown>): Promise<JSONRPCResponse> {
    if (!this._isConnected || !this.ws) {
      throw new AtollError(AtollErrorCode.AtollNotReachable, 'Not connected to Atoll');
    }

    const request = createRequest(method, params);
    const data = JSON.stringify(request);

    if (this.debug) {
      console.log(`[atoll-js] → ${method}`, JSON.stringify(params).substring(0, 500));
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(request.id);
        reject(new AtollError(AtollErrorCode.Timeout, `Request timed out: ${method}`));
      }, 15000);

      this.pendingRequests.set(request.id, { resolve, reject, timer });

      this.ws!.send(data, (err) => {
        if (err) {
          this.pendingRequests.delete(request.id);
          clearTimeout(timer);
          reject(new AtollError(AtollErrorCode.ConnectionFailed, `Send failed: ${err.message}`));
        }
      });
    });
  }

  // ─── Private ────────────────────────────────────────────────────

  private handleMessage(data: WebSocket.Data): void {
    try {
      const text = typeof data === 'string' ? data : data.toString();
      const parsed = JSON.parse(text);

      // Response (has id)
      if (parsed.id && this.pendingRequests.has(parsed.id)) {
        const pending = this.pendingRequests.get(parsed.id)!;
        clearTimeout(pending.timer);
        this.pendingRequests.delete(parsed.id);
        pending.resolve(parsed as JSONRPCResponse);
        if (this.debug) {
          console.log(`[atoll-js] ←`, JSON.stringify(parsed).substring(0, 500));
        }
        return;
      }

      // Notification (no id)
      if (parsed.method && !parsed.id) {
        this.onNotification?.(parsed.method, parsed.params);
        return;
      }
    } catch {
      // Ignore malformed messages
    }
  }

  private handleDisconnection(): void {
    const wasConnected = this._isConnected;
    this._isConnected = false;
    this.ws = null;

    // Fail pending requests
    for (const [id, pending] of this.pendingRequests) {
      clearTimeout(pending.timer);
      pending.reject(new AtollError(AtollErrorCode.ConnectionFailed, 'Connection lost'));
    }
    this.pendingRequests.clear();

    if (wasConnected) {
      this.onDisconnect?.();
    }

    // Auto-reconnect with exponential backoff
    if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => {
        this.connect().catch(() => {});
      }, delay);
    }
  }
}
