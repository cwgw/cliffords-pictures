import GatsbyImage from "gatsby-image";

import { createComponent } from "../style";

export const Image = createComponent(GatsbyImage, {
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
