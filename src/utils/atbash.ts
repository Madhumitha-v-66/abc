/**
 * Applies the Atbash cipher transformation to a single character.
 * A <-> Z, B <-> Y, ..., a <-> z, b <-> y, ...
 * Preserves non-alphabetical characters like numbers, spaces, punctuation.
 */
export function atbashChar(char: string): string {
  const code = char.charCodeAt(0);

  // Uppercase A-Z (65 - 90)
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(90 - (code - 65));
  }

  // Lowercase a-z (97 - 122)
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(122 - (code - 97));
  }

  return char;
}

/**
 * Transforms an entire string using the Atbash cipher.
 * Example: 'ARSHIYA' -> 'ZIHSRBZ'
 */
export function toAtbash(text: string): string {
  return text.split('').map(atbashChar).join('');
}

/**
 * Decode is identical to encode in Atbash.
 */
export const fromAtbash = toAtbash;
