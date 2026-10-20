const PATTERN = /^[A-Z0-9][A-Z0-9\-_]{4,39}$/;

export function normalizeTrackingNumber(raw: string): string {
  return raw.trim().replace(/\s+/g, "").toUpperCase();
}

/** Returns an error message in Russian, or null when the value is acceptable. */
export function validateTrackingNumber(raw: string): string | null {
  if (!raw.trim()) return "Введите трек-номер.";
  if (!PATTERN.test(normalizeTrackingNumber(raw)))
    return "Трек-номер: от 5 до 40 символов — латинские буквы, цифры и дефис.";
  return null;
}
