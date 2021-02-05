import React from "react";

import { createThemedElement } from "../style/createThemedElement";
import { Link } from "./Link";

const baseStyles = {
  display: "inline-block",
  maxWidth: "100%",
  p: 0,
  verticalAlign: "middle",
  overflow: "hidden",
  border: "1px solid",
  borderRadius: 0,
  background: "none",
  color: "inherit",
  fontFamily: "sans",
  fontSize: "inherit",
  lineHeight: "inherit",
  cursor: "pointer",
  textAlign: "center",
  textDecoration: "none",
  textOverflow: "ellipsis",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  WebkitAppearance: "none",
  MozApperance: "none",
  userSelect: "none",
  "&:not(:disabled):not([data-disabled]):active": {
    transform: "translate(0, 2px)",
  },
  "&:focus": {
    zIndex: 1,
  },
  "&:disabled, &[data-disabled]": {
    opacity: 0.35,
    cursor: "auto",
  },
};

const ThemedButton = createThemedElement("button", {
  themeKey: "buttons",
  defaultVariant: "default",
  baseStyles,
  forwardProps: ["to", "state"],
});

const Button = React.forwardRef(({ disabled, ...rest }, ref) => {
  let props = rest;

  if (props.to) {
    props.as = Link;
    if (disabled) {
      props["data-disabled"] = true;
    }
  } else {
    props.type = "button";
    props.disabled = disabled;
  }

  return <ThemedButton ref={ref} {...props} />;
});

export { Button };
