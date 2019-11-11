import React from 'react';
import PropTypes from 'prop-types';
import css from '@styled-system/css';
import { useTransition, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import GatsbyImage from 'gatsby-image';

const propTypes = {
  items: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  // currentIndex: PropTypes.number.isRequired,
};

const Carousel = ({ items, handleChange, current, previous }) => {
  const width = React.useRef(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) {
      width.current = ref.current.clientWidth;
    }
  }, [ref]);

  // const [{ transform }, setTransform] = useSpring(() => {
  //   return {
  //     transform: `translate(0px, 0)`,
  //     config: {
  //       tension: 300,
  //       friction: 40,
  //     },
  //   };
  // });

  const direction = current === previous ? 0 : current > previous ? 1 : -1;
  // console.log({ direction })

  const [transition] = useTransition(
    items[current],
    {
      key: item => item.id,
      expires: 0,
      from: {
        transform: `translate(${direction * width.current}px, 0) scale(0.9)`,
        opacity: 0,
      },
      enter: {
        transform: `translate(0px, 0) scale(1)`,
        opacity: 1,
      },
      leave: {
        transform: `translate(${-direction * width.current}px, 0) scale(0.9)`,
        opacity: 0,
      },
    },
    []
    // , [width.current]
  );

  console.log(transition);

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
      if (down && Math.abs(moveX) > width.current / 2) {
        handleChange(dirX > 0 ? -1 : 1);
        cancel();
      }
      // update({
      //   enter: {
      //     transform: `translate(${moveX}px, 0)  scale(1)`
      //   }
      // })
      // setTransform({
      //   transform: down ? `translate(${moveX}px, 0)` : `translate(0px, 0)`,
      // });
      // updateTransition({
      //   from:  {
      //     transform: down
      //       ? `translate(${moveX}px, 0) scale(1)`
      //       : `translate(0px, 0) scale(1)`,
      //     opacity: 1,
      //   }
      // })
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
      {/* {transition((values, item) => (
        <animated.div style={values}>
          <GatsbyImage
            style={{
              position: 'absolute',
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
      ))} */}

      {/* {transitions.map(({ item, props, key }, i) => {
        if (i === )
        (
        <animated.div key={key} style={props}>
          <GatsbyImage
            style={{
              position: 'absolute',
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
      ))} */}
    </animated.div>
  );
};

Carousel.propTypes = propTypes;

export default Carousel;
