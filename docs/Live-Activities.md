# Live Activities

## Basic Usage

```typescript
import {
  createLiveActivity, symbolIcon, AtollColors,
  AtollLiveActivityPriority
} from '@ebullioscopic/atoll-js';

const activity = createLiveActivity({
  id: 'my-download',
  title: 'Downloading',
  subtitle: 'update-v2.dmg',
  leadingIcon: symbolIcon('arrow.down.circle.fill'),
  accentColor: AtollColors.blue,
  priority: AtollLiveActivityPriority.Low,
});

await client.presentLiveActivity(activity);
```

## Priority Levels

```typescript
enum AtollLiveActivityPriority {
  Low = 'low',           // Yields to others
  Normal = 'normal',     // Default
  High = 'high',         // Takes precedence
  Critical = 'critical', // Always shown
}
```

## Leading Icons

```typescript
import { symbolIcon, appIcon, noIcon } from '@ebullioscopic/atoll-js';

// SF Symbol
symbolIcon('timer', 16, 'regular')

// App icon
appIcon('com.apple.Safari', { width: 20, height: 20 }, 4)

// Image data (base64 encoded)
{ type: 'image', data: base64String, size: { width: 20, height: 20 } }

// No icon
noIcon()
```

## Trailing Content

```typescript
// Text
trailingContent: { type: 'text', text: 'LIVE' }

// Marquee (scrolling text)
trailingContent: {
  type: 'marquee',
  text: 'Breaking news • Markets rally…',
  minDuration: 0.6,
}

// Countdown
trailingContent: {
  type: 'countdownText',
  targetDate: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
}

// Icon
trailingContent: { type: 'icon', icon: symbolIcon('checkmark.circle.fill') }

// Spectrum visualizer
trailingContent: { type: 'spectrum', color: AtollColors.accent }

// None (use with progress indicator)
trailingContent: { type: 'none' }
```

## Progress Indicators

```typescript
import {
  ringIndicator, barIndicator, percentageIndicator,
  countdownIndicator, noIndicator
} from '@ebullioscopic/atoll-js';

// Ring
progressIndicator: ringIndicator(24, 3, AtollColors.blue)

// Bar
progressIndicator: barIndicator(null, 4, 2)

// Percentage text
progressIndicator: percentageIndicator()

// Countdown
progressIndicator: countdownIndicator()

// Value (0.0 to 1.0)
progress: 0.47
```

## Sneak Peek

```typescript
// Standard
sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false }

// Disabled
sneakPeekConfig: { enabled: false, duration: null, style: null, showOnUpdate: false }

// Override text
sneakPeekTitle: 'Download',
sneakPeekSubtitle: '47% complete',
```

## Full Example

```typescript
const activity = createLiveActivity({
  id: 'download-v2',
  title: 'Downloading',
  subtitle: 'update-pkg-v2.dmg',
  leadingIcon: symbolIcon('arrow.down.circle.fill'),
  trailingContent: { type: 'none' },
  progressIndicator: percentageIndicator(),
  progress: 0.47,
  accentColor: AtollColors.blue,
  priority: AtollLiveActivityPriority.Low,
  allowsMusicCoexistence: true,
  centerTextStyle: 'inheritUser',
  sneakPeekConfig: { enabled: true, duration: 3.0, style: 'standard', showOnUpdate: false },
  sneakPeekTitle: 'Download',
  sneakPeekSubtitle: '47% complete',
});

await client.presentLiveActivity(activity);
```

## Update & Dismiss

```typescript
// Update
activity.progress = 0.75;
await client.updateLiveActivity(activity);

// Dismiss
await client.dismissLiveActivity('download-v2');

// Dismissal event
client.on('activityDismiss', (activityID) => {
  console.log(`Activity ${activityID} dismissed`);
});
```
