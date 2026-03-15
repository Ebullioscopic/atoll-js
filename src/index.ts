// ─── Main Client ────────────────────────────────────────────────────
export { AtollClient, AtollClientOptions, AtollClientEvents } from './AtollClient';

// ─── Models ─────────────────────────────────────────────────────────
export {
  AtollColorDescriptor,
  AtollColors,
  isAccentColor,
  createColor,
} from './models/AtollColorDescriptor';

export {
  AtollIconDescriptor,
  AtollFontWeight,
  AtollFontDesign,
  AtollFontDescriptor,
  systemFont,
  monospacedDigitFont,
  symbolIcon,
  appIcon,
  noIcon,
} from './models/AtollIconDescriptor';

export { AtollLiveActivityPriority } from './models/AtollLiveActivityPriority';

export {
  AtollProgressIndicator,
  ringIndicator,
  barIndicator,
  percentageIndicator,
  countdownIndicator,
  noIndicator,
} from './models/AtollProgressIndicator';

export {
  AtollLiveActivityDescriptor,
  AtollTrailingContent,
  AtollSneakPeekStyle,
  AtollSneakPeekConfig,
  AtollCenterTextStyle,
  createLiveActivity,
} from './models/AtollLiveActivityDescriptor';

export {
  AtollLockScreenWidgetDescriptor,
  AtollWidgetLayoutStyle,
  AtollWidgetPosition,
  AtollWidgetAlignment,
  AtollWidgetClampMode,
  AtollWidgetMaterial,
  AtollWidgetAppearanceOptions,
  AtollWidgetContentElement,
  AtollWidgetWebContentDescriptor,
  AtollWidgetTextAlignment,
  AtollWidgetGaugeStyle,
  AtollLiquidGlassVariant,
  AtollWidgetBorderStyle,
  AtollWidgetShadowStyle,
  AtollWidgetContentInsets,
  createLockScreenWidget,
} from './models/AtollLockScreenWidgetDescriptor';

export {
  AtollNotchExperienceDescriptor,
  AtollNotchTabConfiguration,
  AtollNotchMinimalisticConfiguration,
  AtollMinimalisticLayout,
  AtollNotchContentSection,
  AtollNotchSectionLayout,
  createNotchExperience,
} from './models/AtollNotchExperienceDescriptor';

// ─── Errors ─────────────────────────────────────────────────────────
export { AtollError, AtollErrorCode } from './errors/AtollError';

// ─── Connection ─────────────────────────────────────────────────────
export { ATOLL_DEFAULT_HOST, ATOLL_DEFAULT_PORT } from './connection/WebSocketManager';
