import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { variant } from 'styled-system';
import css from '@styled-system/css';

import { transparentize } from 'style/utils';
import Link from 'components/Link';

const propTypes = {
  to: PropTypes.string,
  variant: PropTypes.string,
};

const defaultProps = {
  to: null,
  variant: 'default',
};

const sharedStyles = css({
  display: 'inline-block',
  maxWidth: '100%',
  verticalAlign: 'middle',
  border: '1px solid',
  fontFamily: 'sans',
  textAlign: 'center',
  textDecoration: 'none',
  textTransform: 'uppercase',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  userSelect: 'none',
  '&:active': {
    transform: 'translate(0, 2px)',
  },
  '&:focus': {
    zIndex: 1,
  },
});

const variants = variant({
  variants: {
    default: {
      paddingY: 'xs',
      paddingX: 'sm',
      borderColor: transparentize(0.75, 'primary'),
      '&:hover, &:focus': {
        borderColor: 'currentColor',
      },
    },
  },
});

const Button = styled(({ to, ...props }) => {
  const Element = to ? Link : 'button';
  return <Element to={to} {...props} />;
})(sharedStyles, variants, (props) => {
  if (props.disabled) {
    return {
      opacity: 0.35,
      cursor: 'auto',
      '&:hover': {},
      '&:hover, &:focus': {},
    };
  }
});

Button.defaultProps = defaultProps;

Button.propTypes = propTypes;

export default Button;
