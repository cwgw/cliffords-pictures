export const DEFAULT = "DEFAULT";

/**
 * @typedef {object} Theme
 * @property {Record<string, string>} [borders] Border widths
 * @property {Record<string, string>} [colors] Colors
 * @property {Record<string, string>} [fonts] Font families
 * @property {Record<string, string | number>} [fontWeights] Font weights
 * @property {Record<string, string>} [radii] Border radius sizes
 * @property {Record<string, string>} [space] General purpose sizes
 * @property {Record<string, string>} [shadows] Box shadows
 * @property {Record<string, string>} [sizes]  Widths for e.g. containers
 * @property {Record<string, string | number>} [zIndices] Z-index values
 */

/**
 * Based on the System UI Theme Specification
 * See {@link https://github.com/system-ui/theme-specification}
 * @type {Theme}
 */
export const theme = {
  borders: {
    [DEFAULT]: "2px",
  },

  /* fontWeights */
  fontWeights: {
    100: 100,
    200: 200,
    300: 300,
    400: 400,
    500: 500,
    600: 600,
    700: 700,
    800: 800,
    900: 900,
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  /* radii */
  radii: {
    none: " 0px",
    sm: "0.125rem",
    DEFAULT: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },

  /* space */
  space: {
    0: "0px",
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
    "1/2": "50%",
    "1/3": "33.3333%",
    "2/3": "66.6666%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
  },
};
