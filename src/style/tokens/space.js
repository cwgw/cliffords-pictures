const scale = [0, 4, 8, 12, 16, 24, 32, 40, 50, 60, 72, 96, 144, 240, 432];

const aliases = {
  default: scale[4], // 16px
  xxs: scale[1], // 4px
  xs: scale[2], // 8px
  sm: scale[3], // 12px
  md: scale[4], // 16px
  lg: scale[6], // 32px
  xl: scale[10], // 50px
  xxl: scale[12], // 144px
};

const space = Object.entries(aliases).reduce((o, [key, value]) => {
  o[key] = value;
  return o;
}, scale);

export default space;
