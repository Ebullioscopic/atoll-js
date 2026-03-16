# Lock Screen Widgets

## Basic Usage

```typescript
import {
  createLockScreenWidget, symbolIcon, systemFont,
  AtollColors, AtollLiveActivityPriority
} from '@ebullioscopic/atoll-js';

const widget = createLockScreenWidget({
  id: 'my-widget',
  content: [
    { type: 'icon', icon: symbolIcon('airplane.departure') },
    { type: 'spacer', height: 4 },
    { type: 'text', text: 'Flight', font: systemFont(15, 'semibold'), color: AtollColors.white },
  ],
});

await client.presentLockScreenWidget(widget);
```

## Layout Styles

| Style | Default Size | Description |
|-------|-------------|-------------|
| `'inline'` | 200 × 48 | Horizontal strip |
| `'circular'` | 100 × 100 | Round widget |
| `'card'` | 220 × 120 | Rectangular card |
| `'custom'` | 150 × 80 | Freeform |

## Position

```typescript
position: {
  alignment: 'center',      // 'leading', 'center', 'trailing'
  verticalOffset: 110,       // -400 to 400
  horizontalOffset: 0,       // -600 to 600
  clampMode: 'safeRegion',   // 'safeRegion', 'relaxed', 'unconstrained'
}
```

## Materials

`'frosted'` | `'liquid'` | `'solid'` | `'semiTransparent'` | `'clear'`

## Content Elements

```typescript
// Text
{ type: 'text', text: 'CPU', font: systemFont(14, 'semibold'), color: AtollColors.white }

// Icon
{ type: 'icon', icon: symbolIcon('bolt.fill'), tint: AtollColors.yellow }

// Progress
{ type: 'progress', indicator: barIndicator(190, 4), value: 0.76, color: AtollColors.green }

// Gauge
{ type: 'gauge', value: 0.55, minValue: 0, maxValue: 1, style: 'circular' }

// Graph
{ type: 'graph', data: [0.2, 0.5, 0.8], color: AtollColors.blue, size: { width: 150, height: 40 } }

// Spacer / Divider
{ type: 'spacer', height: 8 }
{ type: 'divider', color: AtollColors.white, thickness: 1 }

// Web view
{ type: 'webView', content: { html: '<html>...</html>', preferredHeight: 140, isTransparent: true, allowLocalhostRequests: false } }
```

## Appearance Options

```typescript
appearance: {
  tintColor: AtollColors.white,
  tintOpacity: 0.06,
  enableGlassHighlight: true,
  contentInsets: { top: 12, leading: 16, bottom: 12, trailing: 16 },
  border: { color: AtollColors.white, opacity: 0.35, width: 1 },
  shadow: { color: AtollColors.black, opacity: 0.45, radius: 18, offset: { width: 0, height: 0 } },
  liquidGlassVariant: { rawValue: 12 },  // 0–19
}
```

## Update & Dismiss

```typescript
await client.updateLockScreenWidget(updatedWidget);
await client.dismissLockScreenWidget('my-widget');

client.on('widgetDismiss', (widgetID) => {
  console.log(`Widget ${widgetID} dismissed`);
});
```
