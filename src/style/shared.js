import { color } from './utils';

const hideVisually = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: '0',
};

const spanParent = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'block',
};

const outline = {
  outline: `3px solid ${color.secondary}`,
  transition: `outline 100ms`,
  transitionTimingFunction: 'in',
};

const type = {};

export { hideVisually, outline, spanParent, type };
