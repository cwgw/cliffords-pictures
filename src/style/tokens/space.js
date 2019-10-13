const scale = [
  0,
  4, // 0.25 rem
  8, // 0.5 rem
  12, // 0.75 rem
  18, // 1.125 rem
  24, // 1.5 rem
  32, // 2 rem
  40, // 2.5 rem
  50, // 3.125 rem
  60, // 3.75 rem
  72, // 4.5 rem
  96, // 6 rem
  144, // 9 rem
  240, // 15 rem
  432, // 27 rem
];

const aliases = {
  default: scale[4], //  18 px
  xxs: scale[1], //   4 px
  xs: scale[2], //   8 px
  sm: scale[3], //  12 px
  md: scale[4], //  18 px
  lg: scale[6], //  32 px
  xl: scale[10], //  50 px
  xxl: scale[12], // 144 px
};

const space = Object.entries(aliases).reduce((o, [key, value]) => {
  o[key] = value;
  return o;
}, scale);

export default space;
