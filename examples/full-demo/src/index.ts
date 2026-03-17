/**
 * atoll-js Full API Demo
 *
 * Demonstrates all features of the atoll-js SDK:
 *  - Connection & authorization
 *  - Live activities (download, pomodoro, flight, spectrum, indicators)
 *  - Lock screen widgets (inline, card, circular, web)
 *  - Notch experiences (tab, minimalistic, combined)
 *
 * Usage:
 *   cd examples/full-demo
 *   npm install
 *   npm run build && npm start
 *
 * Requires Atoll to be running with the RPC server enabled.
 */

import {
  AtollClient,
  AtollLiveActivityDescriptor,
  AtollLockScreenWidgetDescriptor,
  AtollNotchExperienceDescriptor,
  AtollLiveActivityPriority,
  AtollColorDescriptor,
  AtollIconDescriptor,
  AtollFontDescriptor,
  AtollSneakPeekConfig,
  AtollColors,
  createColor,
  createWebViewContentFromSource,
  createWebViewContentFromURL,
  AtollError,
  AtollErrorCode,
} from '../../../dist';

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================
// Constants
// ============================================================

const BUNDLE_ID = 'com.example.atoll-js-demo';
const LOCALHOST_DEMO_URL = process.env.ATOLL_WEBVIEW_LOCALHOST_URL || 'http://localhost:5173';

const IDS = {
  download:      'js-demo-download',
  pomodoro:      'js-demo-pomodoro',
  news:          'js-demo-news',
  flight:        'js-demo-flight',
  spectrum:      'js-demo-spectrum',
  indicator:     'js-demo-indicator',
  widgetInline:  'js-demo-widget-inline',
  widgetCard:    'js-demo-widget-card',
  widgetCircle:  'js-demo-widget-circular',
  widgetWeb:     'js-demo-widget-web',
  notchTab:      'js-demo-notch-tab',
  notchMini:     'js-demo-notch-mini',
  notchCombo:    'js-demo-notch-combo',
  notchFlight:   'js-demo-notch-flight',
  notchFlightSimple: 'js-demo-notch-flight-simple',
};

let demoProgress = 0.35;
let flightProgress = 0.12;

const FLIGHT_TEMPLATE_PATH = path.resolve(process.cwd(), 'assets/flight-3d-inline.html');

// ============================================================
// Helper: font descriptors
// ============================================================

function systemFont(size: number, weight: string = 'regular'): AtollFontDescriptor {
  return { size, weight: weight as any, design: 'default' };
}

function monoFont(size: number, weight: string = 'semibold'): AtollFontDescriptor {
  return { size, weight: weight as any, design: 'monospaced' };
}

function loadFlightHTML(progress01: number): string {
  const safe = Math.max(0.0, Math.min(progress01, 1.0));
  const fallback = `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin:0; background:transparent; overflow:hidden; }
    canvas { width:100%; height:100%; display:block; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d");
    let progress = __PROGRESS__;
    let t = 0;

    function resize() {
      canvas.width = Math.max(10, canvas.clientWidth) * devicePixelRatio;
      canvas.height = Math.max(10, canvas.clientHeight) * devicePixelRatio;
    }
    resize();
    window.addEventListener("resize", resize);

    const planeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="white" d="M62 30c0-1.1-.9-2-2-2H39.7L26.9 9.8c-.4-.6-1.1-1-1.9-1H21c-1.1 0-2 .9-2 2v17.2L9.4 28l-3.1-7.2c-.3-.8-1.1-1.3-1.9-1.3H2c-1.1 0-2 .9-2 2v3l8 8-8 8v3c0 1.1.9 2 2 2h2.4c.8 0 1.6-.5 1.9-1.3L9.4 36l9.6 0v17.2c0 1.1.9 2 2 2h4c.8 0 1.5-.4 1.9-1L39.7 36H60c1.1 0 2-.9 2-2z"/></svg>';
    const planeImg = new Image();
    planeImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(planeSvg);

    function bezier(p0, p1, p2, tt) {
      return {
        x: (1-tt)*(1-tt)*p0.x + 2*(1-tt)*tt*p1.x + tt*tt*p2.x,
        y: (1-tt)*(1-tt)*p0.y + 2*(1-tt)*tt*p1.y + tt*tt*p2.y,
      };
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

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(120,200,255,0.10)");
      grad.addColorStop(1, "rgba(10,16,24,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.quadraticCurveTo(control.x, control.y, right.x, right.y);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 6 * devicePixelRatio;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.quadraticCurveTo(control.x, control.y, right.x, right.y);
      ctx.strokeStyle = "rgba(120,220,255,0.65)";
      ctx.lineWidth = 2.2 * devicePixelRatio;
      ctx.setLineDash([5 * devicePixelRatio, 8 * devicePixelRatio]);
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.setLineDash([]);

      const drift = 0.012 * Math.sin(t * 0.9);
      const pp = Math.max(0, Math.min(1, progress + drift));
      const pos = bezier(left, control, right, pp);
      const ahead = bezier(left, control, right, Math.min(1, pp + 0.01));
      const angle = Math.atan2(ahead.y - pos.y, ahead.x - pos.x);
      const size = 24 * devicePixelRatio;

      ctx.save();
      ctx.translate(pos.x, pos.y + 6 * devicePixelRatio);
      ctx.rotate(angle);
      ctx.scale(1.1, 0.55);
      ctx.beginPath();
      ctx.arc(0, 0, 9 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fill();
      ctx.restore();

      if (planeImg.complete) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle + Math.sin(t * 2.4) * 0.05);
        ctx.globalAlpha = 0.98;
        ctx.drawImage(planeImg, -size * 0.6, -size * 0.45, size * 1.2, size * 0.9);
        ctx.restore();
      }

      t += 0.02;
      requestAnimationFrame(draw);
    }

    planeImg.onload = () => requestAnimationFrame(draw);
    if (planeImg.complete) requestAnimationFrame(draw);
  </script>
</body>
</html>`;

  let template = fallback;
  try {
    template = fs.readFileSync(FLIGHT_TEMPLATE_PATH, 'utf8');
  } catch {
    // Keep demo resilient if template file is missing.
  }

  return template.replace(/__PROGRESS__/g, safe.toFixed(4));
}

// ============================================================
// Live Activities
// ============================================================

function makeDownloadActivity(): AtollLiveActivityDescriptor {
  return {
    id: IDS.download,
    bundleIdentifier: BUNDLE_ID,
    priority: AtollLiveActivityPriority.Low,
    title: 'Downloading',
    subtitle: 'update-pkg-v2.dmg',
    leadingIcon: { type: 'symbol', name: 'arrow.down.circle.fill' },
    trailingContent: { type: 'none' },
    progressIndicator: { type: 'percentage' },
    progress: demoProgress,
    accentColor: AtollColors.blue,
    allowsMusicCoexistence: true,
    centerTextStyle: 'inheritUser',
    sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false },
    sneakPeekTitle: 'Download',
    sneakPeekSubtitle: `${Math.round(demoProgress * 100)}% complete`,
  };
}

function makePomodoroActivity(): AtollLiveActivityDescriptor {
  return {
    id: IDS.pomodoro,
    bundleIdentifier: BUNDLE_ID,
    priority: AtollLiveActivityPriority.High,
    title: 'Focus',
    subtitle: 'Pomodoro',
    leadingIcon: { type: 'symbol', name: 'brain.head.profile' },
    trailingContent: {
      type: 'countdownText',
      targetDate: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
      font: monoFont(13),
    },
    accentColor: AtollColors.purple,
    allowsMusicCoexistence: true,
    centerTextStyle: 'inheritUser',
    sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false },
    sneakPeekTitle: 'Focus session',
    sneakPeekSubtitle: '25 min',
  };
}

function makeNewsActivity(): AtollLiveActivityDescriptor {
  return {
    id: IDS.news,
    bundleIdentifier: BUNDLE_ID,
    priority: AtollLiveActivityPriority.Normal,
    title: 'News',
    subtitle: 'Top headlines',
    leadingIcon: { type: 'symbol', name: 'newspaper.fill' },
    trailingContent: {
      type: 'marquee',
      text: 'Markets rally • New release ships today • Weather clears…',
      font: systemFont(12, 'semibold'),
      minDuration: 0.6,
    },
    accentColor: AtollColors.white,
    allowsMusicCoexistence: true,
    centerTextStyle: 'inheritUser',
    sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false },
    sneakPeekTitle: 'Headlines',
    sneakPeekSubtitle: 'Latest updates',
  };
}

function makeFlightActivity(): AtollLiveActivityDescriptor {
  const percent = Math.round(flightProgress * 100);
  return {
    id: IDS.flight,
    bundleIdentifier: BUNDLE_ID,
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
  };
}

function makeSpectrumActivity(): AtollLiveActivityDescriptor {
  return {
    id: IDS.spectrum,
    bundleIdentifier: BUNDLE_ID,
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
  };
}

function makeRingIndicatorActivity(): AtollLiveActivityDescriptor {
  return {
    id: IDS.indicator,
    bundleIdentifier: BUNDLE_ID,
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
  };
}

function makeBarIndicatorActivity(): AtollLiveActivityDescriptor {
  return {
    id: IDS.indicator,
    bundleIdentifier: BUNDLE_ID,
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
  };
}

// ============================================================
// Lock Screen Widgets
// ============================================================

function makeInlineWidget(): AtollLockScreenWidgetDescriptor {
  return {
    id: IDS.widgetInline,
    bundleIdentifier: BUNDLE_ID,
    layoutStyle: 'inline',
    position: { alignment: 'center', verticalOffset: 110 },
    material: 'frosted',
    content: [
      { type: 'icon', icon: { type: 'symbol', name: 'airplane.departure' } },
      { type: 'spacer', height: 4 },
      { type: 'text', text: 'Flight', font: systemFont(15, 'semibold'), color: AtollColors.white },
      { type: 'spacer', height: 2 },
      { type: 'text', text: 'SFO → JFK', font: systemFont(13), color: AtollColors.white },
    ],
    accentColor: AtollColors.accent,
    dismissOnUnlock: true,
    priority: AtollLiveActivityPriority.Normal,
  };
}

function makeCardWidget(): AtollLockScreenWidgetDescriptor {
  return {
    id: IDS.widgetCard,
    bundleIdentifier: BUNDLE_ID,
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
      { type: 'text', text: 'Charging', font: systemFont(14, 'semibold'), color: AtollColors.white },
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
  };
}

function makeCircularWidget(): AtollLockScreenWidgetDescriptor {
  return {
    id: IDS.widgetCircle,
    bundleIdentifier: BUNDLE_ID,
    layoutStyle: 'circular',
    position: { alignment: 'trailing', verticalOffset: 140, horizontalOffset: -70 },
    material: 'frosted',
    content: [
      { type: 'gauge', value: 0.55, minValue: 0, maxValue: 1, style: 'circular', color: AtollColors.accent },
    ],
    accentColor: AtollColors.white,
    dismissOnUnlock: true,
    priority: AtollLiveActivityPriority.Normal,
  };
}

function makeWebWidget(): AtollLockScreenWidgetDescriptor {
  return {
    id: IDS.widgetWeb,
    bundleIdentifier: BUNDLE_ID,
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
            language: 'ts',
            code: `
              const canvas = document.getElementById('c') as HTMLCanvasElement;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                throw new Error('2D context unavailable');
              }

              const pts: number[] = Array.from({ length: 20 }, () => Math.random());

              function resize(): void {
                canvas.width = canvas.clientWidth * devicePixelRatio;
                canvas.height = canvas.clientHeight * devicePixelRatio;
              }

              function tick(): void {
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
  };
}

// ============================================================
// Notch Experiences
// ============================================================

function makeSimpleTabExperience(): AtollNotchExperienceDescriptor {
  return {
    id: IDS.notchTab,
    bundleIdentifier: BUNDLE_ID,
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
            { type: 'text', text: 'Notch tab demo', font: systemFont(16, 'semibold'), color: AtollColors.white },
            { type: 'text', text: 'From atoll-js!', font: systemFont(12), color: AtollColors.white },
          ],
        },
      ],
      allowWebInteraction: false,
    },
  };
}

function makeMinimalisticExperience(): AtollNotchExperienceDescriptor {
  return {
    id: IDS.notchMini,
    bundleIdentifier: BUNDLE_ID,
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
            { type: 'text', text: 'Mode', font: systemFont(12), color: AtollColors.white },
            { type: 'text', text: 'Active', font: systemFont(14, 'semibold'), color: AtollColors.white },
          ],
        },
      ],
      layout: 'metrics',
      hidesMusicControls: false,
    },
  };
}

function makeCombinedExperience(): AtollNotchExperienceDescriptor {
  return {
    id: IDS.notchCombo,
    bundleIdentifier: BUNDLE_ID,
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
            { type: 'text', text: 'CPU', font: systemFont(12), color: AtollColors.white },
            { type: 'text', text: '21%', font: monoFont(14), color: AtollColors.white },
            { type: 'text', text: 'RAM', font: systemFont(12), color: AtollColors.white },
            { type: 'text', text: '8.3 GB', font: monoFont(14), color: AtollColors.white },
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
            { type: 'text', text: 'Everything works.', font: systemFont(13, 'semibold'), color: AtollColors.white },
          ],
        },
      ],
      layout: 'stack',
      hidesMusicControls: false,
    },
  };
}

function makeFlightAnimationNotchExperience(): AtollNotchExperienceDescriptor {
  const safeProgress = Math.max(0.05, Math.min(flightProgress, 0.95));
  const flightHTML = loadFlightHTML(safeProgress);
  const flightWeb = {
    html: flightHTML,
    preferredHeight: 200,
    isTransparent: true,
    allowLocalhostRequests: false,
    allowRemoteRequests: false,
  };

  return {
    id: IDS.notchFlight,
    bundleIdentifier: BUNDLE_ID,
    priority: AtollLiveActivityPriority.High,
    accentColor: AtollColors.white,
    metadata: { progress: safeProgress.toFixed(3), renderer: 'threejs' },
    tab: {
      title: 'Flight',
      iconSymbolName: 'airplane.circle.fill',
      preferredHeight: 220,
      sections: [],
      webContent: flightWeb,
      allowWebInteraction: false,
      footnote: 'SFO -> JFK',
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
}

function makeLocalhostWebWidget(): AtollLockScreenWidgetDescriptor {
  return {
    id: `${IDS.widgetWeb}-localhost`,
    bundleIdentifier: BUNDLE_ID,
    layoutStyle: 'custom',
    position: { alignment: 'center', verticalOffset: -140 },
    size: { width: 320, height: 190 },
    material: 'clear',
    cornerRadius: 24,
    content: [
      {
        type: 'webView',
        content: createWebViewContentFromURL({
          url: LOCALHOST_DEMO_URL,
          preferredHeight: 180,
          isTransparent: true,
          allowLocalhostRequests: true,
        }),
      },
    ],
    accentColor: AtollColors.white,
    dismissOnUnlock: true,
    priority: AtollLiveActivityPriority.Normal,
  };
}

function makeFlightAnimationSimpleNotchExperience(): AtollNotchExperienceDescriptor {
  const safeProgress = Math.max(0.0, Math.min(flightProgress, 1.0));
  const flightWeb = createWebViewContentFromSource({
    body: '<canvas id="c"></canvas>',
    css: `
      body { margin:0; background:transparent; overflow:hidden; }
      canvas { width:100%; height:100%; display:block; }
    `,
    script: {
      language: 'ts',
      code: `
        const canvas = document.getElementById('c') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context unavailable');
        }

        function resize(): void {
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

        function quadBezier(p0: {x:number;y:number}, p1: {x:number;y:number}, p2: {x:number;y:number}, tt: number): {x:number;y:number} {
          const x = (1-tt)*(1-tt)*p0.x + 2*(1-tt)*tt*p1.x + tt*tt*p2.x;
          const y = (1-tt)*(1-tt)*p0.y + 2*(1-tt)*tt*p1.y + tt*tt*p2.y;
          return { x, y };
        }

        function drawLabel(x: number, y: number, code: string, name: string, align: CanvasTextAlign): void {
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

        function draw(): void {
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

  return {
    id: IDS.notchFlightSimple,
    bundleIdentifier: BUNDLE_ID,
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
}

// ============================================================
// Interactive CLI
// ============================================================

async function main() {
  const client = new AtollClient({
    bundleIdentifier: BUNDLE_ID,
  });

  // Register events
  client.on('connected', () => console.log('✅ Connected to Atoll'));
  client.on('disconnected', () => console.log('❌ Disconnected from Atoll'));
  client.on('authorizationChange', (auth: boolean) => console.log(`🔑 Authorization: ${auth}`));
  client.on('activityDismiss', (id: string) => console.log(`📌 Activity dismissed: ${id}`));
  client.on('widgetDismiss', (id: string) => console.log(`📌 Widget dismissed: ${id}`));
  client.on('notchExperienceDismiss', (id: string) => console.log(`📌 Notch dismissed: ${id}`));

  console.log('\natoll-js Full API Demo');
  console.log('━'.repeat(40));
  printMenu();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const prompt = () => {
    rl.question('\n> ', async (input) => {
      const cmd = input.trim();
      try {
        switch (cmd) {
          case '1':
            await client.connect();
            break;
          case '2':
            const auth = await client.requestAuthorization();
            console.log(`Authorization: ${auth ? '✅' : '❌'}`);
            break;
          case '3':
            const check = await client.checkAuthorization();
            console.log(`Authorized: ${check ? '✅' : '❌'}`);
            break;

          // Live Activities
          case '10':
            demoProgress = 0.35;
            await client.presentLiveActivity(makeDownloadActivity());
            console.log('Presented: Download');
            break;
          case '11':
            demoProgress = Math.min(demoProgress + 0.1, 1.0);
            const updated = makeDownloadActivity();
            updated.sneakPeekConfig = { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: true };
            await client.updateLiveActivity(updated);
            console.log(`Updated: Download → ${Math.round(demoProgress * 100)}%`);
            break;
          case '12':
            await client.presentLiveActivity(makePomodoroActivity());
            console.log('Presented: Pomodoro');
            break;
          case '13':
            await client.presentLiveActivity(makeNewsActivity());
            console.log('Presented: News Marquee');
            break;
          case '14':
            await client.presentLiveActivity(makeSpectrumActivity());
            console.log('Presented: Spectrum');
            break;
          case '15':
            flightProgress = 0.12;
            await client.presentLiveActivity(makeFlightActivity());
            console.log('Presented: Flight');
            break;
          case '16':
            flightProgress = Math.min(flightProgress + 0.1, 1.0);
            const flightUpdated = makeFlightActivity();
            flightUpdated.sneakPeekConfig = { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: true };
            await client.updateLiveActivity(flightUpdated);
            console.log(`Updated: Flight → ${Math.round(flightProgress * 100)}%`);
            break;
          case '17':
            await client.presentLiveActivity(makeRingIndicatorActivity());
            console.log('Presented: Ring Indicator');
            break;
          case '18':
            await client.presentLiveActivity(makeBarIndicatorActivity());
            console.log('Presented: Bar Indicator');
            break;
          case '19':
            for (const id of Object.values(IDS).filter(i => i.includes('demo-') && !i.includes('widget') && !i.includes('notch'))) {
              try { await client.dismissLiveActivity(id); } catch {}
            }
            console.log('Dismissed all live activities');
            break;

          // Widgets
          case '20':
            await client.presentLockScreenWidget(makeInlineWidget());
            console.log('Presented: Inline Widget');
            break;
          case '21':
            await client.presentLockScreenWidget(makeCardWidget());
            console.log('Presented: Card Widget (liquid glass)');
            break;
          case '22':
            await client.presentLockScreenWidget(makeCircularWidget());
            console.log('Presented: Circular Widget');
            break;
          case '23':
            await client.presentLockScreenWidget(makeWebWidget());
            console.log('Presented: Web Widget (sparkline)');
            break;
          case '24':
            await client.presentLockScreenWidget(makeLocalhostWebWidget());
            console.log(`Presented: Localhost Web Widget (${LOCALHOST_DEMO_URL})`);
            break;
          case '29':
            for (const id of [IDS.widgetInline, IDS.widgetCard, IDS.widgetCircle, IDS.widgetWeb, `${IDS.widgetWeb}-localhost`]) {
              try { await client.dismissLockScreenWidget(id); } catch {}
            }
            console.log('Dismissed all widgets');
            break;

          // Notch Experiences
          case '30':
            await client.presentNotchExperience(makeSimpleTabExperience());
            console.log('Presented: Simple Tab');
            break;
          case '31':
            await client.presentNotchExperience(makeMinimalisticExperience());
            console.log('Presented: Minimalistic');
            break;
          case '32':
            await client.presentNotchExperience(makeCombinedExperience());
            console.log('Presented: Combined');
            break;
          case '33':
            flightProgress = Math.max(0.05, Math.min(flightProgress, 0.95));
            await client.presentNotchExperience(makeFlightAnimationNotchExperience());
            console.log('Presented: Flight Animation (Inline 3D)');
            break;
          case '34':
            flightProgress = Math.min(flightProgress + 0.1, 1.0);
            await client.updateNotchExperience(makeFlightAnimationNotchExperience());
            console.log(`Updated: Flight Animation -> ${Math.round(flightProgress * 100)}%`);
            break;
          case '35':
            flightProgress = Math.max(0.05, Math.min(flightProgress, 0.95));
            await client.presentNotchExperience(makeFlightAnimationSimpleNotchExperience());
            console.log('Presented: Flight Animation Simple (Canvas)');
            break;
          case '36':
            flightProgress = Math.min(flightProgress + 0.1, 1.0);
            await client.updateNotchExperience(makeFlightAnimationSimpleNotchExperience());
            console.log(`Updated: Flight Animation Simple -> ${Math.round(flightProgress * 100)}%`);
            break;
          case '39':
            for (const id of [IDS.notchTab, IDS.notchMini, IDS.notchCombo, IDS.notchFlight, IDS.notchFlightSimple]) {
              try { await client.dismissNotchExperience(id); } catch {}
            }
            console.log('Dismissed all notch experiences');
            break;

          case 'h':
          case 'help':
            printMenu();
            break;

          case 'q':
          case 'quit':
            client.disconnect();
            rl.close();
            process.exit(0);

          default:
            console.log('Unknown command. Type "h" for help.');
        }
      } catch (error: any) {
        if (error instanceof AtollError) {
          console.error(`AtollError [${error.code}]: ${error.message}`);
        } else {
          console.error(`Error: ${error.message || error}`);
        }
      }
      prompt();
    });
  };

  prompt();
}

function printMenu() {
  console.log(`
╔══════════════════════════════════════╗
║          COMMANDS                     ║
╠══════════════════════════════════════╣
║  1  Connect                          ║
║  2  Request Authorization            ║
║  3  Check Authorization              ║
╠══════════════════════════════════════╣
║  LIVE ACTIVITIES                     ║
║  10  Present Download (percentage)   ║
║  11  Update Download (+10%)          ║
║  12  Present Pomodoro (countdown)    ║
║  13  Present News (marquee)          ║
║  14  Present Spectrum                ║
║  15  Present Flight (text trailing)  ║
║  16  Update Flight (+10%)            ║
║  17  Present Ring Indicator          ║
║  18  Present Bar Indicator           ║
║  19  Dismiss All Activities          ║
╠══════════════════════════════════════╣
║  LOCK SCREEN WIDGETS                 ║
║  20  Present Inline Widget           ║
║  21  Present Card Widget (liquid)    ║
║  22  Present Circular Widget         ║
║  23  Present Web Widget (sparkline)  ║
║  24  Present Localhost Web Widget    ║
║  29  Dismiss All Widgets             ║
╠══════════════════════════════════════╣
║  NOTCH EXPERIENCES                   ║
║  30  Present Simple Tab              ║
║  31  Present Minimalistic            ║
║  32  Present Combined                ║
║  33  Present Flight Animation (3D)   ║
║  34  Update Flight Animation (+10%)  ║
║  35  Present Flight Simple (Canvas)  ║
║  36  Update Flight Simple (+10%)     ║
║  39  Dismiss All Notch Experiences   ║
╠══════════════════════════════════════╣
║  h   Help  |  q   Quit              ║
╚══════════════════════════════════════╝`);
}

main().catch(console.error);
