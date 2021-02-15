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
      boxShadow: "slight",
    },
    img: {
      touchAction: "none",
      WebkitUserDrag: "none",
      userSelect: "none",
      // temp fix for firefox desktop
      // not fit for prod
      // pointerEvents: "none",
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
    <Image
      // fadeIn={false}
      loading="eager"
      {...image}
    />
  </Animated>
));

function dismissThreshold({ my, vy, elapsedTime, viewport }) {
  return (
    (my > 0 && vy > 0.5) || my > viewport.height / 2 || my / elapsedTime > 0.35
  );
}

function swipeThreshold({ mx, vx, elapsedTime, viewport }) {
  const absX = Math.abs(mx);
  return (
    (absX > 0 && vx > 0.5) ||
    absX > viewport.width / 5 ||
    absX / elapsedTime > 0.35
  );
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

function round(n, d) {
  d = d || 1000;
  return Math.round(n * d) / d;
}

function useGetPhotoDimensions(viewport) {
  return (data, margin) => {
    if (!data) {
      return viewport;
    }

    const { width, height, aspectRatio: ar } = data;
    const vw = viewport.width - 2 * (margin || 24);
    const vh = viewport.height - 2 * (margin || 24);
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
  };
}

const Modal = ({ data, isOpen, onDismiss: _onDismiss, siblings }) => {
  const direction = React.useRef(0);
  const viewport = useWindowSize();
  const getDimensions = useGetPhotoDimensions(viewport);
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

  const onDismiss = React.useCallback(() => {
    if (albumItemRef) {
      albumItemRef.style.visibility = "visible";
    }
    _onDismiss();
  }, [_onDismiss, albumItemRef]);

  const navigate = React.useCallback(
    (handle) => {
      albumItemRef.style.visibility = "visible";
      direction.current = handle === "next" ? 1 : -1;
      const target = siblings[handle];
      if (target) {
        gatsbyNavigate(target.slug, { state: { noScroll: true, modal: true } });
        return true;
      }

      return false;
    },
    [siblings, albumItemRef]
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
      keys: (item) => item.id,
      from: (item) => {
        let x = item ? getDimensions(item).width : viewport.width;
        return {
          x: x * direction.current,
          y: 0,
          scale: direction.current ? 1 : 0.75,
          transformOrigin: "50% 50%",
          opacity: 1,
        };
      },
      enter: (item) => async (next) => {
        const to = {
          x: 0,
          y: 0,
          scale: 1,
          transformOrigin: "50% 50%",
          opacity: 1,
        };

        if (!delayedIsOpen.current && item && albumItemRef) {
          const rect = albumItemRef.getBoundingClientRect();
          const { width } = getDimensions(item);
          albumItemRef.style.visibility = "hidden";
          await next({
            from: {
              x: 0 - (viewport.width / 2 - (rect.x + rect.width / 2)),
              y: 0 - (viewport.height / 2 - (rect.y + rect.height / 2)),
              scale: round(rect.width / width),
            },
            to,
          });
          return;
        }

        await next({ to });
      },
      leave: (item) => async (next) => {
        if (albumItemRef) {
          albumItemRef.style.visibility = "hidden";
        }

        // if (!isOpen && albumItemRef) {
        //   const rect = albumItemRef.getBoundingClientRect();
        //   const { width } = getDimensions(item);
        //   await Promise.all([
        //     animateOverlay({ opacity: 0 }),
        //     next({
        //       x: 0 - (viewport.width / 2 - (rect.x + rect.width / 2)),
        //       y: 0 - (viewport.height / 2 - (rect.y + rect.height / 2)),
        //       scale: round(rect.width / width),
        //       transformOrigin: "50% 50%",
        //     }),
        //   ]).then(() => {
        //     albumItemRef.style.visibility = "visible";
        //     onDismiss();
        //   });
        //   return;
        // }

        // console.log("leave", { isOpen, delayedIsOpen: delayedIsOpen.current })

        let x = item ? getDimensions(item).width : viewport.width;
        await next({
          to: {
            x: 0 - x * direction.current,
            y: 0,
            scale: 1,
            transformOrigin: "50% 50%",
            opacity: 0,
          },
          config: {
            precision: 0.1,
          },
        });
      },
      immediate: (key) => key === "transformOrigin",
      config: {
        tension: 300,
      },
    },
    [data, viewport]
  );

  const bind = useGesture({
    onDrag: ({
      args: [args],
      cancel,
      canceled,
      down,
      elapsedTime,
      event,
      last,
      memo,
      movement: [mx, my],
      vxvy: [vx, vy],
      // xy: [x, y],
    }) => {
      // supposed to fix image drag problem in firefox
      event.preventDefault();

      if (canceled) {
        return;
      }

      if (!memo) {
        memo = {
          d: [],
        };
      }

      if (Array.isArray(memo.d)) {
        if (memo.d.length < 4) {
          memo.d.push(Math.abs(mx) - Math.abs(my));
          return memo;
        } else {
          // const { width, height } = getDimensions(item)
          // const rx = x - viewport.width / 2;
          // const ry = y - viewport.height / 2;
          // console.log("update", {
          //   transformOrigin: `${round(rx / width * 100)}% ${round(ry / height * 100)}%`,
          // })
          // update({
          //   // transformOrigin: `${(width / 2 + rx) / width * 100}% ${(height / 2 + ry) / height * 100}%`,
          //   transformOrigin: `${round(rx / width * 100)}% ${round(ry / height * 100)}%`,
          // });

          if (average(memo.d) > 0) {
            memo.d = mx < 0 ? "left" : "right";
          } else {
            memo.d = my < 0 ? "up" : "down";
          }
        }
      }

      const { transitionFn } = args;
      const { item, phase } = transitionFn;

      switch (memo.d) {
        case "left":
        case "right": {
          if (last && swipeThreshold({ mx, vx, elapsedTime, viewport })) {
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
          if (last && dismissThreshold({ my, vy, elapsedTime, viewport })) {
            cancel();
            const rect = albumItemRef.getBoundingClientRect();
            const { width } = getDimensions(item);
            Promise.all([
              animateOverlay({ opacity: 0 }),
              update({
                x: 0 - (viewport.width / 2 - (rect.x + rect.width / 2)),
                y: 0 - (viewport.height / 2 - (rect.y + rect.height / 2)),
                scale: round(rect.width / width),
                transformOrigin: "50% 50%",
              }),
            ]).then(() => {
              albumItemRef.style.visibility = "visible";
              onDismiss();
            });
            break;
          }

          animateOverlay({
            opacity: down ? clamp(1 - (my * 2) / viewport.height) : 1,
          });

          if (phase === "enter") {
            update({
              x: down ? mx : 0,
              y: down ? my : 0,
              scale: down ? round(Math.max(my, 0) / -1000 + 1) : 1,
              immediate: (key) => down && (key === "x" || key === "y"),
            });
          }

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
        {transition((style, item, transitionFn) => {
          return item ? (
            <Animated
              key={item.key}
              style={style}
              sx={sx.item}
              {...bind({ transitionFn })}
            >
              <Box style={{ ...getDimensions(item) }}>
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
