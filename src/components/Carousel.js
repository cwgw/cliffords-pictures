/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx } from '@emotion/core';
import css from '@styled-system/css';
import { useSpring, useTransition, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import GatsbyImage from 'gatsby-image';
// import Image from 'gatsby-image';

const propTypes = {
  items: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  // currentIndex: PropTypes.number.isRequired,
};

const AnimatedImage = animated(GatsbyImage);

const Carousel = ({ items, handleChange, current, previous }) => {
  const width = React.useRef(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) {
      width.current = ref.current.clientWidth;
    }
  }, [ref]);

  const [{ transform }, setTransform] = useSpring(() => {
    return {
      transform: `translate(0px, 0)`,
      config: {
        tension: 300,
        friction: 40,
      },
    };
  });

  const bind = useGesture({
    onDrag: ({
      down,
      movement: [moveX],
      direction: [dirX],
      cancel,
      canceled,
      memo,
      velocity,
      currentTarget,
      last,
      ...state
    }) => {
      // console.log(state);

      // console.log(currentTarget.dataset)

      if (down && Math.abs(moveX) > width.current / 2) {
        handleChange(dirX > 0 ? -1 : 1);
        cancel();
      }

      // console.log({ last, canceled });
      // if (last && canceled) {
      //   setTransform({
      //     transform: `translate(${moveX}px, 0)`,
      //   });
      //   return;
      // }

      // console.log({ velocity })

      setTransform({
        transform: down ? `translate(${moveX}px, 0)` : `translate(0px, 0)`,
        // config: {
        //   mass: Math.max(velocity * 0.5, 1),
        //   tension: 400 * Math.max(velocity, 1),
        //   friction: 40,
        // }
      });
    },
  });

  const direction = current === previous ? 0 : current > previous ? 1 : -1;

  const transitions = useTransition(items[current], item => item.id, {
    from: {
      transform: `translate(${direction * 100}%, 0) scale(0.9)`,
      opacity: 0,
    },
    enter: {
      transform: `translate(0%, 0) scale(1)`,
      opacity: 1,
    },
    leave: {
      transform: `translate(${-direction * 100}%, 0) scale(0.9)`,
      opacity: 0,
    },
  });

  return (
    <animated.div
      css={css({
        position: 'relative',
      })}
      ref={ref}
      {...bind()}
    >
      {transitions.map(({ item, props, key }, i) => (
        <animated.div key={key} style={i ? {} : { transform }}>
          <AnimatedImage
            style={{
              position: 'absolute',
              ...props,
            }}
            css={{
              marginTop: '-50%',
              width: '100%',
            }}
            fluid={item.image.full}
            imgStyle={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        </animated.div>
      ))}
    </animated.div>
  );
};

Carousel.propTypes = propTypes;

export default Carousel;
