import { AtollColorDescriptor, AtollColors } from './AtollColorDescriptor';
import { AtollIconDescriptor, AtollFontDescriptor } from './AtollIconDescriptor';
import { AtollLiveActivityPriority } from './AtollLiveActivityPriority';
import { AtollProgressIndicator } from './AtollProgressIndicator';

// ─── Layout & Position ──────────────────────────────────────────────

export type AtollWidgetLayoutStyle = 'inline' | 'circular' | 'card' | 'custom';

export type AtollWidgetAlignment = 'leading' | 'center' | 'trailing';
export type AtollWidgetClampMode = 'safeRegion' | 'relaxed' | 'unconstrained';

export interface AtollWidgetPosition {
  alignment: AtollWidgetAlignment;
  verticalOffset: number;
  horizontalOffset: number;
  clampMode: AtollWidgetClampMode;
}

export type AtollWidgetMaterial = 'frosted' | 'liquid' | 'solid' | 'semiTransparent' | 'clear';

// ─── Appearance ─────────────────────────────────────────────────────

export interface AtollLiquidGlassVariant {
  rawValue: number; // 0–19
}

export interface AtollWidgetBorderStyle {
  color: AtollColorDescriptor;
  opacity: number;
  width: number;
}

export interface AtollWidgetShadowStyle {
  color: AtollColorDescriptor;
  opacity: number;
  radius: number;
  offset: { width: number; height: number };
}

export interface AtollWidgetContentInsets {
  top: number;
  leading: number;
  bottom: number;
  trailing: number;
}

export interface AtollWidgetAppearanceOptions {
  tintColor?: AtollColorDescriptor;
  tintOpacity: number;
  enableGlassHighlight: boolean;
  contentInsets?: AtollWidgetContentInsets;
  border?: AtollWidgetBorderStyle;
  shadow?: AtollWidgetShadowStyle;
  liquidGlassVariant?: AtollLiquidGlassVariant;
}

// ─── Content Elements ───────────────────────────────────────────────

export type AtollWidgetTextAlignment = 'leading' | 'center' | 'trailing';
export type AtollWidgetGaugeStyle = 'circular' | 'linear';

export interface AtollWidgetWebContentDescriptor {
  html: string;
  preferredHeight: number;
  isTransparent: boolean;
  allowLocalhostRequests: boolean;
  backgroundColor?: AtollColorDescriptor;
  maximumContentWidth?: number;
}

export type AtollWidgetContentElement =
  | { type: 'text'; text: string; font: AtollFontDescriptor; color?: AtollColorDescriptor; alignment?: AtollWidgetTextAlignment }
  | { type: 'icon'; icon: AtollIconDescriptor; tint?: AtollColorDescriptor }
  | { type: 'progress'; indicator: AtollProgressIndicator; value: number; color?: AtollColorDescriptor }
  | { type: 'graph'; data: number[]; color: AtollColorDescriptor; size: { width: number; height: number } }
  | { type: 'gauge'; value: number; minValue?: number; maxValue?: number; style?: AtollWidgetGaugeStyle; color?: AtollColorDescriptor }
  | { type: 'spacer'; height: number }
  | { type: 'divider'; color?: AtollColorDescriptor; thickness?: number }
  | { type: 'webView'; content: AtollWidgetWebContentDescriptor };

// ─── Main Descriptor ────────────────────────────────────────────────

export interface AtollLockScreenWidgetDescriptor {
  id: string;
  bundleIdentifier: string;
  layoutStyle: AtollWidgetLayoutStyle;
  position: AtollWidgetPosition;
  size: { width: number; height: number };
  material: AtollWidgetMaterial;
  appearance?: AtollWidgetAppearanceOptions;
  cornerRadius: number;
  content: AtollWidgetContentElement[];
  accentColor: AtollColorDescriptor;
  dismissOnUnlock: boolean;
  priority: AtollLiveActivityPriority;
  metadata: Record<string, string>;
}

// ─── Builder ────────────────────────────────────────────────────────

export function createLockScreenWidget(
  options: Partial<AtollLockScreenWidgetDescriptor> &
    Pick<AtollLockScreenWidgetDescriptor, 'id' | 'content'>
): AtollLockScreenWidgetDescriptor {
  return {
    bundleIdentifier: '',
    layoutStyle: 'inline',
    position: { alignment: 'center', verticalOffset: 0, horizontalOffset: 0, clampMode: 'safeRegion' },
    size: { width: 200, height: 48 },
    material: 'frosted',
    cornerRadius: 16,
    accentColor: AtollColors.accent,
    dismissOnUnlock: true,
    priority: AtollLiveActivityPriority.Normal,
    metadata: {},
    ...options,
  };
}
