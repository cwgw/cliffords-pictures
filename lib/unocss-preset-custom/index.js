import { theme } from "./theme";

/**
 * @typedef {import("unocss").Preset} Preset
 * @typedef {typeof theme} Theme
 */

/**
 *
 * @returns {import("unocss").Preset<typeof theme>} An UnoCSS preset definition
 */
export function presetCustom() {
  return {
    name: "presetCustom",
    // preflights: preflights(),
    // rules,
    theme,
    // variants,
  };
}
