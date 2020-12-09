import React from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated, to } from '@react-spring/web';
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

  const [transition, update] = useTransition(
    children,
    {
      key: (item) => item.key,
      from: {
        x: direction.current * windowWidth,
        y: 0,
        s: 0.8,
        opacity: 1,
        position: 'relative',
        zIndex: 1,
      },
      enter: {
        x: 0,
        y: 0,
        s: 1,
        opacity: 1,
        position: 'relative',
        zIndex: 1,
      },
      leave: {
        x: direction.current * -windowWidth,
        y: 0,
        s: 1,
        position: 'absolute',
        opacity: 0,
        zIndex: 0,
      },
    },
    [children]
  );

  const bind = useGesture({
    onDrag: ({
      down,
      last,
      movement: [mx, my],
      vxvy: [vx, vy],
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
          update({
            opacity: 0,
            onRest: onDismiss,
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
          return;
        }
      }

      update({
        x: down ? mx : 0,
        y: down ? my : 0,
        s: down ? Math.max(my, 0) / -1000 + 1 : 1,
        opacity: down ? Math.max(my, 0) / -1000 + 1 : 1,
      });
    },
  });

  return (
    <div
      css={{
        position: 'relative',
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
      }}
    >
      {transition(({ x, y, s, ...style }, item, t) => {
        return (
          <animated.div
            {...bind()}
            style={{
              transform: to(
                [s, x, y],
                (s, x, y) => `matrix(${s},0,0,${s},${x},${y})`
              ),
              ...style,
              width: '100%',
              height: '100%',
            }}
          >
            <div
              style={{
                height: '100vh',
                pointerEvents: 'none',
              }}
            >
              {item}
            </div>
          </animated.div>
        );
      })}
    </div>
  );
};

Carousel.propTypes = propTypes;

export default Carousel;
