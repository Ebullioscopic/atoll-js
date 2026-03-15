import { AtollFontDescriptor, systemFont, monospacedDigitFont } from './AtollIconDescriptor';
import { AtollColorDescriptor } from './AtollColorDescriptor';

/**
 * AtollProgressIndicator — Progress indicators for live activities.
 */
export type AtollProgressIndicator =
  | { type: 'ring'; diameter?: number; strokeWidth?: number; color?: AtollColorDescriptor }
  | { type: 'bar'; width?: number | null; height?: number; cornerRadius?: number; color?: AtollColorDescriptor }
  | { type: 'percentage'; font?: AtollFontDescriptor; color?: AtollColorDescriptor }
  | { type: 'countdown'; font?: AtollFontDescriptor; color?: AtollColorDescriptor }
  | { type: 'lottie'; animationData: string; size?: { width: number; height: number } }
  | { type: 'none' };

export function ringIndicator(
  diameter = 24, strokeWidth = 3, color?: AtollColorDescriptor
): AtollProgressIndicator {
  return { type: 'ring', diameter, strokeWidth, color };
}

export function barIndicator(
  width: number | null = null, height = 4, cornerRadius = 2, color?: AtollColorDescriptor
): AtollProgressIndicator {
  return { type: 'bar', width, height, cornerRadius, color };
}

export function percentageIndicator(
  color?: AtollColorDescriptor
): AtollProgressIndicator {
  return { type: 'percentage', font: systemFont(13, 'semibold'), color };
}

export function countdownIndicator(
  color?: AtollColorDescriptor
): AtollProgressIndicator {
  return { type: 'countdown', font: monospacedDigitFont(13, 'semibold'), color };
}

export function noIndicator(): AtollProgressIndicator {
  return { type: 'none' };
}
