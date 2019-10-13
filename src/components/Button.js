import React from 'react';
import styled from '@emotion/styled';
import { transparentize } from 'polished';
import { variant } from 'styled-system';

import Link from 'components/Link';

const variants = {
  default: {
    borderColor: transparentize(0.75, 'primary'),
    '&:hover, &:focus': {
      borderColor: 'currentColor',
    },
  },
};

const Button = styled(({ to, ...props }) => {
  const Element = to ? Link : 'button';
  return <Element to={to} {...props} />;
})(
  {
    verticalAlign: 'middle',
    borderRadius: '2px',
    textAlign: 'center',
    textDecoration: 'none',
    userSelect: 'none',
    padding: '0.5rem 1rem',
    fontFamily: 'inherit',
    display: 'inline-block',
    '&:active': {
      transform: 'translate3d(0px, 0.2rem, 0px)',
    },
  },
  variant(variants)
);

export default Button;
