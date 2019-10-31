import { type } from './shared';
import fonts from 'assets/fonts';

export default {
  ':root': {
    '@font-face': fonts,
  },
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
  '#gatsby-noscript': {
    position: 'absolute',
    padding: 'sm',
    backgroundColor: 'background',
  },
  a: {
    color: 'inherit',
  },
  body: {
    ...type.body,
    color: 'text',
    margin: '0',
  },
  button: {
    border: 'none',
    borderRadius: 0,
    background: 'none',
    color: 'inherit',
    cursor: 'pointer',
    margin: 0,
    padding: 0,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    textTransform: 'none',
    overflow: 'visible',
    WebkitAppearance: 'button',
    '&:disabled': {
      cursor: 'default',
    },
  },
  'h1, h2, h3, h4, h5, h6': {
    marginTop: 0,
    marginBottom: 'default',
  },
  h1: {
    ...type.h1,
    color: 'accent',
  },
  h2: {
    ...type.h2,
    small: {
      display: 'block',
      fontStyle: 'italic',
    },
  },
  h3: type.h3,
  h4: type.h4,
  h5: type.h5,
  h6: type.h6,
  html: {
    boxSizing: 'border-box',
    MsOverflowStyle: 'scrollbar',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    WebkitOverflowScrolling: 'touch',
    backgroundColor: 'background',
  },
  p: {
    marginTop: 0,
    marginBottom: 'default',
  },
  small: type.small,
  svg: {
    display: 'block',
    overflow: 'visible',
  },
};
