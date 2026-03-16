# Error Handling

## Error Types

```typescript
import { AtollError, AtollErrorCode } from '@ebullioscopic/atoll-js';
```

## Error Codes

| Code | When It Occurs | Recovery |
|------|---------------|----------|
| `AtollNotReachable` | Atoll isn't running | Prompt user to launch Atoll |
| `IncompatibleVersion` | Atoll version mismatch | Prompt user to update |
| `NotAuthorized` | Not authorized | Call `requestAuthorization()` |
| `InvalidDescriptor` | Descriptor fails validation | Check descriptor fields |
| `ConnectionFailed` | WebSocket connection dropped | Auto-reconnects; retry |
| `ServiceUnavailable` | Atoll busy or restarting | Retry after delay |
| `LimitExceeded` | Too many concurrent items | Dismiss some first |
| `Timeout` | No response within 15s | Check Atoll responsiveness |
| `RPCError` | Server JSON-RPC error | Inspect message/details |

## Pattern

```typescript
try {
  await client.presentLiveActivity(activity);
} catch (error) {
  if (error instanceof AtollError) {
    switch (error.code) {
      case AtollErrorCode.AtollNotReachable:
        console.log('Please launch Atoll first');
        break;
      case AtollErrorCode.NotAuthorized:
        const ok = await client.requestAuthorization();
        if (ok) await client.presentLiveActivity(activity);
        break;
      case AtollErrorCode.InvalidDescriptor:
        console.log('Fix descriptor:', error.details);
        break;
      case AtollErrorCode.Timeout:
        await client.presentLiveActivity(activity); // retry
        break;
      default:
        console.error(error.message);
    }
  }
}
```
