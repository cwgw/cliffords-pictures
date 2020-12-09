import { transparentize as _transparentize } from "polished";
import { get } from "theme-ui";
import { getColor } from "@theme-ui/color";

const transparentize = (n, color) => (theme) => {
  return _transparentize(n, getColor(theme, color));
};

const space = (space) => (theme) => {
  const n = get(theme, `space.${space}`, space);
  return !isNaN(Number(n)) ? n + "px" : n;
};

export { get, getColor, space, transparentize };
