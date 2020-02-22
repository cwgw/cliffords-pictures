import React from 'react';
import PropTypes from 'prop-types';
import css from '@styled-system/css';
import { useTransition, animated } from 'react-spring';

import useWindowSize from 'hooks/useWindowSize';

const propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func,
  onDismiss: PropTypes.func,
  current: PropTypes.number,
  previous: PropTypes.number,
};

const Carousel = ({ current, next, previous, dismiss, children }) => {
  const { width: windowWidth } = useWindowSize();

  const transitionDirection =
    current === previous ? 0 : current > previous ? 1 : -1;

  const transition = useTransition(
    children,
    {
      key: item => item.key,
      expires: 0,
      from: {
        transform: `matrix(0.9, 0, 0, 0.9, ${transitionDirection *
          windowWidth}, 0)`,
        opacity: 0,
      },
      enter: {
        transform: `matrix(1, 0, 0, 1, 0, 0)`,
        opacity: 1,
      },
      leave: {
        transform: `matrix(1, 0, 0, 1, ${transitionDirection *
          -windowWidth}, 0)`,
        opacity: 0,
      },
    },
    [windowWidth, children]
  );

  return (
    <div
      css={css({
        position: 'relative',
      })}
    >
      {transition((values, item) => {
        return (
          <animated.div
            style={{
              ...values,
            }}
          >
            {item}
          </animated.div>
        );
      })}
    </div>
  );
};

Carousel.propTypes = propTypes;

export default Carousel;
