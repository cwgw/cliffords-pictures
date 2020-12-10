import React from "react";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { animated, useSpring } from "@react-spring/web";

import { createComponent } from "../../style";
import { Button } from "../Button";
import { Carousel } from "./Carousel";

const Overlay = animated(
  createComponent(DialogOverlay, {
    baseStyles: {
      variant: "spanParent",
      position: "fixed",
      backdropFilter: "blur(4px)",
      color: "white",
    },
    forwardProps: ["isOpen", "onDismiss"],
  })
);

const Content = createComponent(DialogContent, {
  baseStyles: { outline: "none" },
});

const Modal = ({
  onDismiss,
  isOpen,
  setContentRef,
  children,
  onNext,
  onPrevious,
}) => {
  const { backgroundColor } = useSpring({
    backgroundColor: isOpen ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0)",
  });

  return (
    <Overlay isOpen={isOpen} onDismiss={onDismiss} style={{ backgroundColor }}>
      <Content ref={setContentRef} aria-label="Photo modal">
        <Button
          onClick={onDismiss}
          sx={{
            position: "fixed",
            top: "sm",
            right: "sm",
            zIndex: 1000,
          }}
          children="╳"
          title="Close"
        />
        <Carousel onDismiss={onDismiss} onRight={onNext} onLeft={onPrevious}>
          {children}
        </Carousel>
      </Content>
    </Overlay>
  );
};

export { Modal };
