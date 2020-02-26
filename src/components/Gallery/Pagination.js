import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import css from '@styled-system/css';

import Button from 'components/Button';

const propTypes = {
  nextPage: PropTypes.string,
  prevPage: PropTypes.string,
};

const defaultProps = {
  nextPage: null,
  prevPage: null,
};

const Nav = styled.nav(
  css({
    marginY: 'lg',
    marginX: 'auto',
    paddingX: 'md',
    maxWidth: '768px',
    boxSizing: 'content-box',
  })
);

const List = styled.ul(
  css({
    padding: 0,
    margin: 0,
    listStyle: 'none',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gridGap: 'md',
  })
);

const Pagination = ({ nextPage, prevPage }) => {
  const navItems = [
    [prevPage, { justifySelf: 'end' }, `←`],
    [nextPage, { justifySelf: 'start', gridColumn: 2 }, `→`],
  ];

  return (
    <Nav>
      <List>
        {navItems.map(([slug, style, text]) =>
          slug ? (
            <li key={slug} css={{ display: 'inline-block', ...style }}>
              <Button to={slug} disabled={!!!slug}>
                {text}
              </Button>
            </li>
          ) : null
        )}
      </List>
    </Nav>
  );
};

Pagination.propTypes = propTypes;

Pagination.defaultProps = defaultProps;

export default Pagination;
