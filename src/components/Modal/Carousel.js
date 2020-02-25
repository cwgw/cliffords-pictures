import React from 'react';
import PropTypes from 'prop-types';
import { useSpring, useTransition, animated, to } from 'react-spring';
import { useGesture } from 'react-use-gesture';

import useWindowSize from 'hooks/useWindowSize';
import useKeyboardNavigation from 'hooks/useKeyboardNavigation';

const propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func,
  onDismiss: PropTypes.func,
  current: PropTypes.number,
  previous: PropTypes.number,
};

const Carousel = ({ onLeft, onRight, onDismiss, children }) => {
  const direction = React.useRef(0);
  const axis = React.useRef(null);
  const touchRef = React.useRef();

  const { width: windowWidth } = useWindowSize();

  const handleLeft = React.useCallback(() => {
    direction.current = -1;
    onLeft();
  }, [onLeft]);

  const handleRight = React.useCallback(() => {
    direction.current = 1;
    onRight();
  }, [onRight]);

  useKeyboardNavigation({
    onLeft: handleLeft,
    onRight: handleRight,
  });

  const transition = useTransition(children, {
    key: item => item.key,
    from: {
      transform: `matrix(0.8, 0, 0, 0.8, ${direction.current *
        windowWidth}, 0)`,
      opacity: 0,
      position: 'relative',
    },
    enter: {
      transform: `matrix(1, 0, 0, 1, 0, 0)`,
      opacity: 1,
      position: 'relative',
    },
    leave: {
      transform: `matrix(1, 0, 0, 1, ${direction.current * -windowWidth}, 0)`,
      position: 'absolute',
      opacity: 0,
    },
  });

  const [{ s, x, y, opacity }, setSpring] = useSpring(
    () => ({ s: 0, x: 0, y: 0, opacity: 1 }),
    {
      tension: 750,
      friction: 20,
    }
  );

  const bind = useGesture(
    {
      onDrag: ({
        down,
        last,
        movement: [mx, my],
        // direction: [dirx, diry],
        delta: [dx, dy],
        vxvy: [vx, vy],
        memo = [x.animation.to, y.animation.to],
        cancel,
        canceled,
      }) => {
        // if (!axis.current) {
        //   if (Math.abs(dirx) > Math.abs(diry)) {
        //     axis.current = 'x';
        //   } else if (Math.abs(diry) > Math.abs(dirx)) {
        //     axis.current = 'xy';
        //   }
        // }

        if (canceled) {
          // axis.current = null;
          return;
        }

        if (Math.abs(my) > Math.abs(mx)) {
          // mostly vertical swiping
          if (last && ((my > 0 && vy * dy > 0.5) || my > windowWidth / 2)) {
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

          // setSpring({
          //   x: down ? memo[0] + mx : 0,
          //   y: down ? memo[1] + my : 0,
          //   s: down ? Math.max(my, 0) / -1000 : 0,
          // });
        } else {
          // mostly horizontal swiping
          if (
            last &&
            ((mx * vx > 0 && vx * dx > 0.5) ||
              // Math.abs(mx) > (windowWidth * 2) / 3)
              Math.abs(mx) > windowWidth / 3)
          ) {
            if (mx > 0) {
              handleLeft();
            } else {
              handleRight();
            }

            cancel();
            setSpring({ x: 0, y: 0, s: 0 });
            axis.current = null;
            return;
          }

          // setSpring({
          //   x: down ? memo[0] + mx : 0,
          //   y: 0,
          //   s: 0,
          // });
        }

        setSpring({
          x: down ? memo[0] + mx : 0,
          y: down ? memo[1] + my : 0,
          s: down ? Math.max(my, 0) / -1000 : 0,
        });

        // if (axis.current === 'x') {
        // }

        // if (axis.current === 'xy') {

        // }

        // if (last) {
        //   axis.current = null;
        // }

        return memo;
      },
    },
    {
      // eventOptions: {
      //   capture: true,
      //   passive: false,
      // },
    }
  );

  return (
    <div
      css={{
        position: 'relative',
        margin: 'auto',
      }}
      {...bind()}
      ref={touchRef}
    >
      {transition((values, item) => {
        return (
          <animated.div
            style={{
              ...values,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <animated.div
              style={{
                transform: to(
                  [s, x, y],
                  (s, x, y) => `matrix(${1 + s},0,0,${1 + s},${x},${y})`
                ),
                opacity,
              }}
            >
              {item}
            </animated.div>
          </animated.div>
        );
      })}
    </div>
  );
};

Carousel.propTypes = propTypes;

export default Carousel;
