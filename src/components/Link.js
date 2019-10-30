import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import styled from '@emotion/styled';
import { variant } from 'styled-system';

import { span } from 'style/shared';

const propTypes = {
  activeClassName: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
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
  onClick: null,
  rel: null,
  tabIndex: null,
  target: '_blank',
};

const Link = styled(
  ({
    activeClassName,
    children,
    className,
    onClick,
    rel,
    state,
    tabIndex,
    target,
    to,
  }) =>
    /^\/(?!\/)/.test(to) ? (
      <GatsbyLink
        activeClassName={activeClassName}
        className={className}
        onClick={onClick}
        state={state}
        tabIndex={tabIndex}
        rel={rel}
        to={to}
      >
        {children}
      </GatsbyLink>
    ) : (
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
    )
)(
  variant({
    variants: {
      span,
    },
  })
);

Link.propTypes = propTypes;

Link.defaultProps = defaultProps;

export default Link;
