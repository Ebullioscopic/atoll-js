// Demo Controller - EXACT copy from examples/full-demo
import { AtollColors, AtollLiveActivityPriority, createWebViewContentFromSource } from './atoll-client-browser.js';

export class DemoController {
  constructor(client, uiManager, eventLogger) {
    this.client = client;
    this.uiManager = uiManager;
    this.eventLogger = eventLogger;
    this.progressValues = {
      download: 0.35,
      flight: 0.12
    };
  }
  
  systemFont(size, weight = 'regular') {
    return { size, weight, design: 'default' };
  }
  
  monoFont(size, weight = 'semibold') {
    return { size, weight, design: 'monospaced' };
  }
  
  // Live Activities - EXACT copies from full-demo
  async presentDownloadActivity() {
    const activity = {
      id: 'showcase-download',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.Low,
      title: 'Downloading',
      subtitle: 'update-pkg-v2.dmg',
      leadingIcon: { type: 'symbol', name: 'arrow.down.circle.fill' },
      trailingContent: { type: 'none' },
      progressIndicator: { type: 'percentage' },
      progress: this.progressValues.download,
      accentColor: AtollColors.blue,
      allowsMusicCoexistence: true,
      centerTextStyle: 'inheritUser',
      sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false },
      sneakPeekTitle: 'Download',
      sneakPeekSubtitle: `${Math.round(this.progressValues.download * 100)}% complete`,
      metadata: {}
    };
    
    await this.client.presentLiveActivity(activity);
    this.uiManager.updateProgress('download', Math.round(this.progressValues.download * 100));
  }
  
  async updateDownloadActivity() {
    this.progressValues.download = Math.min(this.progressValues.download + 0.1, 1.0);
    
    const activity = {
      id: 'showcase-download',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.Low,
      title: 'Downloading',
      subtitle: 'update-pkg-v2.dmg',
      leadingIcon: { type: 'symbol', name: 'arrow.down.circle.fill' },
      trailingContent: { type: 'none' },
      progressIndicator: { type: 'percentage' },
      progress: this.progressValues.download,
      accentColor: AtollColors.blue,
      allowsMusicCoexistence: true,
      centerTextStyle: 'inheritUser',
      sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: true },
      sneakPeekTitle: 'Download',
      sneakPeekSubtitle: `${Math.round(this.progressValues.download * 100)}% complete`,
      metadata: {}
    };
    
    await this.client.updateLiveActivity(activity);
    this.uiManager.updateProgress('download', Math.round(this.progressValues.download * 100));
  }
  
  async presentPomodoroActivity() {
    const activity = {
      id: 'showcase-pomodoro',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.High,
      title: 'Focus',
      subtitle: 'Pomodoro',
      leadingIcon: { type: 'symbol', name: 'brain.head.profile' },
      trailingContent: {
        type: 'countdownText',
        targetDate: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
        font: this.monoFont(13),
      },
      accentColor: AtollColors.purple,
      allowsMusicCoexistence: true,
      centerTextStyle: 'inheritUser',
      sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false },
      sneakPeekTitle: 'Focus session',
      sneakPeekSubtitle: '25 min',
      metadata: {}
    };
    
    await this.client.presentLiveActivity(activity);
  }
  
  async presentNewsActivity() {
    const activity = {
      id: 'showcase-news',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.Normal,
      title: 'News',
      subtitle: 'Top headlines',
      leadingIcon: { type: 'symbol', name: 'newspaper.fill' },
      trailingContent: {
        type: 'marquee',
        text: 'Markets rally • New release ships today • Weather clears…',
        font: this.systemFont(12, 'semibold'),
        minDuration: 0.6,
      },
      accentColor: AtollColors.white,
      allowsMusicCoexistence: true,
      centerTextStyle: 'inheritUser',
      sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false },
      sneakPeekTitle: 'Headlines',
      sneakPeekSubtitle: 'Latest updates',
      metadata: {}
    };
    
    await this.client.presentLiveActivity(activity);
  }
  
  async presentSpectrumActivity() {
    const activity = {
      id: 'showcase-spectrum',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.Normal,
      title: 'Audio',
      subtitle: 'Spectrum',
      leadingIcon: { type: 'symbol', name: 'music.note' },
      trailingContent: { type: 'spectrum', color: AtollColors.accent },
      accentColor: AtollColors.white,
      allowsMusicCoexistence: true,
      centerTextStyle: 'inheritUser',
      sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false },
      sneakPeekTitle: 'Audio',
      sneakPeekSubtitle: 'Monitoring',
      metadata: {}
    };
    
    await this.client.presentLiveActivity(activity);
  }
  
  async presentFlightActivity() {
    const percent = Math.round(this.progressValues.flight * 100);
    const activity = {
      id: 'showcase-flight',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.High,
      title: 'Flight',
      subtitle: 'SFO → JFK',
      leadingIcon: { type: 'symbol', name: 'airplane' },
      trailingContent: { type: 'text', text: `${percent}%` },
      accentColor: AtollColors.white,
      allowsMusicCoexistence: true,
      centerTextStyle: 'inheritUser',
      sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false },
      sneakPeekTitle: 'SFO → JFK',
      sneakPeekSubtitle: `In flight • ${percent}%`,
      metadata: {}
    };
    
    await this.client.presentLiveActivity(activity);
  }
  
  async presentRingIndicatorActivity() {
    const activity = {
      id: 'showcase-ring',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.Normal,
      title: 'Backup',
      subtitle: 'Ring indicator',
      leadingIcon: { type: 'symbol', name: 'externaldrive.fill' },
      trailingContent: { type: 'none' },
      progressIndicator: { type: 'ring', diameter: 26, strokeWidth: 3 },
      progress: 0.62,
      accentColor: AtollColors.white,
      allowsMusicCoexistence: true,
      centerTextStyle: 'inheritUser',
      sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false },
      sneakPeekTitle: 'Backup',
      sneakPeekSubtitle: '62%',
      metadata: {}
    };
    
    await this.client.presentLiveActivity(activity);
  }
  
  async presentBarIndicatorActivity() {
    const activity = {
      id: 'showcase-bar',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.Normal,
      title: 'Export',
      subtitle: 'Bar indicator',
      leadingIcon: { type: 'symbol', name: 'film.fill' },
      trailingContent: { type: 'none' },
      progressIndicator: { type: 'bar', width: 90, height: 4 },
      progress: 0.47,
      accentColor: AtollColors.orange,
      allowsMusicCoexistence: true,
      centerTextStyle: 'inheritUser',
      sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false },
      sneakPeekTitle: 'Export',
      sneakPeekSubtitle: '47%',
      metadata: {}
    };
    
    await this.client.presentLiveActivity(activity);
  }
  
  async dismissAllActivities() {
    const ids = ['showcase-download', 'showcase-pomodoro', 'showcase-news', 'showcase-spectrum', 'showcase-flight', 'showcase-ring', 'showcase-bar'];
    for (const id of ids) {
      try {
        await this.client.dismissLiveActivity(id);
      } catch (error) {
        console.log(`Failed to dismiss ${id}:`, error.message);
      }
    }
  }
  
  // Lock Screen Widgets - EXACT copies from full-demo
  async presentInlineWidget() {
    const widget = {
      id: 'showcase-widget-inline',
      bundleIdentifier: 'com.atoll-js.showcase',
      layoutStyle: 'inline',
      position: { alignment: 'center', verticalOffset: 110 },
      material: 'frosted',
      content: [
        { type: 'icon', icon: { type: 'symbol', name: 'airplane.departure' } },
        { type: 'spacer', height: 4 },
        { type: 'text', text: 'Flight', font: this.systemFont(15, 'semibold'), color: AtollColors.white },
        { type: 'spacer', height: 2 },
        { type: 'text', text: 'SFO → JFK', font: this.systemFont(13), color: AtollColors.white },
      ],
      accentColor: AtollColors.accent,
      dismissOnUnlock: true,
      priority: AtollLiveActivityPriority.Normal,
      metadata: {}
    };
    
    await this.client.presentLockScreenWidget(widget);
  }
  
  async presentCardWidget() {
    const widget = {
      id: 'showcase-widget-card',
      bundleIdentifier: 'com.atoll-js.showcase',
      layoutStyle: 'card',
      position: { alignment: 'leading', verticalOffset: -40, horizontalOffset: 50 },
      size: { width: 270, height: 160 },
      material: 'liquid',
      appearance: {
        tintColor: AtollColors.white,
        tintOpacity: 0.06,
        enableGlassHighlight: true,
        liquidGlassVariant: { rawValue: 12 },
      },
      cornerRadius: 24,
      content: [
        { type: 'text', text: 'Charging', font: this.systemFont(14, 'semibold'), color: AtollColors.white },
        { type: 'spacer', height: 6 },
        { type: 'progress', indicator: { type: 'bar', width: 190, height: 4 }, value: 0.76, color: AtollColors.green },
        { type: 'spacer', height: 8 },
        { type: 'divider', color: AtollColors.white, thickness: 1 },
        { type: 'spacer', height: 8 },
        { type: 'gauge', value: 0.76, minValue: 0, maxValue: 1, style: 'circular', color: AtollColors.green },
      ],
      accentColor: AtollColors.accent,
      dismissOnUnlock: true,
      priority: AtollLiveActivityPriority.Normal,
      metadata: {}
    };
    
    await this.client.presentLockScreenWidget(widget);
  }
  
  async presentCircularWidget() {
    const widget = {
      id: 'showcase-widget-circular',
      bundleIdentifier: 'com.atoll-js.showcase',
      layoutStyle: 'circular',
      position: { alignment: 'trailing', verticalOffset: 140, horizontalOffset: -70 },
      material: 'frosted',
      content: [
        { type: 'gauge', value: 0.55, minValue: 0, maxValue: 1, style: 'circular', color: AtollColors.accent },
      ],
      accentColor: AtollColors.white,
      dismissOnUnlock: true,
      priority: AtollLiveActivityPriority.Normal,
      metadata: {}
    };
    
    await this.client.presentLockScreenWidget(widget);
  }
  
  async presentWebWidget() {
    const widget = {
      id: 'showcase-widget-web',
      bundleIdentifier: 'com.atoll-js.showcase',
      layoutStyle: 'custom',
      position: { alignment: 'center', verticalOffset: -140 },
      size: { width: 320, height: 160 },
      material: 'clear',
      cornerRadius: 24,
      content: [
        {
          type: 'webView',
          content: createWebViewContentFromSource({
            body: '<div class="row"><div class="dot"></div><div class="title">Realtime Sparkline</div></div><canvas id="c"></canvas>',
            css: `
              body { margin:0; background:transparent; font-family:-apple-system; color:white; }
              .row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
              .dot { width:10px; height:10px; border-radius:999px; background:rgba(0,200,255,0.95); }
              .title { font-size:13px; font-weight:600; opacity:0.85; }
              canvas { width:100%; height:70px; display:block; }
            `,
            script: {
              language: 'js',
              code: `
                const canvas = document.getElementById('c');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                  throw new Error('2D context unavailable');
                }

                const pts = Array.from({ length: 20 }, () => Math.random());

                function resize() {
                  canvas.width = canvas.clientWidth * devicePixelRatio;
                  canvas.height = canvas.clientHeight * devicePixelRatio;
                }

                function tick() {
                  pts.shift();
                  pts.push(Math.random());
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.beginPath();
                  ctx.lineWidth = 3 * devicePixelRatio;

                  for (let i = 0; i < pts.length; i += 1) {
                    const x = (i / (pts.length - 1)) * canvas.width;
                    const y = canvas.height - pts[i] * canvas.height;
                    if (i === 0) {
                      ctx.moveTo(x, y);
                    } else {
                      ctx.lineTo(x, y);
                    }
                  }

                  ctx.strokeStyle = 'rgba(0,200,255,0.95)';
                  ctx.stroke();
                }

                resize();
                window.addEventListener('resize', resize);
                setInterval(tick, 450);
                tick();
              `,
            },
            preferredHeight: 140,
            isTransparent: true,
            allowLocalhostRequests: false,
          }),
        },
      ],
      accentColor: AtollColors.white,
      dismissOnUnlock: true,
      priority: AtollLiveActivityPriority.Normal,
      metadata: {}
    };
    
    await this.client.presentLockScreenWidget(widget);
  }
  
  async dismissAllWidgets() {
    const ids = ['showcase-widget-inline', 'showcase-widget-card', 'showcase-widget-circular', 'showcase-widget-web'];
    for (const id of ids) {
      try {
        await this.client.dismissLockScreenWidget(id);
      } catch (error) {
        console.log(`Failed to dismiss ${id}:`, error.message);
      }
    }
  }
  
  // Notch Experiences - EXACT copies from full-demo
  async presentSimpleTabExperience() {
    const experience = {
      id: 'showcase-notch-tab',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.Normal,
      accentColor: AtollColors.white,
      metadata: {},
      tab: {
        title: 'Demo',
        iconSymbolName: 'sparkles',
        preferredHeight: 190,
        sections: [
          {
            id: 'one',
            title: 'Hello',
            layout: 'stack',
            elements: [
              { type: 'text', text: 'Notch tab demo', font: this.systemFont(16, 'semibold'), color: AtollColors.white },
              { type: 'text', text: 'From atoll-js!', font: this.systemFont(12), color: AtollColors.white },
            ],
          },
        ],
        allowWebInteraction: false,
      },
    };
    
    await this.client.presentNotchExperience(experience);
  }
  
  async presentMinimalisticExperience() {
    const experience = {
      id: 'showcase-notch-mini',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.Normal,
      accentColor: AtollColors.white,
      metadata: {},
      minimalistic: {
        headline: 'Minimalistic',
        subtitle: 'Override demo',
        sections: [
          {
            id: 'm',
            layout: 'metrics',
            elements: [
              { type: 'text', text: 'Mode', font: this.systemFont(12), color: AtollColors.white },
              { type: 'text', text: 'Active', font: this.systemFont(14, 'semibold'), color: AtollColors.white },
            ],
          },
        ],
        layout: 'metrics',
        hidesMusicControls: false,
      },
    };
    
    await this.client.presentNotchExperience(experience);
  }
  
  async presentCombinedExperience() {
    const experience = {
      id: 'showcase-notch-combo',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.High,
      accentColor: AtollColors.white,
      metadata: {},
      tab: {
        title: 'Combined',
        iconSymbolName: 'square.stack.3d.up.fill',
        preferredHeight: 210,
        sections: [
          {
            id: 'a',
            title: 'Metrics',
            layout: 'metrics',
            elements: [
              { type: 'text', text: 'CPU', font: this.systemFont(12), color: AtollColors.white },
              { type: 'text', text: '21%', font: this.monoFont(14), color: AtollColors.white },
              { type: 'text', text: 'RAM', font: this.systemFont(12), color: AtollColors.white },
              { type: 'text', text: '8.3 GB', font: this.monoFont(14), color: AtollColors.white },
            ],
          },
        ],
        allowWebInteraction: false,
      },
      minimalistic: {
        headline: 'Combined Demo',
        subtitle: 'Tab + minimalistic',
        sections: [
          {
            id: 'b',
            layout: 'stack',
            elements: [
              { type: 'text', text: 'Everything works.', font: this.systemFont(13, 'semibold'), color: AtollColors.white },
            ],
          },
        ],
        layout: 'stack',
        hidesMusicControls: false,
      },
    };
    
    await this.client.presentNotchExperience(experience);
  }
  
  async presentFlightAnimationSimpleNotchExperience() {
    const safeProgress = Math.max(0.0, Math.min(this.progressValues.flight, 1.0));
    const flightWeb = createWebViewContentFromSource({
      body: '<canvas id="c"></canvas>',
      css: `
        body { margin:0; background:transparent; overflow:hidden; }
        canvas { width:100%; height:100%; display:block; }
      `,
      script: {
        language: 'js',
        code: `
          const canvas = document.getElementById('c');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas context unavailable');
          }

          function resize() {
            canvas.width = Math.max(10, canvas.clientWidth) * devicePixelRatio;
            canvas.height = Math.max(10, canvas.clientHeight) * devicePixelRatio;
          }
          resize();
          window.addEventListener('resize', resize);

          const planeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="white" d="M62 30c0-1.1-.9-2-2-2H39.7L26.9 9.8c-.4-.6-1.1-1-1.9-1H21c-1.1 0-2 .9-2 2v17.2L9.4 28l-3.1-7.2c-.3-.8-1.1-1.3-1.9-1.3H2c-1.1 0-2 .9-2 2v3l8 8-8 8v3c0 1.1.9 2 2 2h2.4c.8 0 1.6-.5 1.9-1.3L9.4 36l9.6 0v17.2c0 1.1.9 2 2 2h4c.8 0 1.5-.4 1.9-1L39.7 36H60c1.1 0 2-.9 2-2z"/></svg>';
          const planeImg = new Image();
          planeImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(planeSvg);

          let progress = ${safeProgress.toFixed(4)};
          let t = 0;

          function quadBezier(p0, p1, p2, tt) {
            const x = (1-tt)*(1-tt)*p0.x + 2*(1-tt)*tt*p1.x + tt*tt*p2.x;
            const y = (1-tt)*(1-tt)*p0.y + 2*(1-tt)*tt*p1.y + tt*tt*p2.y;
            return { x, y };
          }

          function drawLabel(x, y, code, name, align) {
            ctx.save();
            ctx.textAlign = align;
            ctx.textBaseline = 'top';
            ctx.font = (12 * devicePixelRatio) + 'px -apple-system';
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.fillText(code, x, y);
            ctx.font = (10.5 * devicePixelRatio) + 'px -apple-system';
            ctx.fillStyle = 'rgba(255,255,255,0.65)';
            ctx.fillText(name, x, y + 14 * devicePixelRatio);
            ctx.restore();
          }

          function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const w = canvas.width;
            const h = canvas.height;
            const padX = 26 * devicePixelRatio;
            const bottomSafe = 34 * devicePixelRatio;
            const baseY = h - bottomSafe - (10 * devicePixelRatio);

            const left = { x: padX, y: baseY };
            const right = { x: w - padX, y: baseY };
            const control = { x: w * 0.5, y: h * 0.16 };

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(left.x, left.y);
            ctx.quadraticCurveTo(control.x, control.y, right.x, right.y);
            ctx.strokeStyle = 'rgba(255,255,255,0.14)';
            ctx.lineWidth = 6 * devicePixelRatio;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(left.x, left.y);
            ctx.quadraticCurveTo(control.x, control.y, right.x, right.y);
            ctx.strokeStyle = 'rgba(255,255,255,0.32)';
            ctx.lineWidth = 2.2 * devicePixelRatio;
            ctx.setLineDash([5 * devicePixelRatio, 8 * devicePixelRatio]);
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();

            for (const pt of [left, right]) {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 14 * devicePixelRatio, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(0,200,255,0.16)';
              ctx.fill();
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 6 * devicePixelRatio, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255,255,255,0.92)';
              ctx.fill();
            }

            drawLabel(left.x, left.y + 14 * devicePixelRatio, 'SFO', 'Boarding', 'left');
            drawLabel(right.x, right.y + 14 * devicePixelRatio, 'JFK', 'Arrivals', 'right');

            const microDrift = 0.012 * Math.sin(t * 0.9);
            const pp = Math.max(0, Math.min(1, progress + microDrift));

            const pos = quadBezier(left, control, right, pp);
            const ahead = quadBezier(left, control, right, Math.min(1, pp + 0.01));
            const angle = Math.atan2(ahead.y - pos.y, ahead.x - pos.x);
            const size = 24 * devicePixelRatio;

            if (planeImg.complete) {
              ctx.save();
              ctx.translate(pos.x, pos.y);
              ctx.rotate(angle);
              ctx.globalAlpha = 0.97;
              ctx.drawImage(planeImg, -size * 0.6, -size * 0.45, size * 1.2, size * 0.9);
              ctx.restore();
            }

            t += 0.02;
            requestAnimationFrame(draw);
          }

          planeImg.onload = () => requestAnimationFrame(draw);
          if (planeImg.complete) {
            requestAnimationFrame(draw);
          }
        `,
      },
      preferredHeight: 200,
      isTransparent: true,
      allowLocalhostRequests: false,
    });

    const experience = {
      id: 'showcase-notch-flight-canvas',
      bundleIdentifier: 'com.atoll-js.showcase',
      priority: AtollLiveActivityPriority.High,
      accentColor: AtollColors.white,
      metadata: { progress: safeProgress.toFixed(3), renderer: 'canvas2d' },
      tab: {
        title: 'Flight (Simple)',
        iconSymbolName: 'airplane.circle.fill',
        preferredHeight: 220,
        sections: [],
        webContent: flightWeb,
        allowWebInteraction: false,
        footnote: 'No external scripts',
      },
      minimalistic: {
        sections: [],
        webContent: {
          ...flightWeb,
          preferredHeight: 155,
        },
        layout: 'custom',
        hidesMusicControls: false,
      },
    };
    
    await this.client.presentNotchExperience(experience);
  }
  
  async updateFlightAnimationSimpleNotchExperience() {
    this.progressValues.flight = Math.min(this.progressValues.flight + 0.1, 1.0);
    await this.presentFlightAnimationSimpleNotchExperience();
    this.uiManager.updateProgress('flight-animation-canvas', Math.round(this.progressValues.flight * 100));
  }
  
  // Alias for Canvas version (same as Simple)
  async presentFlightAnimationCanvasExperience() {
    await this.presentFlightAnimationSimpleNotchExperience();
  }
  
  async updateFlightAnimationCanvasExperience() {
    await this.updateFlightAnimationSimpleNotchExperience();
  }
  
  async dismissAllNotchExperiences() {
    const ids = ['showcase-notch-tab', 'showcase-notch-mini', 'showcase-notch-combo', 'showcase-notch-flight-canvas'];
    for (const id of ids) {
      try {
        await this.client.dismissNotchExperience(id);
      } catch (error) {
        console.log(`Failed to dismiss ${id}:`, error.message);
      }
    }
  }
}
