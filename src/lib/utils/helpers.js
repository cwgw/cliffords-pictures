/**
 * A bare-bones case converter.
 * @param {string} str The string to transform
 * @returns {string} The provided string converted to title case
 */
export function titleCase(str) {
  return str
    .replace(/[\W_]+/, " ")
    .split(/\s+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}
