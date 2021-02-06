import React from "react";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import { navigate as gatsbyNavigate } from "gatsby";

// import { useGetAlbumItemRef } from "../context/app";
import useWindowSize from "hooks/useWindowSize";
import useKeyboardNavigation from "hooks/useKeyboardNavigation";
import { createThemedElement } from "../style";
import { Button } from "./Button";
import { Box } from "./Box";

const sx = {
  overlay: {
    variant: "cover",
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    position: "fixed",
    color: "white",
  },
  content: {
    // position: "relative",
    // maxWidth: "100%",
    // mx: "auto",
  },
  background: {
    position: "fixed",
    bg: "black",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  row: {
    position: "relative",
    width: "100%",
  },
  close: {
    position: "fixed",
    top: "sm",
    right: "sm",
    zIndex: 1000,
  },
  item: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    img: {
      touchAction: "none",
      WebkitUserDrag: "none",
      userSelect: "none",
      // temp fix for firefox desktop
      // not fit for prod
      pointerEvents: "none",
    },
  },
};

const Overlay = animated(
  createThemedElement(DialogOverlay, {
    forwardProps: ["isOpen", "onDismiss"],
  })
);

const Content = createThemedElement(DialogContent);

const Animated = animated(Box);

function dismissThreshold({ my, vy, view }) {
  return (my > 0 && vy > 0.5) || my > view.height / 2;
}

function swipeThreshold({ mx, vx, view }) {
  return (Math.abs(mx) > 0 && vx > 0.5) || Math.abs(mx) > view.width / 3;
}

function average(arr) {
  return arr.reduce((acc, n, i, arr) => {
    if (i + 1 >= arr.length) {
      return (acc + n) / arr.length;
    }

    return acc + n;
  });
}

const Modal = ({ isOpen, onDismiss, siblings, children }) => {
  const direction = React.useRef(0);
  const view = useWindowSize();
  const width = Math.min(view.width, 768);
  const [background, animateOverlay] = useSpring(
    {
      opacity: 0,
      config: { clamp: true, precision: 0.05 },
    },
    []
  );

  React.useEffect(() => {
    animateOverlay({ opacity: isOpen ? 1 : 0 });
    if (!isOpen) {
      direction.current = 0;
    }
  }, [animateOverlay, isOpen]);

  // const ref = useGetAlbumItemRef();
  // React.useEffect(() => {
  //   if (ref) {
  //     ref.scrollIntoView();
  //   }
  // }, [ref])

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
      navigate("prev");
    },
    onRight: () => {
      navigate("next");
    },
  });

  const [transition, update] = useTransition(
    children,
    {
      keys: (item) => (item ? item.key : null),
      from: {
        x: width * direction.current,
        y: 0,
        scale: direction.current ? 1 : 0.8,
        transformOrigin: "center center",
        opacity: 1,
      },
      enter: {
        x: 0,
        y: 0,
        scale: 1,
        transformOrigin: "center center",
        opacity: 1,
      },
      leave: {
        x: 0 - width * direction.current,
        y: 0,
        scale: 1,
        transformOrigin: "center center",
        opacity: 0,
      },
    },
    [children, width]
  );

  const bind = useGesture({
    onDrag: ({
      cancel,
      canceled,
      down,
      event,
      last,
      memo,
      movement: [mx, my],
      vxvy: [vx, vy],
      xy: [x, y],
    }) => {
      // supposed to fix image drag problem in firefox
      event.preventDefault();

      if (canceled) {
        return;
      }

      if (!memo) {
        memo = [];
      }

      if (Array.isArray(memo)) {
        if (memo.length < 4) {
          memo.push(Math.abs(mx) - Math.abs(my));
          return memo;
        } else {
          const rx = x - view.width / 2;
          const ry = y - view.height / 2;
          update({
            transformOrigin: `calc(50% + ${rx}px) calc(50% + ${ry}px)`,
          });

          if (average(memo) > 0) {
            memo = mx < 0 ? "left" : "right";
          } else {
            memo = my < 0 ? "up" : "down";
          }
        }
      }

      switch (memo) {
        case "left":
        case "right": {
          if (last && swipeThreshold({ mx, vx, view })) {
            if (navigate(mx > 0 ? "prev" : "next")) {
              cancel();
              break;
            }
          }

          update({
            x: down ? mx : 0,
            y: 0,
            immediate: (key) => down && key === "x",
          });
          break;
        }

        case "down": {
          if (last && dismissThreshold({ my, vy, view })) {
            cancel();
            animateOverlay({ opacity: 0 }).then(() => onDismiss());
            break;
          }

          animateOverlay({
            opacity: down ? Math.max(my, 0) / -1000 + 1 : 1,
          });

          update({
            x: down ? mx : 0,
            y: down ? my : 0,
            scale: down ? Math.max(my, 0) / -1000 + 1 : 1,
            immediate: (key) => down && (key === "x" || key === "y"),
          });
          break;
        }

        case "up": {
          update({
            y: down ? my : 0,
            x: 0,
            immediate: (key) => down && key === "y",
          });
          break;
        }

        default: {
          update({
            x: down ? mx : 0,
            y: down ? my : 0,
            immediate: (key) => down && (key === "x" || key === "y"),
          });
        }
      }

      return !last && memo;
    },
  });

  return (
    <Overlay sx={sx.overlay} isOpen={isOpen} onDismiss={onDismiss}>
      <Animated style={background} sx={sx.background} onClick={onDismiss} />
      <Content sx={sx.content} aria-label="Photo modal">
        {transition(
          (style, item) =>
            item && (
              <Box key={item.key} sx={sx.item} {...bind()}>
                <Animated style={style}>{item}</Animated>
              </Box>
            )
        )}
        <Button onClick={onDismiss} sx={sx.close} title="Close">
          {"╳"}
        </Button>
      </Content>
    </Overlay>
  );
};

export { Modal };
