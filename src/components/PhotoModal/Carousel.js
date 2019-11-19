import React from 'react';
import PropTypes from 'prop-types';
import css from '@styled-system/css';
import { useTransition, useSpring, animated, to } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import GatsbyImage from 'gatsby-image';
import clamp from 'lodash/clamp';

const propTypes = {
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired,
  previous: PropTypes.number.isRequired,
};

const AnimatedImage = animated(GatsbyImage);

const Carousel = ({ items, onChange, onDismiss, current, previous }) => {
  const container = React.useRef(null);
  const containerWidth = React.useRef(0);
  const windowWidth = React.useRef(0);
  const isZooming = React.useRef(false);
  const axis = React.useRef(null);

  const tmpRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      windowWidth.current = window.innerWidth;
    }
  }, []);

  React.useEffect(() => {
    if (container.current) {
      containerWidth.current = container.current.clientWidth;
    }
  }, [container]);

  const transitionDirection =
    current === previous ? 0 : current > previous ? 1 : -1;

  const transition = useTransition(
    items[current],
    {
      key: item => item.id,
      expires: 0,
      from: {
        transform: `matrix(0.9, 0, 0, 0.9, ${transitionDirection *
          containerWidth.current}, 0)`,
        opacity: 0,
      },
      enter: {
        transform: `matrix(1, 0, 0, 1, 0, 0)`,
        opacity: 1,
      },
      leave: {
        transform: `matrix(0.9, 0, 0, 0.9, ${transitionDirection *
          -containerWidth.current}, 0)`,
        opacity: 0,
      },
    },
    [containerWidth.current, current]
  );

  const [{ s, x, y }, setSpring] = useSpring(() => ({ s: 0, x: 0, y: 0 }), {
    tension: 500,
    friction: 30,
  });

  // console.log(s.animation.to)

  const bind = useGesture(
    {
      onDrag: ({
        down,
        last,
        movement: [mx, my],
        direction: [dx, dy],
        vxvy: [vx, vy],
        memo = [x.animation.to, y.animation.to],
        cancel,
        canceled,
      }) => {
        if (isZooming.current) {
          const relativeWidth =
            ((1 + s.animation.to) * containerWidth.current) /
            windowWidth.current;
          setSpring({
            x: relativeWidth > 1 || down ? mx : 0,
            y: relativeWidth > 1 || down ? my : 0,
          });
          return;
        }

        // lock axis
        switch (axis.current) {
          case 'x': {
            if (last && Math.abs(vx) > 0.5) {
              onChange(dx > 0 ? -1 : 1);
              cancel();
              setSpring({ x: 0, y: 0 });
              axis.current = null;
              return;
            }
            setSpring({
              x: down ? memo[0] + mx : 0,
              y: 0,
            });
            break;
          }
          case 'y': {
            if (canceled) {
              axis.current = null;
              return;
            }
            if (down && my > 300) {
              cancel();
              setSpring({
                y: my + 200,
                s: Math.max(my, 0) / -1000,
                onRest: onDismiss,
              });
              return;
            }
            setSpring({
              x: 0,
              y: down ? memo[1] + my : 0,
              s: down ? Math.max(my, 0) / -1000 : 0,
            });
            break;
          }
          default: {
            if (Math.abs(dx) > Math.abs(dy)) {
              axis.current = 'x';
            } else if (Math.abs(dy) > Math.abs(dx)) {
              axis.current = 'y';
            }
          }
        }

        if (last) {
          axis.current = null;
        }

        return memo;
      },
      onPinch: props => {
        // console.log(props)
        isZooming.current = true;
        const {
          da: [d],
          movement: [mx, my],
          last,
          first,
        } = props;
        if ((last || first) && d / 200 < 0) {
          isZooming.current = false;
        }
        const s = clamp(last || first ? 0 : -0.5, d / 200, 3);
        const relativeWidth =
          ((1 + s) * containerWidth.current) / windowWidth.current;
        // console.log(relativeWidth)
        // console.log(s)
        const x = relativeWidth < 1 ? 0 : mx;
        const y = relativeWidth < 1 ? 0 : my;
        setSpring({ s, x, y });
      },
    },
    {
      // dragDelay: 150,
      event: { passive: false },
      domTarget: tmpRef,
    }
  );

  return (
    <animated.div
      css={css({
        position: 'relative',
      })}
      ref={container}
    >
      {transition((values, item) => (
        <animated.div style={values} ref={tmpRef} {...bind()}>
          <AnimatedImage
            style={{
              position: 'absolute',
              transform: to(
                [s, x, y],
                (s, x, y) => `matrix(${1 + s},0,0,${1 + s},${x},${y})`
              ),
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
