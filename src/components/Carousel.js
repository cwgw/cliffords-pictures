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
  onChange: PropTypes.func.isRequired,
  // currentIndex: PropTypes.number.isRequired,
};

const AnimatedImage = animated(GatsbyImage);

const Carousel = ({
  items,
  onChange,
  // currentIndex: index,
  slide: { current, previous },
}) => {
  // const [{ x }, setX] = useSpring(() => {
  //   return {
  //     x: 0,
  //     config: {
  //       tension: 300,
  //     }
  //   }
  // });

  const width = React.useRef(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) {
      width.current = ref.current.clientWidth;
    }
  }, [ref]);

  // const [styles, setSprings] = useSprings(3, i => {
  //   return {
  //     x: (i - 1) * 100,
  //     opacity: 1 - Math.abs((i - 1)),
  //     config: { tension: 300 }
  //   };
  // })

  const [{ transform }, setTransform] = useSpring(() => {
    return {
      transform: `translate(0px, 0)`,
    };
  });

  const bind = useGesture({
    onDrag: ({ down, movement: [moveX], direction: [dirX], cancel }) => {
      if (down && Math.abs(moveX) > (width.current * 2) / 3) {
        onChange(dirX > 0 ? -1 : 1);
        cancel();
      }

      setTransform(() => ({
        transform: down ? `translate(${moveX}px, 0)` : `translate(0px, 0)`,
      }));
      // setSprings(i => {
      //   let base = (i - 1) * 100;
      //   let diff = moveX / width.current * 100 + base;

      //   return {
      //     x: down ? diff : base,
      //   }
      // })
    },
  });

  const direction = current > previous ? 1 : -1;

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
        // display: 'grid',
        // gridTemplateColumns: 'repeat(3, 100%)',
        // gridColumnGap: '25%',
      })}
      ref={ref}
      style={{ transform }}
      {...bind()}
    >
      {transitions.map(({ item, props, key }) => (
        <animated.div key={key}>
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
      {/* {items.map((photo, i) => {
        if (
          i >= index - 1 &&
          i <= index + 1
        ) {
          let { x, opacity } = styles[i - index + 1] || {};
          // console.log(i - index + 1, {i, index})

          return (
            <animated.div
              // key={i - index + 1}
              key={photo.id}
              css={{
                position: 'absolute',
                width: '100%',
                height: 0,
              }}
              style={{
                transform: x.interpolate(n => `translate(${n}%, -50%)`),
                // opacity,
                paddingBottom: `${1 / photo.aspectRatio * 100}%`,
                pointerEvents: i === index ? 'auto' : 'none',
              }}
            >
              {photo && (
                <Image
                  fluid={photo.image.full}
                  css={{
                  }}
                  imgStyle={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                />
              )}
            </animated.div>
          );
        }

        return null;
      })} */}
    </animated.div>
  );
};

Carousel.propTypes = propTypes;

export default Carousel;
