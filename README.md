# atoll-js

A JavaScript/TypeScript SDK for interacting with [Atoll](https://github.com/Ebullioscopic/Atoll) via JSON-RPC over WebSocket. Display **live activities**, **lock screen widgets**, and **notch experiences** from any application.

## Requirements

- Node.js 18+
- Atoll with RPC server enabled (v1.0.0+)

## Installation

```bash
npm install @ebullioscopic/atoll-js
```

## Quick Start

```typescript
import {
  AtollClient,
  createLiveActivity,
  symbolIcon,
  AtollColors,
  AtollLiveActivityPriority,
} from '@ebullioscopic/atoll-js';

const client = new AtollClient({ bundleIdentifier: 'com.myapp.example' });

await client.connect();

const authorized = await client.requestAuthorization();
if (authorized) {
  const activity = createLiveActivity({
    id: 'my-timer',
    title: 'Timer',
    subtitle: '25:00',
    leadingIcon: symbolIcon('timer'),
    priority: AtollLiveActivityPriority.High,
    accentColor: AtollColors.blue,
  });

  await client.presentLiveActivity(activity);
}
```

## API Reference

### `AtollClient`

```typescript
const client = new AtollClient({
  host: 'localhost',      // default
  port: 9020,             // default
  bundleIdentifier: 'com.myapp',
});
```

#### Connection
- `connect()` — Connect to Atoll (auto-reconnects)
- `disconnect()` — Disconnect
- `isConnected` — Check connection status

#### Authorization
- `requestAuthorization()` — Request user authorization
- `checkAuthorization()` — Check current status

#### Live Activities
- `presentLiveActivity(descriptor)` — Show a live activity
- `updateLiveActivity(descriptor)` — Update existing
- `dismissLiveActivity(activityID)` — Remove

#### Lock Screen Widgets
- `presentLockScreenWidget(descriptor)` — Show a widget
- `updateLockScreenWidget(descriptor)` — Update existing
- `dismissLockScreenWidget(widgetID)` — Remove

#### Notch Experiences
- `presentNotchExperience(descriptor)` — Show rich content
- `updateNotchExperience(descriptor)` — Update existing
- `dismissNotchExperience(experienceID)` — Remove

### Events

```typescript
client.on('authorizationChange', (isAuthorized: boolean) => { ... });
client.on('activityDismiss', (activityID: string) => { ... });
client.on('widgetDismiss', (widgetID: string) => { ... });
client.on('notchExperienceDismiss', (experienceID: string) => { ... });
client.on('connected', () => { ... });
client.on('disconnected', () => { ... });
```

### Builder Functions

| Function | Description |
|----------|-------------|
| `createLiveActivity(opts)` | Create a live activity descriptor |
| `createLockScreenWidget(opts)` | Create a widget descriptor |
| `createNotchExperience(opts)` | Create a notch experience descriptor |
| `symbolIcon(name, size?, weight?)` | Create an SF Symbol icon |
| `systemFont(size, weight?, design?)` | Create a font descriptor |
| `ringIndicator(diameter?, strokeWidth?)` | Create a ring progress indicator |
| `barIndicator(width?, height?)` | Create a bar progress indicator |

## Architecture

```
┌──────────────┐   JSON-RPC/WS   ┌──────────────┐
│  Your App    │◄───────────────►│    Atoll     │
│  (atoll-js)  │  localhost:9020 │  (RPC Server)│
└──────────────┘                 └──────────────┘
```

## Error Handling

```typescript
import { AtollError, AtollErrorCode } from '@ebullioscopic/atoll-js';

try {
  await client.presentLiveActivity(activity);
} catch (error) {
  if (error instanceof AtollError) {
    switch (error.code) {
      case AtollErrorCode.AtollNotReachable:
        console.log('Atoll is not running');
        break;
      case AtollErrorCode.NotAuthorized:
        console.log('Please authorize in Atoll Settings');
        break;
    }
  }
}
```

## License

MIT License — see [LICENSE](LICENSE) for details.
