# Architecture

## Overview

```
┌─────────────────────────────────────┐
│           Your Node.js App           │
│  ┌───────────────────────────────┐  │
│  │        AtollClient            │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   WebSocketManager      │  │  │
│  │  │   (ws library)          │  │  │
│  │  └────────────┬────────────┘  │  │
│  └───────────────┼───────────────┘  │
└──────────────────┼──────────────────┘
                   │ WebSocket (ws://localhost:9020)
                   │ JSON-RPC 2.0
┌──────────────────┼──────────────────┐
│             Atoll App                │
│  ┌───────────────▼───────────────┐  │
│  │    ExtensionRPCServer         │  │
│  │    (Network.framework)        │  │
│  └───────────────┬───────────────┘  │
│                  │                   │
│   ┌──────────────▼────────────────┐  │
│   │      Extension Managers       │  │
│   │  • LiveActivity               │  │
│   │  • LockScreenWidget           │  │
│   │  • NotchExperience             │  │
│   │  • Authorization               │  │
│   └───────────────────────────────┘  │
└──────────────────────────────────────┘
```

## Cross-Language Compatibility

atoll-js and AtollRPC (Swift) use the **same JSON-RPC protocol** and connect to the **same server**:

| Feature | AtollRPC (Swift) | atoll-js (TypeScript) |
|---------|------------------|----------------------|
| Transport | `URLSessionWebSocketTask` | `ws` npm package |
| API style | `async/await` methods | `async/await` methods |
| Callbacks | Closure-based | EventEmitter |
| Types | `Codable` structs | TypeScript interfaces |
| Builders | Initializers with defaults | Builder functions |
| Default port | `9020` | `9020` |

## JSON-RPC 2.0 Methods

See the [AtollRPC Architecture](https://github.com/Ebullioscopic/AtollRPC/blob/main/docs/Architecture.md) docs for the complete method reference — both SDKs use identical methods.

### System
- `atoll.getVersion`

### Authorization
- `atoll.requestAuthorization` / `atoll.checkAuthorization`
- `atoll.authorizationDidChange` (notification)

### Live Activities
- `atoll.presentLiveActivity` / `atoll.updateLiveActivity` / `atoll.dismissLiveActivity`
- `atoll.activityDidDismiss` (notification)

### Lock Screen Widgets
- `atoll.presentLockScreenWidget` / `atoll.updateLockScreenWidget` / `atoll.dismissLockScreenWidget`
- `atoll.widgetDidDismiss` (notification)

### Notch Experiences
- `atoll.presentNotchExperience` / `atoll.updateNotchExperience` / `atoll.dismissNotchExperience`
- `atoll.notchExperienceDidDismiss` (notification)
