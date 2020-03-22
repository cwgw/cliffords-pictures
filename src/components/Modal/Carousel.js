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

  const { width: windowWidth, height: windowHeight } = useWindowSize();

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
    key: (item) => item.key,
    from: {
      transform: `matrix(0.8, 0, 0, 0.8, ${
        direction.current * windowWidth
      }, 0)`,
      opacity: 1,
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
      tension: 1000,
      friction: 16,
    }
  );

  const bind = useGesture({
    onDrag: ({
      down,
      last,
      movement: [mx, my],
      vxvy: [vx, vy],
      memo = [x.animation.to, y.animation.to, s.animation.to],
      cancel,
      canceled,
    }) => {
      if (canceled) {
        return;
      }

      if (Math.abs(my) > Math.abs(mx)) {
        // mostly vertical swiping
        if (last && ((my > 0 && vy > 0.5) || my > windowHeight / 2)) {
          // trigger dismissal
          cancel();
          setSpring({
            x: 0,
            y: memo[1] + my,
            s: memo[2] - 0.4,
            opacity: 0,
            onRest: onDismiss,
            config: {
              tension: 350,
              friction: 30,
              clamp: true,
            },
          });

          return;
        }
      } else {
        // mostly horizontal swiping
        if (
          last &&
          ((Math.abs(mx) > 0 && vx > 0.5) || Math.abs(mx) > windowWidth / 3)
        ) {
          // trigger photo change
          if (mx > 0) {
            handleLeft();
          } else {
            handleRight();
          }

          cancel();
          setSpring({ x: 0, y: 0, s: 0 });
          return;
        }
      }

      setSpring({
        x: down ? memo[0] + mx : 0,
        y: down ? memo[1] + my : 0,
        s: down ? Math.max(my, 0) / -1000 : 0,
      });

      return memo;
    },
  });

  return (
    <div css={{ position: 'relative' }} {...bind()}>
      {transition((values, item) => {
        return (
          <animated.div
            style={{
              ...values,
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
            }}
          >
            <animated.div
              style={{
                transform: to(
                  [s, x, y],
                  (s, x, y) => `matrix(${1 + s},0,0,${1 + s},${x},${y})`
                ),
                opacity,
                height: '100vh',
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
