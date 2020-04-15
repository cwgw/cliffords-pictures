import React from 'react';
import PropTypes from 'prop-types';
import { keyframes } from '@emotion/core';

const propTypes = {
  children: PropTypes.string.isRequired,
  duration: PropTypes.number,
};

const defaultProps = {
  duration: 0.5,
};

const AnimatedText = React.forwardRef(
  ({ children, duration, ...props }, ref) => {
    const letters = Array.from(children);
    const count = letters.length;
    const step = Math.round((1 / count) * 100);
    const bounce = keyframes`
  from, ${step * 2}%, to {
    transform: translate3d(0, 0, 0);
  }
  ${step}% {
    transform: translate3d(0, -0.25em, 0);
  }
`;
    return (
      <span
        css={{
          display: 'inline-flex',
          flexFlow: 'row nowrap',
        }}
        ref={ref}
        {...props}
      >
        {letters.map((letter, i) => (
          <span
            key={`${letter}${i}`}
            css={{
              animation: `${bounce} ${
                duration * (count + 1)
              }s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
              minWidth: '0.2em',
            }}
            style={{
              animationDelay: `${duration * i}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </span>
    );
  }
);

AnimatedText.propTypes = propTypes;

AnimatedText.defaultProps = defaultProps;

export default AnimatedText;
