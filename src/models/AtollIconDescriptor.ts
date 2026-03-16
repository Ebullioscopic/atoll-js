/**
 * AtollIconDescriptor — Icon configurations for live activities and widgets.
 */

export type AtollIconDescriptor =
  | { type: 'symbol'; name: string; size?: number; weight?: AtollFontWeight }
  | { type: 'image'; data: string; size?: { width: number; height: number }; cornerRadius?: number }
  | { type: 'appIcon'; bundleIdentifier: string; size?: { width: number; height: number }; cornerRadius?: number }
  | { type: 'lottie'; animationData: string; size?: { width: number; height: number } }
  | { type: 'none' };

export type AtollFontWeight =
  | 'ultraLight' | 'thin' | 'light' | 'regular' | 'medium'
  | 'semibold' | 'bold' | 'heavy' | 'black';

export type AtollFontDesign = 'default' | 'serif' | 'rounded' | 'monospaced';

export interface AtollFontDescriptor {
  size: number;
  weight: AtollFontWeight;
  design?: AtollFontDesign;
  isMonospacedDigit?: boolean;
}

export function systemFont(
  size: number,
  weight: AtollFontWeight = 'regular',
  design: AtollFontDesign = 'default'
): AtollFontDescriptor {
  return { size, weight, design, isMonospacedDigit: false };
}

export function monospacedDigitFont(
  size: number,
  weight: AtollFontWeight = 'regular'
): AtollFontDescriptor {
  return { size, weight, design: 'default', isMonospacedDigit: true };
}

export function symbolIcon(name: string, size: number = 16, weight: AtollFontWeight = 'regular'): AtollIconDescriptor {
  return { type: 'symbol', name, size, weight };
}

export function appIcon(bundleIdentifier: string, size = { width: 20, height: 20 }, cornerRadius = 4): AtollIconDescriptor {
  return { type: 'appIcon', bundleIdentifier, size, cornerRadius };
}

export function noIcon(): AtollIconDescriptor {
  return { type: 'none' };
}
