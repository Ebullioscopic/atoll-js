/**
 * JSON-RPC 2.0 message types for Atoll WebSocket communication.
 */

export interface JSONRPCRequest {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown>;
  id: string;
}

export interface JSONRPCResponse {
  jsonrpc: '2.0';
  result?: Record<string, unknown>;
  error?: JSONRPCErrorObject;
  id: string | null;
}

export interface JSONRPCErrorObject {
  code: number;
  message: string;
  data?: unknown;
}

export interface JSONRPCNotification {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown>;
}

export function createRequest(method: string, params?: Record<string, unknown>): JSONRPCRequest {
  return {
    jsonrpc: '2.0',
    method,
    params,
    id: generateId(),
  };
}

export function createNotification(method: string, params?: Record<string, unknown>): JSONRPCNotification {
  return {
    jsonrpc: '2.0',
    method,
    params,
  };
}

let idCounter = 0;
function generateId(): string {
  return `${Date.now()}-${++idCounter}`;
}
