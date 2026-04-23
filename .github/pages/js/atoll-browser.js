// Browser-compatible wrapper for atoll-js
// This file provides a browser-compatible WebSocket implementation

class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }
  
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }
  
  removeListener(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  }
}

// Browser WebSocket Manager
class BrowserWebSocketManager extends EventEmitter {
  constructor(host, port) {
    super();
    this.host = host;
    this.port = port;
    this.ws = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }
  
  async connect() {
    return new Promise((resolve, reject) => {
      const url = `ws://${this.host}:${this.port}`;
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.emit('connected');
        resolve();
      };
      
      this.ws.onerror = (error) => {
        this.emit('error', error);
        reject(new Error('WebSocket connection failed'));
      };
      
      this.ws.onclose = () => {
        this.emit('disconnected');
        this.attemptReconnect();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };
    });
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  
  async attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }
    
    this.reconnectAttempts++;
    await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));
    
    try {
      await this.connect();
    } catch (error) {
      // Will retry on next disconnect
    }
  }
  
  async sendRequest(method, params = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }
    
    return new Promise((resolve, reject) => {
      const id = `${Date.now()}-${++this.requestId}`;
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };
      
      this.pendingRequests.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(request));
      
      // Timeout after 15 seconds (matching Node.js implementation)
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 15000);
    });
  }
  
  handleMessage(message) {
    // Handle responses (has id)
    if (message.id && this.pendingRequests.has(message.id)) {
      const { resolve, reject } = this.pendingRequests.get(message.id);
      this.pendingRequests.delete(message.id);
      
      // Return the full response object (not just result)
      // This allows the client to check for errors
      resolve(message);
      return;
    }
    
    // Handle notifications (has method, no id)
    if (message.method && !message.id) {
      this.emit('notification', message.method, message.params);
      return;
    }
  }
  
  get isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Export for use in main.js
export { BrowserWebSocketManager, EventEmitter };
