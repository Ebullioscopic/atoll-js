# TypeScript API Reference

## AtollClient

```typescript
class AtollClient extends EventEmitter {
  constructor(options?: AtollClientOptions);
  
  // Connection
  connect(): Promise<void>;
  disconnect(): void;
  readonly isConnected: boolean;
  
  // Version
  getAtollVersion(): Promise<string>;
  
  // Authorization
  requestAuthorization(): Promise<boolean>;
  checkAuthorization(): Promise<boolean>;
  
  // Live Activities
  presentLiveActivity(descriptor: AtollLiveActivityDescriptor): Promise<void>;
  updateLiveActivity(descriptor: AtollLiveActivityDescriptor): Promise<void>;
  dismissLiveActivity(activityID: string): Promise<void>;
  
  // Lock Screen Widgets
  presentLockScreenWidget(descriptor: AtollLockScreenWidgetDescriptor): Promise<void>;
  updateLockScreenWidget(descriptor: AtollLockScreenWidgetDescriptor): Promise<void>;
  dismissLockScreenWidget(widgetID: string): Promise<void>;
  
  // Notch Experiences
  presentNotchExperience(descriptor: AtollNotchExperienceDescriptor): Promise<void>;
  updateNotchExperience(descriptor: AtollNotchExperienceDescriptor): Promise<void>;
  dismissNotchExperience(experienceID: string): Promise<void>;
}
```

### AtollClientOptions

```typescript
interface AtollClientOptions {
  host?: string;               // default: 'localhost'
  port?: number;               // default: 9020
  bundleIdentifier?: string;   // your app's bundle ID
}
```

### Events

```typescript
interface AtollClientEvents {
  authorizationChange: (isAuthorized: boolean) => void;
  activityDismiss: (activityID: string) => void;
  widgetDismiss: (widgetID: string) => void;
  notchExperienceDismiss: (experienceID: string) => void;
  connected: () => void;
  disconnected: () => void;
}
```

---

## Builder Functions

### Live Activities

```typescript
function createLiveActivity(
  options: Partial<AtollLiveActivityDescriptor> & { id: string; title: string; leadingIcon: AtollIconDescriptor }
): AtollLiveActivityDescriptor;
```

### Lock Screen Widgets

```typescript
function createLockScreenWidget(
  options: Partial<AtollLockScreenWidgetDescriptor> & { id: string; content: AtollWidgetContentElement[] }
): AtollLockScreenWidgetDescriptor;
```

### Notch Experiences

```typescript
function createNotchExperience(
  options: Partial<AtollNotchExperienceDescriptor> & { id: string }
): AtollNotchExperienceDescriptor;
```

---

## Icon Factories

```typescript
function symbolIcon(name: string, size?: number, weight?: AtollFontWeight): AtollIconDescriptor;
function appIcon(bundleIdentifier: string, size?: Size, cornerRadius?: number): AtollIconDescriptor;
function noIcon(): AtollIconDescriptor;
```

## Font Factories

```typescript
function systemFont(size: number, weight?: AtollFontWeight, design?: AtollFontDesign): AtollFontDescriptor;
function monospacedDigitFont(size: number, weight?: AtollFontWeight): AtollFontDescriptor;
```

## Progress Indicator Factories

```typescript
function ringIndicator(diameter?: number, strokeWidth?: number, color?: AtollColorDescriptor): AtollProgressIndicator;
function barIndicator(width?: number | null, height?: number, cornerRadius?: number, color?: AtollColorDescriptor): AtollProgressIndicator;
function percentageIndicator(color?: AtollColorDescriptor): AtollProgressIndicator;
function countdownIndicator(color?: AtollColorDescriptor): AtollProgressIndicator;
function noIndicator(): AtollProgressIndicator;
```

## Color Constants

```typescript
const AtollColors = {
  white, black, red, green, blue,
  yellow, orange, purple, pink, gray,
  accent,  // system accent color (resolved by Atoll)
};

function createColor(red: number, green: number, blue: number, alpha?: number): AtollColorDescriptor;
function isAccentColor(color: AtollColorDescriptor): boolean;
```

---

## Enums

```typescript
enum AtollLiveActivityPriority { Low = 'low', Normal = 'normal', High = 'high', Critical = 'critical' }
type AtollFontWeight = 'ultraLight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black';
type AtollFontDesign = 'default' | 'serif' | 'rounded' | 'monospaced';
type AtollCenterTextStyle = 'inheritUser' | 'standard' | 'inline';
type AtollSneakPeekStyle = 'standard' | 'inline';
type AtollWidgetLayoutStyle = 'inline' | 'circular' | 'card' | 'custom';
type AtollWidgetMaterial = 'frosted' | 'liquid' | 'solid' | 'semiTransparent' | 'clear';
type AtollWidgetAlignment = 'leading' | 'center' | 'trailing';
type AtollWidgetClampMode = 'safeRegion' | 'relaxed' | 'unconstrained';
type AtollNotchSectionLayout = 'stack' | 'columns' | 'metrics';
type AtollMinimalisticLayout = 'stack' | 'metrics' | 'custom';
```

---

## Error Types

```typescript
class AtollError extends Error {
  readonly code: AtollErrorCode;
  readonly details?: string;
}

enum AtollErrorCode {
  AtollNotReachable, IncompatibleVersion, NotAuthorized,
  InvalidDescriptor, ConnectionFailed, ServiceUnavailable,
  LimitExceeded, Timeout, RPCError, Unknown,
}
```
