import React from "react";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import { navigate as gatsbyNavigate } from "gatsby";

import { useGetAlbumItemRef } from "../context/app";
import useWindowSize from "hooks/useWindowSize";
import useKeyboardNavigation from "hooks/useKeyboardNavigation";
import { createThemedElement } from "../style";
import { Button } from "./Button";
import { Box } from "./Box";
import { Image } from "./Image";

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
    height: 0,
    width: 0,
    "& > div": {
      position: "relative",
      transform: "translate(-50%, -50%)",
    },
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

const Item = React.forwardRef(({ style, image }, ref) => (
  <Animated ref={ref} style={style}>
    <Image {...image} />
  </Animated>
));

function dismissThreshold({ my, vy, view }) {
  return (my > 0 && vy > 0.5) || my > view.height / 2;
}

function swipeThreshold({ mx, vx, view }) {
  return (Math.abs(mx) > 0 && vx > 0.5) || Math.abs(mx) > view.width / 3;
}

function clamp(n, min, max) {
  return Math.max(min || 0, Math.min(max || 1, n));
}

function average(arr) {
  return arr.reduce((acc, n, i, arr) => {
    if (i + 1 >= arr.length) {
      return (acc + n) / arr.length;
    }

    return acc + n;
  });
}

function getDimensions({ data, view, margin }) {
  if (!data) {
    return {
      width: view.width,
      height: view.height,
    };
  }
  const { width, height, aspectRatio: ar } = data;
  const vw = view.width - 2 * (margin || 24);
  const vh = view.height - 2 * (margin || 24);
  if (width > vw || height > vh) {
    if (width - vw > height - vh) {
      return {
        width: vw,
        height: vw / ar,
      };
    } else {
      return {
        width: vh * ar,
        height: vh,
      };
    }
  }

  return { width, height };
}

const Modal = ({ data, isOpen, onDismiss, siblings }) => {
  const direction = React.useRef(0);
  const view = useWindowSize();
  const { width, height } = getDimensions({ data, view });
  const delayedIsOpen = React.useRef(false);
  const albumItemRef = useGetAlbumItemRef();

  React.useEffect(() => {
    delayedIsOpen.current = isOpen;
  }, [isOpen]);

  // React.useEffect(() => {
  //   if (albumItemRef && delayedIsOpen.current) {
  //     albumItemRef.scrollIntoView();
  //   }
  // }, [albumItemRef])

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

  const [transition, update] = useTransition(
    data,
    {
      keys: (item) => (item ? item.id : null),
      from: {
        x: width * direction.current,
        y: 0,
        scale: direction.current ? 1 : 0.75,
        transformOrigin: "center center",
        opacity: 1,
      },
      enter: (item) => async (next) => {
        let from = null;

        if (!delayedIsOpen.current && item && albumItemRef) {
          const rect = albumItemRef.getBoundingClientRect();
          const { width } = getDimensions({ data: item, view });
          from = {
            x: 0 - (view.width / 2 - (rect.x + rect.width / 2)),
            y: 0 - (view.height / 2 - (rect.y + rect.height / 2)),
            scale: rect.width / width,
          };
        }

        await next({
          from,
          to: {
            x: 0,
            y: 0,
            scale: 1,
            transformOrigin: "center center",
            opacity: 1,
          },
        });
      },
      leave: {
        x: 0 - width * direction.current,
        y: 0,
        scale: 1,
        transformOrigin: "center center",
        opacity: 0,
      },
      immediate: (key) => key === "transformOrigin",
    },
    [data, width]
  );

  const bind = useGesture({
    onDrag: ({
      args: [args],
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
            const rect = albumItemRef.getBoundingClientRect();
            const { width } = getDimensions({ data: args.item, view });
            Promise.all([
              animateOverlay({ opacity: 0 }),
              update({
                x: 0 - (view.width / 2 - (rect.x + rect.width / 2)),
                y: 0 - (view.height / 2 - (rect.y + rect.height / 2)),
                scale: rect.width / width,
                transformOrigin: "center center",
              }),
            ]).then(() => onDismiss());
            break;
          }

          animateOverlay({
            opacity: down ? clamp(1 - (my * 2) / view.height) : 1,
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
        {transition((style, item) => {
          return item ? (
            <Animated
              key={item.key}
              style={style}
              sx={sx.item}
              {...bind({ item })}
            >
              <Box style={{ width, height }}>
                <Item {...item} />
              </Box>
            </Animated>
          ) : null;
        })}
        <Button onClick={onDismiss} sx={sx.close} title="Close">
          {"╳"}
        </Button>
      </Content>
    </Overlay>
  );
};

export { Modal };
