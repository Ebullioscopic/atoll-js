# Connection & Authorization

## Creating a Client

```typescript
import { AtollClient } from '@ebullioscopic/atoll-js';

const client = new AtollClient({
  host: 'localhost',        // default
  port: 9020,               // default
  bundleIdentifier: 'com.myapp.example',
});
```

## Connection Lifecycle

```typescript
// Connect
await client.connect();

// Check status
console.log(client.isConnected); // true

// Disconnect
client.disconnect();
```

### Auto-Reconnect

The client automatically reconnects with exponential backoff if the connection drops:

| Attempt | Delay |
|---------|-------|
| 1 | 1 second |
| 2 | 2 seconds |
| 3 | 4 seconds |
| 4 | 8 seconds |
| 5 | 16 seconds |

### Connection Events

```typescript
client.on('connected', () => {
  console.log('Connected to Atoll');
});

client.on('disconnected', () => {
  console.log('Disconnected from Atoll');
});

client.on('atollActive', () => {
  console.log('Atoll became active');
});

client.on('atollIdle', () => {
  console.log('Atoll became idle');
});
```

`atollActive` and `atollIdle` are lifecycle-oriented aliases over connection
state and can be used to switch your app between active and idle modes.

## Authorization

### Request Authorization

```typescript
const authorized = await client.requestAuthorization();
if (authorized) {
  // Present content
}
```

### Check Authorization

```typescript
const isAuthorized = await client.checkAuthorization();
```

### Authorization Change Event

```typescript
client.on('authorizationChange', (isAuthorized: boolean) => {
  if (isAuthorized) {
    console.log('App authorized');
  } else {
    console.log('Authorization revoked');
  }
});
```

## Version Check

```typescript
const version = await client.getAtollVersion();
console.log(`Atoll v${version}`);
```
