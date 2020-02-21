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
  const dim = React.useRef({
    width: 0,
    height: 0,
  });
  const windowWidth = React.useRef(0);
  const isZooming = React.useRef(false);
  const axis = React.useRef(null);

  // this is necessary for pinch on touchpad
  // maybe delete once mobile pinching works nicely
  const tmpRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      windowWidth.current = window.innerWidth;
    }
  }, []);

  React.useEffect(() => {
    if (container.current) {
      let width = container.current.parentNode.clientWidth;
      dim.current.width = width;
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
          dim.current.width}, 0)`,
        opacity: 0,
      },
      enter: {
        transform: `matrix(1, 0, 0, 1, 0, 0)`,
        opacity: 1,
      },
      leave: {
        transform: `matrix(1, 0, 0, 1, ${transitionDirection *
          -dim.current.width}, 0)`,
        opacity: 0,
      },
    },
    [dim.current.width, current]
  );

  const [{ s, x, y, opacity }, setSpring] = useSpring(() => ({
    s: 0,
    x: 0,
    y: 0,
    opacity: 1,
    config: {
      tension: 500,
      friction: 30,
    },
  }));

  const bind = useGesture(
    {
      onDrag: ({
        down,
        last,
        movement: [mx, my],
        direction: [dirx, diry],
        delta: [dx, dy],
        vxvy: [vx, vy],
        memo = [x.animation.to, y.animation.to],
        cancel,
        canceled,
      }) => {
        if (isZooming.current) {
          const relativeWidth =
            ((1 + s.animation.to) * dim.current.width) / windowWidth.current;
          setSpring({
            x: relativeWidth > 1 || down ? mx : 0,
            y: relativeWidth > 1 || down ? my : 0,
          });
          return;
        }

        if (!axis.current) {
          if (Math.abs(dirx) > Math.abs(diry)) {
            axis.current = 'x';
          } else if (Math.abs(diry) > Math.abs(dirx)) {
            axis.current = 'xy';
          }
        }

        if (canceled) {
          axis.current = null;
          return;
        }

        if (axis.current === 'x') {
          if (
            last &&
            ((mx * vx > 0 && vx * dx > 0.5) ||
              Math.abs(mx) > (dim.current.width * 2) / 3)
          ) {
            onChange(mx > 0 ? -1 : 1);
            cancel();
            setSpring({ x: 0, y: 0, s: 0 });
            axis.current = null;
            return;
          }
          setSpring({
            x: down ? memo[0] + mx : 0,
            y: 0,
            s: 0,
          });
        }

        if (axis.current === 'xy') {
          if (
            last &&
            ((my > 0 && vy * dy > 0.5) || my > dim.current.width / 2)
          ) {
            cancel();
            setSpring({
              x: 0,
              y: 0,
              s: -0.75,
              opacity: 0,
              onRest: onDismiss,
            });
            axis.current = null;
            return;
          }
          setSpring({
            x: down ? memo[0] + mx : 0,
            y: down ? memo[1] + my : 0,
            s: down ? Math.max(my, 0) / -1000 : 0,
          });
        }

        if (last) {
          axis.current = null;
        }

        return memo;
      },
      onPinch: props => {
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
          ((1 + s) * dim.current.width) / windowWidth.current;
        const x = relativeWidth < 1 ? 0 : mx;
        const y = relativeWidth < 1 ? 0 : my;
        setSpring({ s, x, y });
      },
    },
    {
      event: { passive: false },
      domTarget: tmpRef,
    }
  );

  return (
    <div
      css={css({
        position: 'relative',
      })}
      ref={container}
      {...bind()}
    >
      {transition((values, item) => {
        return (
          <animated.div
            style={{
              ...values,
            }}
            ref={tmpRef}
          >
            <AnimatedImage
              style={{
                position: 'absolute',
                transform: to(
                  [s, x, y],
                  (s, x, y) => `matrix(${1 + s},0,0,${1 + s},${x},${y})`
                ),
                opacity,
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
        );
      })}
    </div>
  );
};

Carousel.propTypes = propTypes;

export default Carousel;
