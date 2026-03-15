import { AtollColorDescriptor, AtollColors } from './AtollColorDescriptor';
import { AtollIconDescriptor } from './AtollIconDescriptor';
import { AtollLiveActivityPriority } from './AtollLiveActivityPriority';
import {
  AtollWidgetAppearanceOptions,
  AtollWidgetContentElement,
  AtollWidgetWebContentDescriptor,
} from './AtollLockScreenWidgetDescriptor';

// ─── Content Sections ───────────────────────────────────────────────

export type AtollNotchSectionLayout = 'stack' | 'columns' | 'metrics';

export interface AtollNotchContentSection {
  id?: string;
  title?: string;
  subtitle?: string;
  layout: AtollNotchSectionLayout;
  elements: AtollWidgetContentElement[];
}

// ─── Tab Configuration ──────────────────────────────────────────────

export interface AtollNotchTabConfiguration {
  title: string;
  iconSymbolName?: string;
  badgeIcon?: AtollIconDescriptor;
  preferredHeight?: number;
  appearance?: AtollWidgetAppearanceOptions;
  sections: AtollNotchContentSection[];
  webContent?: AtollWidgetWebContentDescriptor;
  allowWebInteraction: boolean;
  footnote?: string;
}

// ─── Minimalistic Configuration ─────────────────────────────────────

export type AtollMinimalisticLayout = 'stack' | 'metrics' | 'custom';

export interface AtollNotchMinimalisticConfiguration {
  headline?: string;
  subtitle?: string;
  sections: AtollNotchContentSection[];
  webContent?: AtollWidgetWebContentDescriptor;
  layout: AtollMinimalisticLayout;
  hidesMusicControls: boolean;
}

// ─── Main Descriptor ────────────────────────────────────────────────

export interface AtollNotchExperienceDescriptor {
  id: string;
  bundleIdentifier: string;
  priority: AtollLiveActivityPriority;
  accentColor: AtollColorDescriptor;
  metadata: Record<string, string>;
  tab?: AtollNotchTabConfiguration;
  minimalistic?: AtollNotchMinimalisticConfiguration;
  durationHint?: number;
}

// ─── Builder ────────────────────────────────────────────────────────

export function createNotchExperience(
  options: Partial<AtollNotchExperienceDescriptor> &
    Pick<AtollNotchExperienceDescriptor, 'id'>
): AtollNotchExperienceDescriptor {
  return {
    bundleIdentifier: '',
    priority: AtollLiveActivityPriority.Normal,
    accentColor: AtollColors.accent,
    metadata: {},
    ...options,
  };
}
