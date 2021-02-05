import GatsbyImage from "gatsby-image";

import { createThemedElement } from "../style";

export const Image = createThemedElement(GatsbyImage, {
  forwardProps: [
    "fixed",
    "fluid",
    "fadeIn",
    "durationFadeIn",
    "crossOrigin",
    "imgStyle",
    "placeholderStyle",
    "placeholderClassName",
    "backgroundColor",
    "onLoad",
    "onStartLoad",
    "onError",
    "Tag",
    "objectFit",
    "objectPosition",
    "loading",
    "critical",
    "itemProp",
  ],
});
