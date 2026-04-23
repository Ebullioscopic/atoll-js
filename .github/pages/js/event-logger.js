// Event Logger - Logs all Atoll client events
export class EventLogger {
  constructor(client) {
    this.client = client;
    this.logContainer = document.getElementById('eventLogContent');
    this.maxEntries = 50;
    this.entries = [];
    this.isPaused = false;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.client.on('connected', () => {
      this.log('connected', 'Connected to Atoll', '✅');
    });
    
    this.client.on('disconnected', () => {
      this.log('disconnected', 'Disconnected from Atoll', '❌');
    });
    
    this.client.on('authorizationChange', (isAuthorized) => {
      this.log(
        'authorization',
        `Authorization ${isAuthorized ? 'granted' : 'revoked'}`,
        isAuthorized ? '🔑' : '🔒'
      );
    });
    
    this.client.on('activityDismiss', (activityID) => {
      this.log('dismiss', `Activity dismissed: ${activityID}`, '📌');
    });
    
    this.client.on('widgetDismiss', (widgetID) => {
      this.log('dismiss', `Widget dismissed: ${widgetID}`, '📌');
    });
    
    this.client.on('notchExperienceDismiss', (experienceID) => {
      this.log('dismiss', `Notch experience dismissed: ${experienceID}`, '📌');
    });
    
    this.client.on('atollActive', () => {
      this.log('lifecycle', 'Atoll lifecycle: active', '🟢');
    });
    
    this.client.on('atollIdle', () => {
      this.log('lifecycle', 'Atoll lifecycle: idle', '🟡');
    });
  }
  
  log(type, message, icon = '📝') {
    if (this.isPaused) return;
    
    const timestamp = new Date().toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
    
    const entry = {
      type,
      message,
      icon,
      timestamp
    };
    
    this.entries.push(entry);
    
    // Maintain max entries (FIFO)
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
      const firstEntry = this.logContainer.firstChild;
      if (firstEntry) {
        firstEntry.remove();
      }
    }
    
    // Create and append entry element
    const entryEl = this.createEntryElement(entry);
    this.logContainer.appendChild(entryEl);
    
    // Auto-scroll to bottom
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }
  
  createEntryElement(entry) {
    const el = document.createElement('div');
    el.className = 'event-entry';
    
    el.innerHTML = `
      <span class="event-icon">${entry.icon}</span>
      <div class="event-details">
        <div class="event-type">${this.formatType(entry.type)}</div>
        <div class="event-message">${entry.message}</div>
      </div>
      <span class="event-timestamp">${entry.timestamp}</span>
    `;
    
    return el;
  }
  
  formatType(type) {
    const typeMap = {
      'connected': 'Connected',
      'disconnected': 'Disconnected',
      'authorization': 'Authorization',
      'dismiss': 'Dismissed',
      'lifecycle': 'Lifecycle'
    };
    
    return typeMap[type] || type;
  }
  
  togglePause() {
    this.isPaused = !this.isPaused;
  }
  
  clear() {
    this.entries = [];
    this.logContainer.innerHTML = '';
  }
}
