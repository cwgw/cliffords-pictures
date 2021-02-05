import React from "react";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { animated, useSpring } from "@react-spring/web";

import { useModalProps } from "../context/modal";
import { createThemedElement } from "../style";
import { Button } from "./Button";
import { Carousel } from "./Carousel";

const style = {
  close: {
    position: "fixed",
    top: "sm",
    right: "sm",
    zIndex: 1000,
  },
};

const Overlay = animated(
  createThemedElement(DialogOverlay, {
    baseStyles: {
      variant: "cover",
      position: "fixed",
      backdropFilter: "blur(4px)",
      color: "white",
    },
    forwardProps: ["isOpen", "onDismiss"],
  })
);

const Content = createThemedElement(DialogContent, {
  baseStyles: { outline: "none" },
});

const Modal = ({ children }) => {
  const { isOpen, onDismiss, onNext, onPrevious } = useModalProps();

  const { backgroundColor } = useSpring({
    backgroundColor: isOpen ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0)",
  });

  return (
    <Overlay isOpen={isOpen} onDismiss={onDismiss} style={{ backgroundColor }}>
      <Content aria-label="Photo modal">
        <Button onClick={onDismiss} sx={style.close} title="Close">
          {"╳"}
        </Button>
        <Carousel onDismiss={onDismiss} onRight={onNext} onLeft={onPrevious}>
          {children}
        </Carousel>
      </Content>
    </Overlay>
  );
};

export { Modal };
