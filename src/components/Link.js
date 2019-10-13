import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';

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

const Link = React.forwardRef(
  (
    {
      activeClassName,
      children,
      className,
      onClick,
      rel,
      state,
      tabIndex,
      target,
      to,
    },
    ref
  ) =>
    /^\/(?!\/)/.test(to) ? (
      <GatsbyLink
        activeClassName={activeClassName}
        className={className}
        onClick={onClick}
        state={state}
        tabIndex={tabIndex}
        ref={ref}
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
        ref={ref}
        rel={rel || 'noopener noreferrer'}
        tabIndex={tabIndex}
        target={target}
      >
        {children}
      </a>
    )
);

Link.propTypes = propTypes;

Link.defaultProps = defaultProps;

export default Link;
