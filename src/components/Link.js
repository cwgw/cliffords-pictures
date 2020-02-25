import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import styled from '@emotion/styled';
import { variant } from 'styled-system';

import ModalContext from 'context/ModalContext';
import { spanParent } from 'style/shared';

const propTypes = {
  activeClassName: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  inModal: PropTypes.bool,
  onClick: PropTypes.func,
  rel: PropTypes.string,
  state: PropTypes.object,
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  target: PropTypes.string,
  to: PropTypes.string.isRequired,
};

const defaultProps = {
  activeClassName: null,
  children: null,
  className: null,
  inModal: false,
  onClick: null,
  rel: null,
  state: {},
  tabIndex: null,
  target: '_blank',
};

const Link = styled(
  ({
    activeClassName,
    children,
    className,
    inModal,
    onClick,
    rel,
    state,
    tabIndex,
    target,
    to,
  }) => {
    const { closeTo } = React.useContext(ModalContext);

    if (/^\/(?!\/)/.test(to)) {
      return (
        <GatsbyLink
          activeClassName={activeClassName}
          className={className}
          onClick={onClick}
          state={{
            modal: inModal,
            noScroll: to === closeTo,
            ...state,
          }}
          tabIndex={tabIndex}
          rel={rel}
          to={to}
        >
          {children}
        </GatsbyLink>
      );
    }

    return (
      <a
        className={className}
        href={to}
        onClick={onClick}
        rel={rel || 'noopener noreferrer'}
        tabIndex={tabIndex}
        target={target}
      >
        {children}
      </a>
    );
  }
)(
  variant({
    variants: {
      spanParent,
    },
  })
);

Link.propTypes = propTypes;

Link.defaultProps = defaultProps;

export default Link;
