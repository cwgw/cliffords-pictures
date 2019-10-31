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
import AlbumContext from 'components/AlbumContext';
import VisuallyHidden from 'components/VisuallyHidden';

import Item from './Item';

const propTypes = {
  pageData: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        image: PropTypes.object,
        fields: PropTypes.object,
      })
    ),
    pageIndex: PropTypes.number,
    pageTotal: PropTypes.number,
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

const PhotoGrid = ({ pageData, isInfinite }) => {
  const {
    data,
    enableInfiniteScroll,
    hasMore,
    isInfiniteScrollEnabled,
    loadMore,
    updatePageState,
  } = React.useContext(AlbumContext);

  const [ref] = useIntersectionObserver(loadMore);

  React.useEffect(() => {
    if (updatePageState) {
      updatePageState(pageData);
    }
  }, [pageData, updatePageState]);

  const gridItems = ({ node }) => <Item key={node.id} {...node} />;

  if (isInfinite) {
    if (isInfiniteScrollEnabled && data.length) {
      return (
        <React.Fragment>
          <Grid>{data.map(gridItems)}</Grid>
          <VisuallyHidden ref={ref} />
          <Footer>
            {hasMore() ? `Loading more…` : `You've reached the end!`}
          </Footer>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Grid>{pageData.data.map(gridItems)}</Grid>
        <Footer>
          <Button onClick={enableInfiniteScroll}>Load more</Button>
        </Footer>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid>{pageData.data.map(gridItems)}</Grid>
      <Pagination {...pageData} />
    </React.Fragment>
  );
};

PhotoGrid.propTypes = propTypes;

PhotoGrid.defaultProps = defaultProps;

export default PhotoGrid;
