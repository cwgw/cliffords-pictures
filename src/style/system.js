import { transparentize as _transparentize } from 'polished';
import _get from 'lodash/get';
import { get as sGet } from '@styled-system/core';

import { colors } from './tokens';

const get = (scale, key) => props => {
  const theme = _get(props, 'theme', props);
  return sGet(theme, `${scale}.${key}`);
};

const getColor = color => get('colors', color);

const color = Object.keys(colors).reduce((o, color) => {
  o[color] = getColor(color);
  return o;
}, getColor);

const transparentize = (n, color) => props => {
  return _transparentize(n, getColor(color)(props));
};

export { color, transparentize };
