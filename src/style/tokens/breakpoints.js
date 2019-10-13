const scale = ['544px', '768px', '1012px', '1280px'];

const aliases = {
  sm: scale[0],
  md: scale[1],
  lg: scale[2],
  xl: scale[3],
};

const breakpoints = Object.entries(aliases).reduce((o, [key, value]) => {
  o[key] = value;
  return o;
}, scale);

export default breakpoints;
