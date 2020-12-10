const scale = [
  12, // 0.75 rem
  14, // 0.875 rem
  16, // 1 rem
  18, // 1.125 rem
  20, // 1.25 rem
  24, // 1.5 rem
  28, // 1.75 rem
  32, // 2 rem
  36, // 2.25 rem
  42, // 2.625 rem
  48, // 3 rem
  54, // 3.375 rem
  60, // 3.75 rem
  68, // 4.25 rem
  76, // 4.75 rem
  84, // 5.25 rem
  92, // 5.75 rem
];

const aliases = {
  base: scale[2],
  large: scale[3],
  small: scale[1],
};

const fontSizes = Object.entries(aliases).reduce((o, [key, value]) => {
  o[key] = value;
  return o;
}, scale);

export { fontSizes };
