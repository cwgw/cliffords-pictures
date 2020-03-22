import { transparentize as _transparentize } from 'polished';
import { get } from '@styled-system/core';

import theme from './theme';

// based on https://github.com/developit/dlv
export const delve = (obj, key, def, p, undef) => {
  key = key && key.split ? key.split('.') : [key];
  for (p = 0; p < key.length; p++) {
    obj = obj ? obj[key[p]] : undef;
  }
  return obj === undef ? def : obj;
};

const getToken = (scale, key) => (props) => {
  const theme = delve(props, 'theme', props);
  return get(theme, `${scale}.${key}`);
};

const color = Object.keys(theme.colors).reduce(
  (f, color) => {
    f[color] = f(color)({ theme });
    return f;
  },
  (color) => (props) => getToken('colors', color)(props)
);

const space = Object.keys(theme.space).reduce(
  (f, n) => {
    f[n] = getToken('space', n)({ theme });
    return f;
  },
  (n) => (props) => getToken('space', n)(props)
);

const transparentize = (n, c) => (props) => {
  return _transparentize(n, color(c)(props));
};

export { color, space, transparentize };
