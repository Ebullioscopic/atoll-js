// UI Manager - Handles all DOM manipulation and UI updates
export class UIManager {
  constructor() {
    this.statusIndicator = document.getElementById('statusIndicator');
    this.authButton = document.getElementById('authButton');
    this.messageTimeout = null;
  }
  
  // Update connection status indicator
  updateConnectionStatus(status, text) {
    this.statusIndicator.className = 'status-indicator';
    
    if (status === 'connected') {
      this.statusIndicator.classList.add('connected');
    } else if (status === 'authorized') {
      this.statusIndicator.classList.add('authorized');
    }
    
    const statusText = this.statusIndicator.querySelector('.status-text');
    statusText.textContent = text;
  }
  
  // Enable/disable authorization button
  enableAuthButton() {
    this.authButton.disabled = false;
  }
  
  disableAuthButton() {
    this.authButton.disabled = true;
  }
  
  // Enable/disable all demo buttons
  enableAllDemoButtons() {
    document.querySelectorAll('.demo-card-controls .btn').forEach(btn => {
      btn.disabled = false;
    });
  }
  
  disableAllDemoButtons() {
    document.querySelectorAll('.demo-card-controls .btn').forEach(btn => {
      btn.disabled = true;
    });
  }
  
  // Show status message
  showMessage(type, message, duration = 3000) {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `status-message ${type}`;
    messageEl.textContent = message;
    
    // Add to header area for better visibility
    const header = document.querySelector('.site-header .container');
    if (header) {
      const existingMessage = header.querySelector('.status-message');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      // Insert after header content
      const headerContent = header.querySelector('.header-content');
      if (headerContent) {
        headerContent.parentNode.insertBefore(messageEl, headerContent.nextSibling);
      } else {
        header.appendChild(messageEl);
      }
      
      // Auto-remove after duration
      if (this.messageTimeout) {
        clearTimeout(this.messageTimeout);
      }
      
      this.messageTimeout = setTimeout(() => {
        messageEl.remove();
      }, duration);
    }
  }
  
  // Create demo card
  createDemoCard(demo, controller) {
    const card = document.createElement('div');
    card.className = 'demo-card';
    card.dataset.demoId = demo.id;
    
    // Header
    const header = document.createElement('div');
    header.className = 'demo-card-header';
    
    const title = document.createElement('h3');
    title.className = 'demo-card-title';
    title.textContent = demo.title;
    
    const description = document.createElement('p');
    description.className = 'demo-card-description';
    description.textContent = demo.description;
    
    header.appendChild(title);
    header.appendChild(description);
    
    // Controls
    const controls = document.createElement('div');
    controls.className = 'demo-card-controls';
    
    demo.actions.forEach(action => {
      const btn = document.createElement('button');
      btn.className = `btn ${action.variant || 'btn-secondary'}`;
      btn.textContent = action.label;
      btn.disabled = true; // Disabled until authorized
      
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.classList.add('btn-loading');
        
        try {
          await action.handler(controller, demo);
          this.showCardMessage(card, 'success', action.successMessage || 'Success!');
        } catch (error) {
          this.showCardMessage(card, 'error', error.message);
        } finally {
          btn.disabled = false;
          btn.classList.remove('btn-loading');
        }
      });
      
      controls.appendChild(btn);
    });
    
    card.appendChild(header);
    card.appendChild(controls);
    
    // Progress indicator (if applicable)
    if (demo.hasProgress) {
      const progressContainer = document.createElement('div');
      progressContainer.className = 'progress-indicator';
      progressContainer.innerHTML = `
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${demo.initialProgress || 0}%"></div>
        </div>
        <span class="progress-text">${demo.initialProgress || 0}%</span>
      `;
      card.appendChild(progressContainer);
    }
    
    // Footer with code toggle
    if (demo.code) {
      const footer = document.createElement('div');
      footer.className = 'demo-card-footer';
      
      const codeToggle = document.createElement('button');
      codeToggle.className = 'btn demo-card-code-toggle';
      codeToggle.innerHTML = '&lt;/&gt; View Code';
      
      const codeContainer = document.createElement('div');
      codeContainer.className = 'demo-card-code';
      
      const codeBlock = this.createCodeBlock(demo.code, 'typescript');
      codeContainer.appendChild(codeBlock);
      
      codeToggle.addEventListener('click', () => {
        codeContainer.classList.toggle('visible');
        codeToggle.textContent = codeContainer.classList.contains('visible') 
          ? '✕ Hide Code' 
          : '</> View Code';
      });
      
      footer.appendChild(codeToggle);
      footer.appendChild(codeContainer);
      card.appendChild(footer);
    }
    
    return card;
  }
  
  // Create code block with syntax highlighting
  createCodeBlock(code, language) {
    const block = document.createElement('div');
    block.className = 'code-block';
    
    const header = document.createElement('div');
    header.className = 'code-header';
    
    const langLabel = document.createElement('span');
    langLabel.className = 'code-language';
    langLabel.textContent = language;
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn code-copy-btn';
    copyBtn.textContent = 'Copy';
    
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    });
    
    header.appendChild(langLabel);
    header.appendChild(copyBtn);
    
    const content = document.createElement('div');
    content.className = 'code-content';
    
    const pre = document.createElement('pre');
    const codeEl = document.createElement('code');
    codeEl.className = `language-${language}`;
    codeEl.textContent = code;
    
    pre.appendChild(codeEl);
    content.appendChild(pre);
    
    block.appendChild(header);
    block.appendChild(content);
    
    // Apply syntax highlighting if Prism is available
    if (window.Prism) {
      window.Prism.highlightElement(codeEl);
    }
    
    return block;
  }
  
  // Show message in specific card
  showCardMessage(card, type, message, duration = 3000) {
    const existingMessage = card.querySelector('.status-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = `status-message ${type}`;
    messageEl.textContent = message;
    
    const controls = card.querySelector('.demo-card-controls');
    controls.parentNode.insertBefore(messageEl, controls.nextSibling);
    
    setTimeout(() => {
      messageEl.remove();
    }, duration);
  }
  
  // Update progress indicator
  updateProgress(demoId, progress) {
    const card = document.querySelector(`[data-demo-id="${demoId}"]`);
    if (!card) return;
    
    const progressBar = card.querySelector('.progress-bar-fill');
    const progressText = card.querySelector('.progress-text');
    
    if (progressBar && progressText) {
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
    }
  }
}
