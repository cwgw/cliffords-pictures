const scale = [0, 4, 8, 16, 32, 64, 128, 256, 512];

const aliases = {
  xs: scale[1],
  sm: scale[2],
  md: scale[3],
  lg: scale[4],
  xl: scale[5],
  xxl: scale[6],
};

export const space = Object.entries(aliases).reduce((o, [key, value]) => {
  o[key] = value;
  return o;
}, scale);
