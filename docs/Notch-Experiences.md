# Notch Experiences

## Tab Configuration

```typescript
import { createNotchExperience, systemFont, AtollColors } from '@ebullioscopic/atoll-js';

const experience = createNotchExperience({
  id: 'my-dashboard',
  tab: {
    title: 'Dashboard',
    iconSymbolName: 'gauge.with.dots.needle.33percent',
    preferredHeight: 200,
    sections: [
      {
        id: 'metrics',
        title: 'System',
        layout: 'metrics',
        elements: [
          { type: 'text', text: 'CPU', font: systemFont(12), color: AtollColors.white },
          { type: 'text', text: '21%', font: systemFont(14, 'semibold'), color: AtollColors.white },
        ],
      },
    ],
    allowWebInteraction: false,
  },
});

await client.presentNotchExperience(experience);
```

## Minimalistic Configuration

```typescript
const experience = createNotchExperience({
  id: 'mini-status',
  minimalistic: {
    headline: 'Focus Mode',
    subtitle: 'Deep work session',
    sections: [
      {
        layout: 'metrics',
        elements: [
          { type: 'text', text: 'Time', font: systemFont(12), color: AtollColors.white },
          { type: 'text', text: '1:42', font: systemFont(14, 'semibold'), color: AtollColors.white },
        ],
      },
    ],
    layout: 'metrics',
    hidesMusicControls: false,
  },
});
```

## Combined (Tab + Minimalistic)

```typescript
const experience = createNotchExperience({
  id: 'flight-tracker',
  tab: {
    title: 'Flight',
    iconSymbolName: 'airplane.circle.fill',
    preferredHeight: 220,
    sections: [],
    webContent: {
      html: flightHTML,
      preferredHeight: 230,
      isTransparent: true,
      allowLocalhostRequests: false,
    },
    allowWebInteraction: false,
  },
  minimalistic: {
    headline: 'SFO → JFK',
    subtitle: 'In flight',
    sections: [],
    layout: 'stack',
    hidesMusicControls: false,
  },
});
```

## Content Sections

```typescript
{
  id: 'section-1',
  title: 'System Metrics',
  subtitle: 'Real-time monitoring',
  layout: 'metrics',         // 'stack', 'columns', 'metrics'
  elements: [
    { type: 'text', text: 'CPU', font: systemFont(12) },
    { type: 'gauge', value: 0.45, style: 'linear', color: AtollColors.green },
  ],
}
```

### Limits

| Constraint | Limit |
|------------|-------|
| Sections per tab | 6 |
| Sections per minimalistic | 3 |
| Elements per section | 6 |

## Update & Dismiss

```typescript
await client.updateNotchExperience(updatedExperience);
await client.dismissNotchExperience('flight-tracker');

client.on('notchExperienceDismiss', (experienceID) => {
  console.log(`Experience ${experienceID} dismissed`);
});
```
