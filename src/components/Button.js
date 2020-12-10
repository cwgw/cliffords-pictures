import React from "react";

import { Box } from "./Box";
import { Link } from "./Link";

const baseStyles = {
  display: "inline-block",
  maxWidth: "100%",
  margin: 0,
  padding: 0,
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
  "&:active": {
    transform: "translate(0, 2px)",
  },
  "&:focus": {
    zIndex: 1,
  },
  "&[data-disabled]": {
    opacity: 0.35,
    cursor: "auto",
  },
};

const Button = React.forwardRef(({ disabled, ...rest }, ref) => {
  let props = rest;
  if (props.to) {
    props.as = Link;
  } else {
    props.as = props.as || "button";
    props.type = "button";
  }

  if (disabled) {
    props["data-disabled"] = true;
  }

  return (
    <Box
      __css={baseStyles}
      __themeKey="buttons"
      variant="default"
      ref={ref}
      {...props}
    />
  );
});

export { Button };
