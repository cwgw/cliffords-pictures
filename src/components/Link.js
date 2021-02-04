import React from "react";
import PropTypes from "prop-types";
import { Link as GatsbyLink } from "gatsby";

import { createComponent } from "../style";

const propTypes = {
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.string,
  inModal: PropTypes.bool,
  partiallyActive: PropTypes.string,
  replace: PropTypes.string,
  state: PropTypes.object,
  to: PropTypes.string,
  href: PropTypes.string,
};

const ThemeLink = createComponent("a", {
  themeKey: "links",
  defaultVariant: "styles.a",
  forwardProps: Object.keys(propTypes),
});

const Link = React.forwardRef(({ href, inModal, to, ...rest }, ref) => {
  const props = { ref, ...rest };
  const url = href || to;

  if (/^\/(?!\/)/.test(url)) {
    props.as = GatsbyLink;
    props.to = url;
  } else {
    props.href = url;
    props.rel = "noreferrer noopener";
    props.target = "_blank";
  }

  return <ThemeLink {...props} />;
});

Link.propTypes = propTypes;

export { Link };
