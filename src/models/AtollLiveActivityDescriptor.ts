import { AtollColorDescriptor, AtollColors } from './AtollColorDescriptor';
import { AtollIconDescriptor, AtollFontDescriptor } from './AtollIconDescriptor';
import { AtollLiveActivityPriority } from './AtollLiveActivityPriority';
import { AtollProgressIndicator } from './AtollProgressIndicator';

// ─── Trailing Content ───────────────────────────────────────────────

export type AtollTrailingContent =
  | { type: 'text'; text: string; font?: AtollFontDescriptor; color?: AtollColorDescriptor }
  | { type: 'marquee'; text: string; font?: AtollFontDescriptor; minDuration?: number; color?: AtollColorDescriptor }
  | { type: 'countdownText'; targetDate: string; font?: AtollFontDescriptor; color?: AtollColorDescriptor }
  | { type: 'icon'; icon: AtollIconDescriptor }
  | { type: 'spectrum'; color?: AtollColorDescriptor }
  | { type: 'animation'; data: string; size?: { width: number; height: number } }
  | { type: 'none' };

// ─── Sneak Peek ─────────────────────────────────────────────────────

export type AtollSneakPeekStyle = 'standard' | 'inline';

export interface AtollSneakPeekConfig {
  enabled: boolean;
  duration?: number | null;
  style?: AtollSneakPeekStyle | null;
  showOnUpdate: boolean;
}

export type AtollCenterTextStyle = 'inheritUser' | 'standard' | 'inline';

// ─── Main Descriptor ────────────────────────────────────────────────

export interface AtollLiveActivityDescriptor {
  id: string;
  bundleIdentifier: string;
  priority: AtollLiveActivityPriority;
  title: string;
  subtitle?: string;
  leadingIcon: AtollIconDescriptor;
  trailingContent?: AtollTrailingContent;
  progressIndicator?: AtollProgressIndicator;
  progress?: number;
  accentColor: AtollColorDescriptor;
  badgeIcon?: AtollIconDescriptor;
  allowsMusicCoexistence?: boolean;
  estimatedDuration?: number | null;
  metadata?: Record<string, string>;
  leadingContent?: AtollTrailingContent | null;
  centerTextStyle?: AtollCenterTextStyle;
  sneakPeekConfig?: AtollSneakPeekConfig | null;
  sneakPeekTitle?: string | null;
  sneakPeekSubtitle?: string | null;
}

// ─── Builder ────────────────────────────────────────────────────────

export function createLiveActivity(
  options: Partial<AtollLiveActivityDescriptor> & Pick<AtollLiveActivityDescriptor, 'id' | 'title' | 'leadingIcon'>
): AtollLiveActivityDescriptor {
  return {
    bundleIdentifier: '',
    priority: AtollLiveActivityPriority.Normal,
    subtitle: undefined,
    trailingContent: { type: 'none' },
    progressIndicator: undefined,
    progress: 0,
    accentColor: AtollColors.accent,
    badgeIcon: undefined,
    allowsMusicCoexistence: false,
    estimatedDuration: null,
    metadata: {},
    leadingContent: null,
    centerTextStyle: 'inheritUser',
    sneakPeekConfig: null,
    sneakPeekTitle: null,
    sneakPeekSubtitle: null,
    ...options,
  };
}
