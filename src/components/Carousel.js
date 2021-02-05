import React from "react";
import PropTypes from "prop-types";
import { useTransition, animated } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import { navigate as gatsbyNavigate } from "gatsby";

import { useGetSiblings } from "../context/photos";
import useWindowSize from "hooks/useWindowSize";
import useKeyboardNavigation from "hooks/useKeyboardNavigation";

import { Box } from "./Box";

const Animated = animated(Box);

const propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func,
  onDismiss: PropTypes.func,
  current: PropTypes.number,
  previous: PropTypes.number,
};

const sx = {
  wrapper: { position: "relative" },
  outer: { width: "100%", height: "100%" },
  inner: { height: "100vh", pointerEvents: "none" },
};

const Carousel = ({ onDismiss, children }) => {
  const direction = React.useRef(0);
  const siblings = useGetSiblings();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const navigate = React.useCallback(
    (handle) => {
      direction.current = handle === "next" ? 1 : -1;
      const target = siblings[handle];
      if (target) {
        gatsbyNavigate(target.slug, { state: { noScroll: true, modal: true } });
        return true;
      }

      return false;
    },
    [siblings]
  );

  useKeyboardNavigation({
    onLeft: () => {
      navigate("previous");
    },
    onRight: () => {
      navigate("next");
    },
  });

  const [transition, update] = useTransition(
    children,
    {
      keys: (item, i) => (item ? item.key : i),
      from: {
        x: direction.current * windowWidth,
        y: 0,
        scale: 0.8,
        opacity: 1,
        position: "relative",
        zIndex: 1,
      },
      enter: {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        position: "relative",
        zIndex: 1,
      },
      leave: {
        x: direction.current * -windowWidth,
        y: 0,
        scale: 1,
        position: "absolute",
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
          if (navigate(mx > 0 ? "previous" : "next")) {
            cancel();
            return;
          }
        }
      }

      update({
        x: down ? mx : 0,
        y: down ? my : 0,
        scale: down ? Math.max(my, 0) / -1000 + 1 : 1,
        opacity: down ? Math.max(my, 0) / -1000 + 1 : 1,
      });
    },
  });

  return (
    <Box sx={sx.wrapper} {...bind()}>
      {transition((style, item) => {
        return (
          <Animated sx={sx.outer} style={style}>
            <Box sx={sx.inner}>{item}</Box>
          </Animated>
        );
      })}
    </Box>
  );
};

Carousel.propTypes = propTypes;

export { Carousel };
