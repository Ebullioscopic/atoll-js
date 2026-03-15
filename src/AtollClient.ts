import { EventEmitter } from 'events';
import { WebSocketManager, ATOLL_DEFAULT_HOST, ATOLL_DEFAULT_PORT } from './connection/WebSocketManager';
import { AtollError, AtollErrorCode } from './errors/AtollError';
import { AtollLiveActivityDescriptor } from './models/AtollLiveActivityDescriptor';
import { AtollLockScreenWidgetDescriptor } from './models/AtollLockScreenWidgetDescriptor';
import { AtollNotchExperienceDescriptor } from './models/AtollNotchExperienceDescriptor';

export interface AtollClientOptions {
  host?: string;
  port?: number;
  bundleIdentifier?: string;
  autoConnect?: boolean;
}

export interface AtollClientEvents {
  authorizationChange: (isAuthorized: boolean) => void;
  activityDismiss: (activityID: string) => void;
  widgetDismiss: (widgetID: string) => void;
  notchExperienceDismiss: (experienceID: string) => void;
  connected: () => void;
  disconnected: () => void;
}

/**
 * Main client class for interacting with Atoll via JSON-RPC over WebSocket.
 *
 * Usage mirrors `AtollClient` from AtollExtensionKit but communicates over WebSocket
 * instead of XPC, allowing any application to connect.
 *
 * @example
 * ```ts
 * import { AtollClient, createLiveActivity, symbolIcon, AtollColors } from '@ebullioscopic/atoll-js';
 *
 * const client = new AtollClient({ bundleIdentifier: 'com.myapp.example' });
 * await client.connect();
 *
 * const authorized = await client.requestAuthorization();
 * if (authorized) {
 *   const activity = createLiveActivity({
 *     id: 'my-timer',
 *     title: 'Timer',
 *     leadingIcon: symbolIcon('timer'),
 *     accentColor: AtollColors.blue,
 *   });
 *   await client.presentLiveActivity(activity);
 * }
 * ```
 */
export class AtollClient extends EventEmitter {
  private ws: WebSocketManager;
  private bundleIdentifier: string;

  constructor(options: AtollClientOptions = {}) {
    super();
    this.bundleIdentifier = options.bundleIdentifier || '';
    this.ws = new WebSocketManager(
      options.host || ATOLL_DEFAULT_HOST,
      options.port || ATOLL_DEFAULT_PORT
    );
    this.setupNotificationHandlers();
  }

  // ─── Connection ─────────────────────────────────────────────────

  /** Connect to the Atoll RPC server. */
  async connect(): Promise<void> {
    await this.ws.connect();
  }

  /** Disconnect from the Atoll RPC server. */
  disconnect(): void {
    this.ws.disconnect();
  }

  /** Whether currently connected to Atoll. */
  get isConnected(): boolean {
    return this.ws.isConnected;
  }

  // ─── Version ────────────────────────────────────────────────────

  /** Get the installed Atoll version. */
  async getAtollVersion(): Promise<string> {
    await this.ensureConnected();
    const response = await this.ws.sendRequest('atoll.getVersion', {});
    this.checkError(response);
    return (response.result as Record<string, unknown>)?.version as string;
  }

  // ─── Authorization ──────────────────────────────────────────────

  /** Request authorization to display live activities. */
  async requestAuthorization(): Promise<boolean> {
    await this.ensureConnected();
    const response = await this.ws.sendRequest('atoll.requestAuthorization', {
      bundleIdentifier: this.bundleIdentifier,
    });
    this.checkError(response);
    return (response.result as Record<string, unknown>)?.authorized as boolean;
  }

  /** Check if the app is currently authorized. */
  async checkAuthorization(): Promise<boolean> {
    await this.ensureConnected();
    const response = await this.ws.sendRequest('atoll.checkAuthorization', {
      bundleIdentifier: this.bundleIdentifier,
    });
    this.checkError(response);
    return (response.result as Record<string, unknown>)?.authorized as boolean;
  }

  // ─── Live Activities ────────────────────────────────────────────

  /** Present a live activity in Atoll's Dynamic Island. */
  async presentLiveActivity(descriptor: AtollLiveActivityDescriptor): Promise<void> {
    await this.ensureConnected();
    const d = this.fillBundleId(descriptor);
    const response = await this.ws.sendRequest('atoll.presentLiveActivity', { descriptor: d });
    this.checkError(response);
  }

  /** Update an existing live activity. */
  async updateLiveActivity(descriptor: AtollLiveActivityDescriptor): Promise<void> {
    await this.ensureConnected();
    const d = this.fillBundleId(descriptor);
    const response = await this.ws.sendRequest('atoll.updateLiveActivity', { descriptor: d });
    this.checkError(response);
  }

  /** Dismiss a live activity by ID. */
  async dismissLiveActivity(activityID: string): Promise<void> {
    await this.ensureConnected();
    const response = await this.ws.sendRequest('atoll.dismissLiveActivity', {
      activityID,
      bundleIdentifier: this.bundleIdentifier,
    });
    this.checkError(response);
  }

  // ─── Lock Screen Widgets ────────────────────────────────────────

  /** Present a lock screen widget. */
  async presentLockScreenWidget(descriptor: AtollLockScreenWidgetDescriptor): Promise<void> {
    await this.ensureConnected();
    const d = this.fillBundleId(descriptor);
    const response = await this.ws.sendRequest('atoll.presentLockScreenWidget', { descriptor: d });
    this.checkError(response);
  }

  /** Update an existing lock screen widget. */
  async updateLockScreenWidget(descriptor: AtollLockScreenWidgetDescriptor): Promise<void> {
    await this.ensureConnected();
    const d = this.fillBundleId(descriptor);
    const response = await this.ws.sendRequest('atoll.updateLockScreenWidget', { descriptor: d });
    this.checkError(response);
  }

  /** Dismiss a lock screen widget by ID. */
  async dismissLockScreenWidget(widgetID: string): Promise<void> {
    await this.ensureConnected();
    const response = await this.ws.sendRequest('atoll.dismissLockScreenWidget', {
      widgetID,
      bundleIdentifier: this.bundleIdentifier,
    });
    this.checkError(response);
  }

  // ─── Notch Experiences ──────────────────────────────────────────

  /** Present a notch experience. */
  async presentNotchExperience(descriptor: AtollNotchExperienceDescriptor): Promise<void> {
    await this.ensureConnected();
    const d = this.fillBundleId(descriptor);
    const response = await this.ws.sendRequest('atoll.presentNotchExperience', { descriptor: d });
    this.checkError(response);
  }

  /** Update an existing notch experience. */
  async updateNotchExperience(descriptor: AtollNotchExperienceDescriptor): Promise<void> {
    await this.ensureConnected();
    const d = this.fillBundleId(descriptor);
    const response = await this.ws.sendRequest('atoll.updateNotchExperience', { descriptor: d });
    this.checkError(response);
  }

  /** Dismiss a notch experience by ID. */
  async dismissNotchExperience(experienceID: string): Promise<void> {
    await this.ensureConnected();
    const response = await this.ws.sendRequest('atoll.dismissNotchExperience', {
      experienceID,
      bundleIdentifier: this.bundleIdentifier,
    });
    this.checkError(response);
  }

  // ─── Private ────────────────────────────────────────────────────

  private setupNotificationHandlers(): void {
    this.ws.onNotification = (method, params) => {
      switch (method) {
        case 'atoll.authorizationDidChange':
          if (typeof params?.isAuthorized === 'boolean') {
            this.emit('authorizationChange', params.isAuthorized);
          }
          break;
        case 'atoll.activityDidDismiss':
          if (typeof params?.activityID === 'string') {
            this.emit('activityDismiss', params.activityID);
          }
          break;
        case 'atoll.widgetDidDismiss':
          if (typeof params?.widgetID === 'string') {
            this.emit('widgetDismiss', params.widgetID);
          }
          break;
        case 'atoll.notchExperienceDidDismiss':
          if (typeof params?.experienceID === 'string') {
            this.emit('notchExperienceDismiss', params.experienceID);
          }
          break;
      }
    };

    this.ws.onConnect = () => this.emit('connected');
    this.ws.onDisconnect = () => this.emit('disconnected');
  }

  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  private fillBundleId<T extends { bundleIdentifier: string }>(descriptor: T): T {
    if (!descriptor.bundleIdentifier) {
      return { ...descriptor, bundleIdentifier: this.bundleIdentifier };
    }
    return descriptor;
  }

  private checkError(response: { error?: { code: number; message: string; data?: unknown } }): void {
    if (response.error) {
      throw new AtollError(
        AtollErrorCode.RPCError,
        response.error.message,
        typeof response.error.data === 'string' ? response.error.data : JSON.stringify(response.error.data)
      );
    }
  }
}
