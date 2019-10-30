/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import css from '@styled-system/css';

import useIntersectionObserver from 'hooks/useIntersectionObserver';
import { space } from 'style/system';

import Button from 'components/Button';
import Link from 'components/Link';
import Pagination from 'components/Pagination';
import PaginationContext from 'components/PaginationContext';
import Photo from 'components/Photo';
import VisuallyHidden from 'components/VisuallyHidden';

const propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      image: PropTypes.object,
      fields: PropTypes.object,
    })
  ).isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pagination: PropTypes.shape({
    next: PropTypes.string,
    prev: PropTypes.string,
  }).isRequired,
  isInfinite: PropTypes.bool,
};

const defaultProps = {
  isInfinite: false,
};

const Grid = styled('ul')(
  css({
    display: 'grid',
    gridColumnGap: 'md',
    gridRowGap: ['lg', 'lg', 'md'],
    gridTemplateColumns: `repeat(auto-fill, minmax(0, 384px))`,
    justifyContent: 'center',
    maxWidth: `calc(384px * 3 + ${space.md}px * 2)`,
    padding: 'sm',
    marginY: 'xl',
    marginX: 'auto',
    boxSizing: 'content-box',
    listStyle: 'none',
  })
);

const Footer = styled('p')({
  textAlign: 'center',
  minHeight: '120px',
});

const PhotoGrid = ({ items, index, total, pagination, isInfinite }) => {
  const context = React.useContext(PaginationContext);
  const [ref] = useIntersectionObserver(context.loadMore);
  const { update } = context;

  React.useEffect(() => {
    update({
      data: items,
      index,
      total,
    });
  }, [index, items, total, update]);

  const gridItems = React.useCallback(
    ({ node: { id, image, fields } }) => (
      <li key={id}>
        <Photo image={image}>
          <Link to={fields.slug} variant="span" />
        </Photo>
      </li>
    ),
    []
  );

  if (isInfinite) {
    if (context && context.isActive && context.data.length) {
      return (
        <React.Fragment>
          <Grid>{context.data.map(gridItems)}</Grid>
          <VisuallyHidden ref={ref} />
          <Footer>
            {context.hasMore() ? `Loading more…` : `You've reached the end!`}
          </Footer>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Grid>{items.map(gridItems)}</Grid>
        <Footer>
          <Button onClick={context.activate}>Load more</Button>
        </Footer>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid>{items.map(gridItems)}</Grid>
      <Pagination {...pagination} />
    </React.Fragment>
  );
};

PhotoGrid.propTypes = propTypes;

PhotoGrid.defaultProps = defaultProps;

export default PhotoGrid;
