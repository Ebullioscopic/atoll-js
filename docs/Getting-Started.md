# Getting Started

## Installation

```bash
npm install @ebullioscopic/atoll-js
```

### Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 18.0+ |
| Atoll | 1.0.0+ (with RPC server enabled) |

## Your First Live Activity

```typescript
import {
  AtollClient,
  createLiveActivity,
  symbolIcon,
  AtollColors,
} from '@ebullioscopic/atoll-js';

async function main() {
  // 1. Create client
  const client = new AtollClient({
    bundleIdentifier: 'com.myapp.example',
  });

  // 2. Connect to Atoll
  await client.connect();
  console.log('Connected to Atoll');

  // 3. Request authorization
  const authorized = await client.requestAuthorization();
  if (!authorized) {
    console.log('Not authorized');
    return;
  }

  // 4. Create a live activity
  const activity = createLiveActivity({
    id: 'my-timer',
    title: 'Timer',
    subtitle: '25:00 remaining',
    leadingIcon: symbolIcon('timer'),
    accentColor: AtollColors.blue,
  });

  // 5. Present it
  await client.presentLiveActivity(activity);
  console.log('Timer shown!');
}

main().catch(console.error);
```

## Key Concepts

### Descriptors

All visual elements use **descriptor** interfaces. Each descriptor is a complete snapshot of the UI:

| Interface | Use Case |
|-----------|----------|
| `AtollLiveActivityDescriptor` | Compact activity in the Dynamic Island notch |
| `AtollLockScreenWidgetDescriptor` | Widget shown on the lock screen |
| `AtollNotchExperienceDescriptor` | Rich content inside the expanded notch |

### Builder Functions

atoll-js provides convenient builder functions that fill in sensible defaults:

```typescript
// Instead of specifying every field...
const activity = createLiveActivity({
  id: 'my-timer',
  title: 'Timer',
  leadingIcon: symbolIcon('timer'),
  // All other fields use defaults
});
```

### Events

The client uses Node.js `EventEmitter` for callbacks:

```typescript
client.on('authorizationChange', (isAuthorized) => { ... });
client.on('activityDismiss', (activityID) => { ... });
client.on('connected', () => { ... });
client.on('disconnected', () => { ... });
```

## Next Steps

- [Connection & Authorization](Connection-And-Authorization.md) — connection lifecycle and callback events
- [Live Activities](Live-Activities.md) — all live activity options
- [TypeScript API Reference](TypeScript-API-Reference.md) — complete type definitions
