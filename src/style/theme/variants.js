import { transparentize } from "../utils";

const buttons = {
  default: {
    paddingY: "sm",
    paddingX: "md",
    borderColor: transparentize(0.75, "primary"),
    "&:hover, &:focus": {
      borderColor: "currentColor",
    },
  },
};

const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: "0",
};

const spanParent = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: "block",
};

const outline = {
  outline: (t) => `3px solid ${t.colors.secondary}`,
  transition: `outline 100ms`,
  transitionTimingFunction: "in",
};

export { buttons, visuallyHidden, outline, spanParent };
