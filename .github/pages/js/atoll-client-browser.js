// Browser-compatible AtollClient
import { BrowserWebSocketManager, EventEmitter } from './atoll-browser.js';

// Constants
export const ATOLL_DEFAULT_HOST = 'localhost';
export const ATOLL_DEFAULT_PORT = 9020;

// Enums and Constants
export const AtollLiveActivityPriority = {
  Low: 'low',
  Normal: 'normal',
  High: 'high',
  Critical: 'critical'
};

export const AtollColors = {
  white: { red: 1, green: 1, blue: 1, alpha: 1 },
  black: { red: 0, green: 0, blue: 0, alpha: 1 },
  blue: { red: 0.039, green: 0.518, blue: 1, alpha: 1 },
  purple: { red: 0.749, green: 0.353, blue: 0.949, alpha: 1 },
  green: { red: 0.188, green: 0.82, blue: 0.345, alpha: 1 },
  orange: { red: 1, green: 0.624, blue: 0.039, alpha: 1 },
  red: { red: 1, green: 0.271, blue: 0.227, alpha: 1 },
  accent: { red: 0.5, green: 0.5, blue: 0.5, alpha: 1 }
};

export const AtollErrorCode = {
  AtollNotReachable: 'AtollNotReachable',
  NotAuthorized: 'NotAuthorized',
  InvalidParameters: 'InvalidParameters',
  InternalError: 'InternalError'
};

export class AtollError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'AtollError';
  }
}

// Helper functions
function normalizePayload(payload) {
  if (!payload) return payload;
  
  if (Array.isArray(payload)) {
    return payload.map(normalizePayload);
  }
  
  if (payload && typeof payload === 'object') {
    const normalized = {};
    
    for (const [key, value] of Object.entries(payload)) {
      normalized[key] = normalizePayload(value);
    }
    
    // Convert CGSize-like objects to arrays [width, height]
    const keys = Object.keys(normalized);
    if (keys.length === 2 && keys.includes('width') && keys.includes('height')) {
      if (typeof normalized.width === 'number' && typeof normalized.height === 'number') {
        return [normalized.width, normalized.height];
      }
    }
    
    return normalized;
  }
  
  return payload;
}

function withDescriptorDefaults(descriptor) {
  // Add metadata if missing
  if (!descriptor.hasOwnProperty('metadata') || descriptor.metadata == null) {
    return { ...descriptor, metadata: {} };
  }
  return descriptor;
}

function fillBundleId(descriptor, bundleIdentifier) {
  if (!descriptor.bundleIdentifier) {
    return { ...descriptor, bundleIdentifier };
  }
  return descriptor;
}

// AtollClient
export class AtollClient extends EventEmitter {
  constructor(options = {}) {
    super();
    this.bundleIdentifier = options.bundleIdentifier || '';
    this.ws = new BrowserWebSocketManager(
      options.host || ATOLL_DEFAULT_HOST,
      options.port || ATOLL_DEFAULT_PORT
    );
    this.setupNotificationHandlers();
  }
  
  setupNotificationHandlers() {
    this.ws.on('connected', () => this.emit('connected'));
    this.ws.on('disconnected', () => this.emit('disconnected'));
    this.ws.on('error', (error) => this.emit('error', error));
    
    this.ws.on('notification', (method, params) => {
      switch (method) {
        case 'atoll.authorizationDidChange':
          this.emit('authorizationChange', params?.isAuthorized || false);
          break;
        case 'atoll.activityDidDismiss':
          this.emit('activityDismiss', params?.activityID);
          break;
        case 'atoll.widgetDidDismiss':
          this.emit('widgetDismiss', params?.widgetID);
          break;
        case 'atoll.notchExperienceDidDismiss':
          this.emit('notchExperienceDismiss', params?.experienceID);
          break;
      }
    });
    
    // Lifecycle aliases
    this.on('connected', () => this.emit('atollActive'));
    this.on('disconnected', () => this.emit('atollIdle'));
  }
  
  async connect() {
    await this.ws.connect();
  }
  
  disconnect() {
    this.ws.disconnect();
  }
  
  get isConnected() {
    return this.ws.isConnected;
  }
  
  async requestAuthorization() {
    try {
      const response = await this.ws.sendRequest('atoll.requestAuthorization', {
        bundleIdentifier: this.bundleIdentifier
      });
      
      if (response.error) {
        throw new AtollError(AtollErrorCode.InternalError, response.error.message || 'Authorization failed');
      }
      
      return response.result?.authorized || false;
    } catch (error) {
      throw new AtollError(AtollErrorCode.InternalError, error.message);
    }
  }
  
  async checkAuthorization() {
    try {
      const response = await this.ws.sendRequest('atoll.checkAuthorization', {
        bundleIdentifier: this.bundleIdentifier
      });
      
      if (response.error) {
        throw new AtollError(AtollErrorCode.InternalError, response.error.message || 'Check authorization failed');
      }
      
      return response.result?.authorized || false;
    } catch (error) {
      throw new AtollError(AtollErrorCode.InternalError, error.message);
    }
  }
  
  async presentLiveActivity(descriptor) {
    const filled = fillBundleId(descriptor, this.bundleIdentifier);
    const withDefaults = withDescriptorDefaults(filled);
    const normalized = normalizePayload(withDefaults);
    
    try {
      const response = await this.ws.sendRequest('atoll.presentLiveActivity', {
        descriptor: normalized
      });
      
      if (response.error) {
        throw new AtollError(AtollErrorCode.InternalError, response.error.message || 'Present activity failed');
      }
    } catch (error) {
      throw new AtollError(AtollErrorCode.InternalError, error.message);
    }
  }
  
  async updateLiveActivity(descriptor) {
    const filled = fillBundleId(descriptor, this.bundleIdentifier);
    const withDefaults = withDescriptorDefaults(filled);
    const normalized = normalizePayload(withDefaults);
    
    try {
      const response = await this.ws.sendRequest('atoll.updateLiveActivity', {
        descriptor: normalized
      });
      
      if (response.error) {
        throw new AtollError(AtollErrorCode.InternalError, response.error.message || 'Update activity failed');
      }
    } catch (error) {
      throw new AtollError(AtollErrorCode.InternalError, error.message);
    }
  }
  
  async dismissLiveActivity(activityID) {
    try {
      const response = await this.ws.sendRequest('atoll.dismissLiveActivity', {
        activityID,
        bundleIdentifier: this.bundleIdentifier
      });
      
      if (response.error) {
        throw new AtollError(AtollErrorCode.InternalError, response.error.message || 'Dismiss activity failed');
      }
    } catch (error) {
      throw new AtollError(AtollErrorCode.InternalError, error.message);
    }
  }
  
  async presentLockScreenWidget(descriptor) {
    const filled = fillBundleId(descriptor, this.bundleIdentifier);
    const withDefaults = withDescriptorDefaults(filled);
    const normalized = normalizePayload(withDefaults);
    
    try {
      const response = await this.ws.sendRequest('atoll.presentLockScreenWidget', {
        descriptor: normalized
      });
      
      if (response.error) {
        throw new AtollError(AtollErrorCode.InternalError, response.error.message || 'Present widget failed');
      }
    } catch (error) {
      throw new AtollError(AtollErrorCode.InternalError, error.message);
    }
  }
  
  async updateLockScreenWidget(descriptor) {
    const filled = fillBundleId(descriptor, this.bundleIdentifier);
    const withDefaults = withDescriptorDefaults(filled);
    const normalized = normalizePayload(withDefaults);
    
    try {
      const response = await this.ws.sendRequest('atoll.updateLockScreenWidget', {
        descriptor: normalized
      });
      
      if (response.error) {
        throw new AtollError(AtollErrorCode.InternalError, response.error.message || 'Update widget failed');
      }
    } catch (error) {
      throw new AtollError(AtollErrorCode.InternalError, error.message);
    }
  }
  
  async dismissLockScreenWidget(widgetID) {
    try {
      const response = await this.ws.sendRequest('atoll.dismissLockScreenWidget', {
        widgetID,
        bundleIdentifier: this.bundleIdentifier
      });
      
      if (response.error) {
        throw new AtollError(AtollErrorCode.InternalError, response.error.message || 'Dismiss widget failed');
      }
    } catch (error) {
      throw new AtollError(AtollErrorCode.InternalError, error.message);
    }
  }
  
  async presentNotchExperience(descriptor) {
    const filled = fillBundleId(descriptor, this.bundleIdentifier);
    const withDefaults = withDescriptorDefaults(filled);
    const normalized = normalizePayload(withDefaults);
    
    try {
      const response = await this.ws.sendRequest('atoll.presentNotchExperience', {
        descriptor: normalized
      });
      
      if (response.error) {
        throw new AtollError(AtollErrorCode.InternalError, response.error.message || 'Present notch experience failed');
      }
    } catch (error) {
      throw new AtollError(AtollErrorCode.InternalError, error.message);
    }
  }
  
  async updateNotchExperience(descriptor) {
    const filled = fillBundleId(descriptor, this.bundleIdentifier);
    const withDefaults = withDescriptorDefaults(filled);
    const normalized = normalizePayload(withDefaults);
    
    try {
      const response = await this.ws.sendRequest('atoll.updateNotchExperience', {
        descriptor: normalized
      });
      
      if (response.error) {
        throw new AtollError(AtollErrorCode.InternalError, response.error.message || 'Update notch experience failed');
      }
    } catch (error) {
      throw new AtollError(AtollErrorCode.InternalError, error.message);
    }
  }
  
  async dismissNotchExperience(experienceID) {
    try {
      const response = await this.ws.sendRequest('atoll.dismissNotchExperience', {
        experienceID,
        bundleIdentifier: this.bundleIdentifier
      });
      
      if (response.error) {
        throw new AtollError(AtollErrorCode.InternalError, response.error.message || 'Dismiss notch experience failed');
      }
    } catch (error) {
      throw new AtollError(AtollErrorCode.InternalError, error.message);
    }
  }
}

// WebView helper function - improved TypeScript to JavaScript conversion
export function createWebViewContentFromSource(options) {
  const { body, css, script, preferredHeight, isTransparent, allowLocalhostRequests, allowRemoteRequests } = options;

  let scriptContent = '';
  if (typeof script === 'string') {
    scriptContent = script.trim();
  } else if (script && script.code) {
    // Keep script source intact. Demo scripts are authored as JavaScript for browser safety.
    scriptContent = script.code.trim();
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${css || ''}</style>
</head>
<body>
  ${body || ''}
  <script>${scriptContent}</script>
</body>
</html>`;

  return {
    html,
    preferredHeight: preferredHeight || 200,
    isTransparent: isTransparent !== false,
    allowLocalhostRequests: allowLocalhostRequests || false,
    allowRemoteRequests: allowRemoteRequests || false
  };
}

export function createWebViewContentFromURL(options) {
  return {
    url: options.url,
    preferredHeight: options.preferredHeight || 200,
    isTransparent: options.isTransparent !== false,
    allowLocalhostRequests: options.allowLocalhostRequests || false
  };
}
