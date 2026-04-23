// Import atoll-js browser-compatible version
import { AtollClient, AtollColors, AtollLiveActivityPriority } from './atoll-client-browser.js';
import { DemoController } from './demo-controller.js';
import { UIManager } from './ui-manager.js';
import { EventLogger } from './event-logger.js';
import { demoDefinitions } from './demo-definitions.js';

// Application state
const state = {
  client: null,
  controller: null,
  uiManager: null,
  eventLogger: null,
  isConnected: false,
  isAuthorized: false,
  activeDemos: new Set(),
  progressValues: {}
};

// Initialize the application
async function init() {
  console.log('Initializing atoll-js showcase...');
  
  // Create AtollClient
  state.client = new AtollClient({
    bundleIdentifier: 'com.atoll-js.showcase',
    host: 'localhost',
    port: 9020
  });
  
  // Initialize managers
  state.uiManager = new UIManager();
  state.eventLogger = new EventLogger(state.client);
  state.controller = new DemoController(state.client, state.uiManager, state.eventLogger);
  
  // Setup event listeners
  setupClientEvents();
  setupUIEvents();
  
  // Render demo cards
  renderDemoCards();
  
  // Attempt to connect
  try {
    await state.client.connect();
  } catch (error) {
    console.error('Initial connection failed:', error);
    state.uiManager.updateConnectionStatus('disconnected', 'Connection failed');
  }
}

// Setup AtollClient event listeners
function setupClientEvents() {
  state.client.on('connected', () => {
    console.log('Connected to Atoll');
    state.isConnected = true;
    state.uiManager.updateConnectionStatus('connected', 'Connected');
    state.uiManager.enableAuthButton();
    
    // Check if already authorized
    state.client.checkAuthorization().then(isAuthorized => {
      console.log('Initial authorization check:', isAuthorized);
      if (isAuthorized) {
        state.isAuthorized = true;
        state.uiManager.updateConnectionStatus('authorized', 'Authorized');
        state.uiManager.enableAllDemoButtons();
        state.uiManager.showMessage('success', 'Already authorized! You can use all demo features.');
      }
    }).catch(error => {
      console.error('Authorization check failed:', error);
    });
  });
  
  state.client.on('disconnected', () => {
    console.log('Disconnected from Atoll');
    state.isConnected = false;
    state.isAuthorized = false;
    state.uiManager.updateConnectionStatus('disconnected', 'Disconnected');
    state.uiManager.disableAuthButton();
    state.uiManager.disableAllDemoButtons();
  });
  
  state.client.on('authorizationChange', (isAuthorized) => {
    console.log('Authorization changed:', isAuthorized);
    state.isAuthorized = isAuthorized;
    
    if (isAuthorized) {
      state.uiManager.updateConnectionStatus('authorized', 'Authorized');
      state.uiManager.enableAllDemoButtons();
      state.uiManager.showMessage('success', 'Authorization granted! You can now use all demo features.');
    } else {
      state.uiManager.updateConnectionStatus('connected', 'Not Authorized');
      state.uiManager.disableAllDemoButtons();
    }
  });
  
  state.client.on('activityDismiss', (activityID) => {
    console.log('Activity dismissed:', activityID);
    state.activeDemos.delete(activityID);
  });
  
  state.client.on('widgetDismiss', (widgetID) => {
    console.log('Widget dismissed:', widgetID);
    state.activeDemos.delete(widgetID);
  });
  
  state.client.on('notchExperienceDismiss', (experienceID) => {
    console.log('Notch experience dismissed:', experienceID);
    state.activeDemos.delete(experienceID);
  });
}

// Setup UI event listeners
function setupUIEvents() {
  // Authorization button
  const authButton = document.getElementById('authButton');
  authButton.addEventListener('click', async () => {
    try {
      authButton.disabled = true;
      authButton.classList.add('btn-loading');
      
      console.log('Requesting authorization...');
      const authorized = await state.client.requestAuthorization();
      console.log('Authorization result:', authorized);
      
      if (authorized) {
        state.isAuthorized = true;
        state.uiManager.updateConnectionStatus('authorized', 'Authorized');
        state.uiManager.enableAllDemoButtons();
        state.uiManager.showMessage('success', 'Authorization granted! You can now use all demo features.');
      } else {
        state.uiManager.showMessage('error', 'Authorization denied. Please check Atoll settings and try again.');
      }
    } catch (error) {
      console.error('Authorization error:', error);
      state.uiManager.showMessage('error', `Authorization failed: ${error.message}`);
    } finally {
      authButton.disabled = false;
      authButton.classList.remove('btn-loading');
    }
  });
  
  // Event log controls
  const pauseLogButton = document.getElementById('pauseLogButton');
  const clearLogButton = document.getElementById('clearLogButton');
  
  pauseLogButton.addEventListener('click', () => {
    state.eventLogger.togglePause();
    pauseLogButton.textContent = state.eventLogger.isPaused ? 'Resume' : 'Pause';
  });
  
  clearLogButton.addEventListener('click', () => {
    state.eventLogger.clear();
  });
  
  // Smooth scroll for navigation
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
  
  // Intersection observer for active nav highlighting
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });
  
  sections.forEach(section => observer.observe(section));
}

// Render demo cards
function renderDemoCards() {
  const liveActivitiesGrid = document.getElementById('liveActivitiesGrid');
  const lockWidgetsGrid = document.getElementById('lockWidgetsGrid');
  const notchExperiencesGrid = document.getElementById('notchExperiencesGrid');
  
  // Render live activities
  demoDefinitions.liveActivities.forEach(demo => {
    const card = state.uiManager.createDemoCard(demo, state.controller);
    liveActivitiesGrid.appendChild(card);
  });
  
  // Render lock screen widgets
  demoDefinitions.lockScreenWidgets.forEach(demo => {
    const card = state.uiManager.createDemoCard(demo, state.controller);
    lockWidgetsGrid.appendChild(card);
  });
  
  // Render notch experiences
  demoDefinitions.notchExperiences.forEach(demo => {
    const card = state.uiManager.createDemoCard(demo, state.controller);
    notchExperiencesGrid.appendChild(card);
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
window.atollShowcase = {
  state,
  client: () => state.client,
  controller: () => state.controller
};
