/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import css from '@styled-system/css';

import useInfiniteScroll from 'hooks/useInfiniteScroll';

import Button from 'components/Button';
import Link from 'components/Link';
import Pagination from 'components/Pagination';
import PaginationContext from 'components/InfiniteScrollContext';
import Photo from 'components/Photo';
import VisuallyHidden from 'components/VisuallyHidden';

const propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      image: PropTypes.object,
      fields: PropTypes.object,
    })
  ),
  columnWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  columnWidth: 384,
  isInfinite: false,
};

const Grid = styled('ul')(
  css({
    display: 'grid',
    listStyle: 'none',
    justifyContent: 'center',
    gridGap: '1.5rem',
    gridTemplateColumns: `repeat(3, minmax(0, 384px))`,
    padding: 0,
    margin: 0,
    marginBottom: 'xl',
  })
);

const PhotoGrid = ({ items, index, total, pagination, isInfinite }) => {
  const context = React.useContext(PaginationContext);
  const [ref] = useInfiniteScroll(context.loadMore);
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
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Grid>{items.map(gridItems)}</Grid>
        <p
          css={css({
            textAlign: 'center',
          })}
        >
          <Button onClick={context.activate}>Load more…</Button>
        </p>
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
