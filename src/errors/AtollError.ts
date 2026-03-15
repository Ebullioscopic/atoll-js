/**
 * AtollError — Error types for atoll-js.
 */
export class AtollError extends Error {
  public readonly code: AtollErrorCode;
  public readonly details?: string;

  constructor(code: AtollErrorCode, message: string, details?: string) {
    super(message);
    this.name = 'AtollError';
    this.code = code;
    this.details = details;
  }
}

export enum AtollErrorCode {
  /** Atoll is not reachable (WebSocket connection failed) */
  AtollNotReachable = 'ATOLL_NOT_REACHABLE',
  /** Version incompatibility */
  IncompatibleVersion = 'INCOMPATIBLE_VERSION',
  /** App is not authorized */
  NotAuthorized = 'NOT_AUTHORIZED',
  /** Descriptor validation failed */
  InvalidDescriptor = 'INVALID_DESCRIPTOR',
  /** WebSocket connection failed */
  ConnectionFailed = 'CONNECTION_FAILED',
  /** RPC service is unavailable */
  ServiceUnavailable = 'SERVICE_UNAVAILABLE',
  /** Activity limit exceeded */
  LimitExceeded = 'LIMIT_EXCEEDED',
  /** Request timed out */
  Timeout = 'TIMEOUT',
  /** JSON-RPC error from server */
  RPCError = 'RPC_ERROR',
  /** Unknown error */
  Unknown = 'UNKNOWN',
}
