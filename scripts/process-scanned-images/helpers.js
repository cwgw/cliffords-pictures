const round = (n, d = 10000) => Math.round(n * d) / d;

const isAround = (n, target, threshold = 0.1) => {
  return target * (1 - threshold) < n && n < target * (1 + threshold);
};

const isRightSized = ({ area, width, height, target }) =>
  isAround(area, target.area) && isAround(width / height, target.aspectRatio);

const smoothNumberForComparison = (n, fac = 100) => Math.floor(n / fac) * fac;

const getRectCenter = ({ x, y, width, height }) => ({
  x: Math.round(x + width / 2),
  y: Math.round(y + height / 2),
});

module.exports = exports = {
  round,
  isAround,
  isRightSized,
  smoothNumberForComparison,
  getRectCenter,
};
