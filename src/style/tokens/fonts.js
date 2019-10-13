const sans = [
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'Noto Sans',
  'sans-serif',
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Noto Color Emoji',
];

const serif = ['orpheuspro', 'Georgia', 'Palatino', 'serif'];

export default Object.entries({
  sans,
  serif,
}).reduce(
  (o, [key, val]) => ({
    ...o,
    [key]: val.join(', '),
  }),
  {}
);
