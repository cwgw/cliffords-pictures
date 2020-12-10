import React from "react";
import PropTypes from "prop-types";
import { Link as GatsbyLink } from "gatsby";

import { createComponent } from "../style";
import ModalContext from "context/ModalContext";

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

const Link = createComponent(
  React.forwardRef(({ href, inModal, state, to, ...rest }, ref) => {
    const { closeTo } = React.useContext(ModalContext);
    const props = { ref, ...rest };
    const url = href || to;
    let el = "a";

    if (/^\/(?!\/)/.test(url)) {
      el = GatsbyLink;
      props.to = url;
      props.state = {
        modal: !!inModal,
        noScroll: to === closeTo,
        ...(state || {}),
      };
    } else {
      props.href = url;
      props.rel = "noreferrer noopener";
      props.target = "_blank";
    }

    return React.createElement(el, props);
  }),
  {
    themeKey: "",
    defaultVariant: "styles.a",
    forwardProps: Object.keys(propTypes),
  }
);

Link.propTypes = propTypes;

export { Link };
