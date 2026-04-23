// Demo Definitions - Configuration for all demo cards
export const demoDefinitions = {
  liveActivities: [
    {
      id: 'download',
      title: 'Download Progress',
      description: 'Shows a download with percentage indicator that can be updated in real-time',
      hasProgress: true,
      initialProgress: 35,
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentDownloadActivity(),
          successMessage: 'Download activity presented!'
        },
        {
          label: 'Update +10%',
          variant: 'btn-secondary',
          handler: (controller) => controller.updateDownloadActivity(),
          successMessage: 'Progress updated!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissLiveActivity('showcase-download'),
          successMessage: 'Activity dismissed!'
        }
      ],
      code: `import { AtollClient, AtollColors, AtollLiveActivityPriority } from '@ebullioscopic/atoll-js';

const client = new AtollClient({ bundleIdentifier: 'com.myapp' });
await client.connect();

const activity = {
  id: 'download',
  bundleIdentifier: 'com.myapp',
  priority: AtollLiveActivityPriority.Low,
  title: 'Downloading',
  subtitle: 'update-pkg-v2.dmg',
  leadingIcon: { type: 'symbol', name: 'arrow.down.circle.fill' },
  progressIndicator: { type: 'percentage' },
  progress: 0.35,
  accentColor: AtollColors.blue,
  sneakPeekConfig: { enabled: true, duration: 3.0 }
};

await client.presentLiveActivity(activity);

// Update progress
activity.progress = 0.45;
await client.updateLiveActivity(activity);`
    },
    {
      id: 'pomodoro',
      title: 'Pomodoro Timer',
      description: 'Focus timer with countdown display in the trailing content area',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentPomodoroActivity(),
          successMessage: 'Pomodoro timer started!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissLiveActivity('showcase-pomodoro'),
          successMessage: 'Timer dismissed!'
        }
      ],
      code: `const activity = {
  id: 'pomodoro',
  bundleIdentifier: 'com.myapp',
  priority: AtollLiveActivityPriority.High,
  title: 'Focus',
  subtitle: 'Pomodoro',
  leadingIcon: { type: 'symbol', name: 'brain.head.profile' },
  trailingContent: {
    type: 'countdownText',
    targetDate: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    font: { size: 13, weight: 'semibold', design: 'monospaced' }
  },
  accentColor: AtollColors.purple
};

await client.presentLiveActivity(activity);`
    },
    {
      id: 'news',
      title: 'News Marquee',
      description: 'Scrolling news headlines with marquee text animation',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentNewsActivity(),
          successMessage: 'News marquee presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissLiveActivity('showcase-news'),
          successMessage: 'News dismissed!'
        }
      ],
      code: `const activity = {
  id: 'news',
  bundleIdentifier: 'com.myapp',
  priority: AtollLiveActivityPriority.Normal,
  title: 'News',
  subtitle: 'Top headlines',
  leadingIcon: { type: 'symbol', name: 'newspaper.fill' },
  trailingContent: {
    type: 'marquee',
    text: 'Markets rally • New release ships today • Weather clears…',
    font: { size: 12, weight: 'semibold' },
    minDuration: 0.6
  },
  accentColor: AtollColors.white
};

await client.presentLiveActivity(activity);`
    },
    {
      id: 'spectrum',
      title: 'Audio Spectrum',
      description: 'Real-time audio spectrum visualizer in the trailing content',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentSpectrumActivity(),
          successMessage: 'Spectrum visualizer presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissLiveActivity('showcase-spectrum'),
          successMessage: 'Spectrum dismissed!'
        }
      ],
      code: `const activity = {
  id: 'spectrum',
  bundleIdentifier: 'com.myapp',
  priority: AtollLiveActivityPriority.Normal,
  title: 'Audio',
  subtitle: 'Spectrum',
  leadingIcon: { type: 'symbol', name: 'music.note' },
  trailingContent: { 
    type: 'spectrum', 
    color: AtollColors.accent 
  },
  accentColor: AtollColors.white
};

await client.presentLiveActivity(activity);`
    },
    {
      id: 'flight',
      title: 'Flight Tracker',
      description: 'Flight status with text trailing content showing progress',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentFlightActivity(),
          successMessage: 'Flight tracker presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissLiveActivity('showcase-flight'),
          successMessage: 'Flight dismissed!'
        }
      ],
      code: `const activity = {
  id: 'flight',
  bundleIdentifier: 'com.myapp',
  priority: AtollLiveActivityPriority.High,
  title: 'Flight',
  subtitle: 'SFO → JFK',
  leadingIcon: { type: 'symbol', name: 'airplane' },
  trailingContent: { type: 'text', text: '12%' },
  accentColor: AtollColors.white
};

await client.presentLiveActivity(activity);`
    },
    {
      id: 'ring-indicator',
      title: 'Ring Progress Indicator',
      description: 'Circular ring progress indicator for backup operations',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentRingIndicatorActivity(),
          successMessage: 'Ring indicator presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissLiveActivity('showcase-ring'),
          successMessage: 'Indicator dismissed!'
        }
      ],
      code: `const activity = {
  id: 'backup',
  bundleIdentifier: 'com.myapp',
  priority: AtollLiveActivityPriority.Normal,
  title: 'Backup',
  subtitle: 'Ring indicator',
  leadingIcon: { type: 'symbol', name: 'externaldrive.fill' },
  progressIndicator: { 
    type: 'ring', 
    diameter: 26, 
    strokeWidth: 3 
  },
  progress: 0.62,
  accentColor: AtollColors.white
};

await client.presentLiveActivity(activity);`
    },
    {
      id: 'bar-indicator',
      title: 'Bar Progress Indicator',
      description: 'Horizontal bar progress indicator for export operations',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentBarIndicatorActivity(),
          successMessage: 'Bar indicator presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissLiveActivity('showcase-bar'),
          successMessage: 'Indicator dismissed!'
        }
      ],
      code: `const activity = {
  id: 'export',
  bundleIdentifier: 'com.myapp',
  priority: AtollLiveActivityPriority.Normal,
  title: 'Export',
  subtitle: 'Bar indicator',
  leadingIcon: { type: 'symbol', name: 'film.fill' },
  progressIndicator: { 
    type: 'bar', 
    width: 90, 
    height: 4 
  },
  progress: 0.47,
  accentColor: AtollColors.orange
};

await client.presentLiveActivity(activity);`
    },
    {
      id: 'dismiss-all-activities',
      title: 'Dismiss All Activities',
      description: 'Remove all active live activities at once',
      actions: [
        {
          label: 'Dismiss All',
          variant: 'btn-danger',
          handler: (controller) => controller.dismissAllActivities(),
          successMessage: 'All activities dismissed!'
        }
      ]
    }
  ],
  
  lockScreenWidgets: [
    {
      id: 'inline-widget',
      title: 'Inline Widget',
      description: 'Compact inline layout widget with flight information',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentInlineWidget(),
          successMessage: 'Inline widget presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissLockScreenWidget('showcase-widget-inline'),
          successMessage: 'Widget dismissed!'
        }
      ],
      code: `const widget = {
  id: 'flight-widget',
  bundleIdentifier: 'com.myapp',
  layoutStyle: 'inline',
  position: { alignment: 'center', verticalOffset: 110 },
  material: 'frosted',
  content: [
    { type: 'icon', icon: { type: 'symbol', name: 'airplane.departure' } },
    { type: 'spacer', height: 4 },
    { type: 'text', text: 'Flight', font: { size: 15, weight: 'semibold' } },
    { type: 'text', text: 'SFO → JFK', font: { size: 13 } }
  ],
  accentColor: AtollColors.accent,
  dismissOnUnlock: true
};

await client.presentLockScreenWidget(widget);`
    },
    {
      id: 'card-widget',
      title: 'Card Widget (Liquid Glass)',
      description: 'Card layout with liquid glass material effect and charging status',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentCardWidget(),
          successMessage: 'Card widget presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissLockScreenWidget('showcase-widget-card'),
          successMessage: 'Widget dismissed!'
        }
      ],
      code: `const widget = {
  id: 'charging-widget',
  bundleIdentifier: 'com.myapp',
  layoutStyle: 'card',
  position: { alignment: 'leading', verticalOffset: -40, horizontalOffset: 50 },
  size: { width: 270, height: 160 },
  material: 'liquid',
  appearance: {
    tintColor: AtollColors.white,
    tintOpacity: 0.06,
    enableGlassHighlight: true,
    liquidGlassVariant: { rawValue: 12 }
  },
  cornerRadius: 24,
  content: [
    { type: 'text', text: 'Charging', font: { size: 14, weight: 'semibold' } },
    { type: 'progress', indicator: { type: 'bar', width: 190, height: 4 }, value: 0.76 },
    { type: 'gauge', value: 0.76, style: 'circular' }
  ]
};

await client.presentLockScreenWidget(widget);`
    },
    {
      id: 'circular-widget',
      title: 'Circular Widget',
      description: 'Circular layout widget with gauge indicator',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentCircularWidget(),
          successMessage: 'Circular widget presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissLockScreenWidget('showcase-widget-circular'),
          successMessage: 'Widget dismissed!'
        }
      ],
      code: `const widget = {
  id: 'gauge-widget',
  bundleIdentifier: 'com.myapp',
  layoutStyle: 'circular',
  position: { alignment: 'trailing', verticalOffset: 140, horizontalOffset: -70 },
  material: 'frosted',
  content: [
    { 
      type: 'gauge', 
      value: 0.55, 
      minValue: 0, 
      maxValue: 1, 
      style: 'circular' 
    }
  ],
  accentColor: AtollColors.white,
  dismissOnUnlock: true
};

await client.presentLockScreenWidget(widget);`
    },
    {
      id: 'web-widget',
      title: 'WebView Widget (Sparkline)',
      description: 'Custom widget with animated sparkline chart using Canvas',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentWebWidget(),
          successMessage: 'WebView widget presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissLockScreenWidget('showcase-widget-web'),
          successMessage: 'Widget dismissed!'
        }
      ],
      code: `import { createWebViewContentFromSource } from '@ebullioscopic/atoll-js';

const widget = {
  id: 'sparkline-widget',
  bundleIdentifier: 'com.myapp',
  layoutStyle: 'custom',
  position: { alignment: 'center', verticalOffset: -140 },
  size: { width: 320, height: 160 },
  material: 'clear',
  content: [{
    type: 'webView',
    content: createWebViewContentFromSource({
      body: '<canvas id="c"></canvas>',
      css: 'canvas { width:100%; height:70px; }',
      script: {
        language: 'ts',
        code: \`
          const canvas = document.getElementById('c') as HTMLCanvasElement;
          const ctx = canvas.getContext('2d');
          // Draw sparkline animation...
        \`
      },
      preferredHeight: 140,
      isTransparent: true
    })
  }]
};

await client.presentLockScreenWidget(widget);`
    },
    {
      id: 'dismiss-all-widgets',
      title: 'Dismiss All Widgets',
      description: 'Remove all active lock screen widgets at once',
      actions: [
        {
          label: 'Dismiss All',
          variant: 'btn-danger',
          handler: (controller) => controller.dismissAllWidgets(),
          successMessage: 'All widgets dismissed!'
        }
      ]
    }
  ],
  
  notchExperiences: [
    {
      id: 'simple-tab',
      title: 'Simple Tab Experience',
      description: 'Basic tab layout with text content and icon',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentSimpleTabExperience(),
          successMessage: 'Tab experience presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissNotchExperience('showcase-notch-tab'),
          successMessage: 'Experience dismissed!'
        }
      ],
      code: `const experience = {
  id: 'demo-tab',
  bundleIdentifier: 'com.myapp',
  priority: AtollLiveActivityPriority.Normal,
  accentColor: AtollColors.white,
  tab: {
    title: 'Demo',
    iconSymbolName: 'sparkles',
    preferredHeight: 190,
    sections: [{
      id: 'one',
      title: 'Hello',
      layout: 'stack',
      elements: [
        { type: 'text', text: 'Notch tab demo', font: { size: 16, weight: 'semibold' } },
        { type: 'text', text: 'From atoll-js!', font: { size: 12 } }
      ]
    }]
  }
};

await client.presentNotchExperience(experience);`
    },
    {
      id: 'minimalistic',
      title: 'Minimalistic Experience',
      description: 'Minimalistic override with metrics layout',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentMinimalisticExperience(),
          successMessage: 'Minimalistic experience presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissNotchExperience('showcase-notch-mini'),
          successMessage: 'Experience dismissed!'
        }
      ],
      code: `const experience = {
  id: 'mini-demo',
  bundleIdentifier: 'com.myapp',
  priority: AtollLiveActivityPriority.Normal,
  accentColor: AtollColors.white,
  minimalistic: {
    headline: 'Minimalistic',
    subtitle: 'Override demo',
    sections: [{
      id: 'm',
      layout: 'metrics',
      elements: [
        { type: 'text', text: 'Mode', font: { size: 12 } },
        { type: 'text', text: 'Active', font: { size: 14, weight: 'semibold' } }
      ]
    }],
    layout: 'metrics'
  }
};

await client.presentNotchExperience(experience);`
    },
    {
      id: 'combined',
      title: 'Combined Experience',
      description: 'Both tab and minimalistic layouts combined with system metrics',
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentCombinedExperience(),
          successMessage: 'Combined experience presented!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissNotchExperience('showcase-notch-combo'),
          successMessage: 'Experience dismissed!'
        }
      ],
      code: `const experience = {
  id: 'combined',
  bundleIdentifier: 'com.myapp',
  priority: AtollLiveActivityPriority.High,
  accentColor: AtollColors.white,
  tab: {
    title: 'Combined',
    iconSymbolName: 'square.stack.3d.up.fill',
    sections: [{
      id: 'a',
      title: 'Metrics',
      layout: 'metrics',
      elements: [
        { type: 'text', text: 'CPU', font: { size: 12 } },
        { type: 'text', text: '21%', font: { size: 14, weight: 'semibold', design: 'monospaced' } }
      ]
    }]
  },
  minimalistic: {
    headline: 'Combined Demo',
    subtitle: 'Tab + minimalistic',
    sections: [{
      id: 'b',
      layout: 'stack',
      elements: [
        { type: 'text', text: 'Everything works.' }
      ]
    }]
  }
};

await client.presentNotchExperience(experience);`
    },
    {
      id: 'flight-animation-canvas',
      title: 'Flight Animation (Canvas 2D)',
      description: 'Animated flight path with Canvas 2D rendering - SFO to JFK',
      hasProgress: true,
      initialProgress: 12,
      actions: [
        {
          label: 'Present',
          variant: 'btn-primary',
          handler: (controller) => controller.presentFlightAnimationCanvasExperience(),
          successMessage: 'Flight animation (Canvas) presented!'
        },
        {
          label: 'Update +10%',
          variant: 'btn-secondary',
          handler: (controller) => controller.updateFlightAnimationCanvasExperience(),
          successMessage: 'Flight progress updated!'
        },
        {
          label: 'Dismiss',
          variant: 'btn-danger',
          handler: (controller) => controller.client.dismissNotchExperience('showcase-notch-flight-canvas'),
          successMessage: 'Experience dismissed!'
        }
      ],
      code: `import { createWebViewContentFromSource } from '@ebullioscopic/atoll-js';

const flightWeb = createWebViewContentFromSource({
  body: '<canvas id="c"></canvas>',
  css: \`
    body { margin:0; background:transparent; overflow:hidden; }
    canvas { width:100%; height:100%; display:block; }
  \`,
  script: {
    language: 'ts',
    code: \`
      // Canvas 2D flight animation with bezier curve path
      const canvas = document.getElementById('c') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      let progress = 0.12;
      
      function resize() {
        canvas.width = Math.max(10, canvas.clientWidth) * devicePixelRatio;
        canvas.height = Math.max(10, canvas.clientHeight) * devicePixelRatio;
      }
      
      function quadBezier(p0, p1, p2, tt) {
        return {
          x: (1-tt)*(1-tt)*p0.x + 2*(1-tt)*tt*p1.x + tt*tt*p2.x,
          y: (1-tt)*(1-tt)*p0.y + 2*(1-tt)*tt*p1.y + tt*tt*p2.y
        };
      }
      
      function draw() {
        // Draw flight path, plane, and labels
        requestAnimationFrame(draw);
      }
      
      resize();
      window.addEventListener('resize', resize);
      requestAnimationFrame(draw);
    \`
  },
  preferredHeight: 200,
  isTransparent: true
});

const experience = {
  id: 'flight-canvas',
  bundleIdentifier: 'com.myapp',
  priority: AtollLiveActivityPriority.High,
  accentColor: AtollColors.white,
  metadata: { progress: '0.120', renderer: 'canvas2d' },
  tab: {
    title: 'Flight (Simple)',
    iconSymbolName: 'airplane.circle.fill',
    preferredHeight: 220,
    sections: [],
    webContent: flightWeb,
    allowWebInteraction: false,
    footnote: 'SFO → JFK'
  },
  minimalistic: {
    sections: [],
    webContent: { ...flightWeb, preferredHeight: 155 },
    layout: 'custom',
    hidesMusicControls: false
  }
};

await client.presentNotchExperience(experience);`
    },
    {
      id: 'dismiss-all-notch',
      title: 'Dismiss All Notch Experiences',
      description: 'Remove all active notch experiences at once',
      actions: [
        {
          label: 'Dismiss All',
          variant: 'btn-danger',
          handler: (controller) => controller.dismissAllNotchExperiences(),
          successMessage: 'All notch experiences dismissed!'
        }
      ]
    }
  ]
};
