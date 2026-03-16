type JSONPrimitive = string | number | boolean | null;
type JSONLike = JSONPrimitive | JSONLike[] | { [key: string]: JSONLike };

function isCGSizeLike(value: Record<string, JSONLike>): value is { width: number; height: number } {
  const keys = Object.keys(value);
  if (keys.length !== 2 || !keys.includes('width') || !keys.includes('height')) {
    return false;
  }

  return typeof value.width === 'number' && Number.isFinite(value.width)
    && typeof value.height === 'number' && Number.isFinite(value.height);
}

function normalize(value: JSONLike): JSONLike {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (value && typeof value === 'object') {
    const normalizedEntries = Object.entries(value).map(([k, v]) => [k, normalize(v)] as const);
    const normalizedObject = Object.fromEntries(normalizedEntries) as Record<string, JSONLike>;

    // Swift Codable encodes/decodes CGSize as a 2-item array [width, height].
    if (isCGSizeLike(normalizedObject)) {
      return [normalizedObject.width, normalizedObject.height];
    }

    return normalizedObject;
  }

  return value;
}

/**
 * Normalizes descriptor payloads to match Swift Codable wire format.
 *
 * Today this converts any `{ width, height }` object into `[width, height]`
 * so CGSize values decode correctly in Atoll.
 */
export function normalizeRPCPayload<T>(payload: T): T {
  return normalize(payload as JSONLike) as T;
}
