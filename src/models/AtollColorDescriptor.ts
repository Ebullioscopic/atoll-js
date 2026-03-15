/**
 * AtollColorDescriptor — Platform-independent color description.
 */
export interface AtollColorDescriptor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export const AtollColors = {
  white: { red: 1, green: 1, blue: 1, alpha: 1 } as AtollColorDescriptor,
  black: { red: 0, green: 0, blue: 0, alpha: 1 } as AtollColorDescriptor,
  red: { red: 1, green: 0, blue: 0, alpha: 1 } as AtollColorDescriptor,
  green: { red: 0, green: 1, blue: 0, alpha: 1 } as AtollColorDescriptor,
  blue: { red: 0, green: 0, blue: 1, alpha: 1 } as AtollColorDescriptor,
  yellow: { red: 1, green: 1, blue: 0, alpha: 1 } as AtollColorDescriptor,
  orange: { red: 1, green: 0.6, blue: 0, alpha: 1 } as AtollColorDescriptor,
  purple: { red: 0.6, green: 0, blue: 1, alpha: 1 } as AtollColorDescriptor,
  pink: { red: 1, green: 0, blue: 0.6, alpha: 1 } as AtollColorDescriptor,
  gray: { red: 0.5, green: 0.5, blue: 0.5, alpha: 1 } as AtollColorDescriptor,
  /** System accent color — resolved by Atoll at render time */
  accent: { red: -1, green: -1, blue: -1, alpha: 1 } as AtollColorDescriptor,
};

export function isAccentColor(color: AtollColorDescriptor): boolean {
  return color.red < 0 && color.green < 0 && color.blue < 0;
}

export function createColor(
  red: number,
  green: number,
  blue: number,
  alpha: number = 1.0
): AtollColorDescriptor {
  return {
    red: Math.min(Math.max(red, 0), 1),
    green: Math.min(Math.max(green, 0), 1),
    blue: Math.min(Math.max(blue, 0), 1),
    alpha: Math.min(Math.max(alpha, 0), 1),
  };
}
