import { transparentize as _transparentize } from 'polished';
import _get from 'lodash/get';
import { get as sGet } from '@styled-system/core';

import theme from './theme';

const get = (scale, key) => props => {
  const theme = _get(props, 'theme', props);
  return sGet(theme, `${scale}.${key}`);
};

const color = Object.keys(theme.colors).reduce(
  (f, color) => {
    f[color] = f(color)({ theme });
    return f;
  },
  color => props => get('colors', color)(props)
);

const space = Object.keys(theme.space).reduce(
  (f, n) => {
    f[n] = get('space', n)({ theme });
    return f;
  },
  n => props => get('space', n)(props)
);

const transparentize = (n, c) => props => {
  return _transparentize(n, color(c)(props));
};

export { color, space, transparentize };
