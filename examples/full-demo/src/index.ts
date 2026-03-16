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
  AtollError,
  AtollErrorCode,
} from '../../../dist';

import * as readline from 'readline';

// ============================================================
// Constants
// ============================================================

const BUNDLE_ID = 'com.example.atoll-js-demo';

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
};

let demoProgress = 0.35;
let flightProgress = 0.12;

// ============================================================
// Helper: font descriptors
// ============================================================

function systemFont(size: number, weight: string = 'regular'): AtollFontDescriptor {
  return { size, weight: weight as any, design: 'default' };
}

function monoFont(size: number, weight: string = 'semibold'): AtollFontDescriptor {
  return { size, weight: weight as any, design: 'monospaced' };
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
  const html = `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin:0; background:transparent; font-family:-apple-system; color:white; }
    .row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
    .dot { width:10px; height:10px; border-radius:999px; background:rgba(0,200,255,0.95); }
    .title { font-size:13px; font-weight:600; opacity:0.85; }
    canvas { width:100%; height:70px; display:block; }
  </style>
</head>
<body>
  <div class="row"><div class="dot"></div><div class="title">Realtime Sparkline</div></div>
  <canvas id="c"></canvas>
  <script>
    const canvas=document.getElementById("c"),ctx=canvas.getContext("2d");
    let pts=Array.from({length:20},()=>Math.random());
    function resize(){canvas.width=canvas.clientWidth*devicePixelRatio;canvas.height=canvas.clientHeight*devicePixelRatio}
    resize();window.addEventListener("resize",resize);
    function tick(){pts.shift();pts.push(Math.random());ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();ctx.lineWidth=3*devicePixelRatio;
    for(let i=0;i<pts.length;i++){const x=(i/(pts.length-1))*canvas.width,y=canvas.height-pts[i]*canvas.height;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)}ctx.strokeStyle="rgba(0,200,255,0.95)";ctx.stroke()}
    setInterval(tick,450);tick();
  </script>
</body>
</html>`;

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
        content: {
          html,
          preferredHeight: 140,
          isTransparent: true,
          allowLocalhostRequests: false,
        },
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
          case '29':
            for (const id of [IDS.widgetInline, IDS.widgetCard, IDS.widgetCircle, IDS.widgetWeb]) {
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
          case '39':
            for (const id of [IDS.notchTab, IDS.notchMini, IDS.notchCombo]) {
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
║  29  Dismiss All Widgets             ║
╠══════════════════════════════════════╣
║  NOTCH EXPERIENCES                   ║
║  30  Present Simple Tab              ║
║  31  Present Minimalistic            ║
║  32  Present Combined                ║
║  39  Dismiss All Notch Experiences   ║
╠══════════════════════════════════════╣
║  h   Help  |  q   Quit              ║
╚══════════════════════════════════════╝`);
}

main().catch(console.error);
