/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import css from '@styled-system/css';

import useIntersectionObserver from 'hooks/useIntersectionObserver';
import { space } from 'style/system';

import Button from 'components/Button';
import Pagination from 'components/Pagination';
import AlbumContext from 'components/AlbumViewState';
import VisuallyHidden from 'components/VisuallyHidden';

import Item from './Item';

const propTypes = {
  pageData: PropTypes.shape({
    photos: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        image: PropTypes.object,
        fields: PropTypes.object,
      })
    ),
    pageIndex: PropTypes.number,
    pageTotal: PropTypes.number,
    paginationEndpoint: PropTypes.string,
  }).isRequired,
  isInfinite: PropTypes.bool,
};

const defaultProps = {
  isInfinite: false,
};

const Grid = styled('ul')(
  css({
    display: 'grid',
    gridColumnGap: 'lg',
    gridRowGap: 'lg',
    gridTemplateColumns: `repeat(auto-fill, minmax(0, 384px))`,
    justifyContent: 'center',
    maxWidth: `calc(384px * 3 + ${space.lg}px * 2)`,
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

const PhotoGrid = ({ pageData, isInfinite }) => {
  const {
    init,
    isInfiniteScrollEnabled,
    enableInfiniteScroll,
    hasMore,
    loadMore,
    photos,
    openModal,
  } = React.useContext(AlbumContext);

  const [ref] = useIntersectionObserver(loadMore);

  React.useEffect(() => {
    if (init) {
      init(pageData);
    }
  }, [pageData, init]);

  const { prev, next } = pageData;

  const gridItems = node => (
    <Item key={node.id} onClick={openModal} {...node} />
  );

  if (isInfinite) {
    if (isInfiniteScrollEnabled && photos.length) {
      return (
        <React.Fragment>
          <Grid>{photos.map(gridItems)}</Grid>
          <VisuallyHidden ref={ref} />
          <Footer>
            {hasMore() ? `Loading more…` : `You've reached the end!`}
          </Footer>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Grid>{pageData.photos.map(gridItems)}</Grid>
        <Footer>
          <Button onClick={enableInfiniteScroll}>Load more</Button>
        </Footer>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid>{pageData.photos.map(gridItems)}</Grid>
      <Pagination prev={prev} next={next} />
    </React.Fragment>
  );
};

PhotoGrid.propTypes = propTypes;

PhotoGrid.defaultProps = defaultProps;

export default PhotoGrid;
