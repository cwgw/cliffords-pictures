import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import css from '@styled-system/css';

import { space } from 'style/utils';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

import AlbumContext from 'context/AlbumViewState';

import Button from 'components/Button';
import Pagination from 'components/Pagination';
import Modal from 'components/PhotoModal';

import GridItem from './GridItem';

const propTypes = {
  itemWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
};

const defaultProps = {
  itemWidth: '384px',
  columnGap: `${space.lg}px`,
  rowGap: `${space.lg}px`,
};

const Grid = styled.ul(
  css({
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'sm',
    marginY: 'xl',
    marginX: 'auto',
    boxSizing: 'content-box',
    listStyle: 'none',
  })
);

const Footer = styled.div({
  textAlign: 'center',
  minHeight: '120px',
});

const PhotoGrid = ({ columnGap, itemWidth, pageData, rowGap }) => {
  const {
    init,
    isInitialized,
    isInfiniteScrollEnabled,
    enableInfiniteScroll,
    hasMore,
    loadMore,
    photos,
    openModal,
  } = React.useContext(AlbumContext);

  React.useEffect(() => {
    if (init) {
      init(pageData);
    }
  }, [pageData, init]);

  const [ref] = useIntersectionObserver(loadMore);

  return (
    <React.Fragment>
      <Grid
        css={{
          gridColumnGap: columnGap,
          gridRowGap: rowGap,
          gridTemplateColumns: `repeat(auto-fill, minmax(0, ${itemWidth}))`,
          maxWidth: `calc(${itemWidth} * 3 + ${columnGap} * 2)`,
        }}
      >
        {(photos.length ? photos : pageData.photos).map(node => (
          <GridItem
            key={node.id}
            onClick={openModal}
            isInitialized={isInitialized}
            {...node}
          />
        ))}
      </Grid>
      <Footer>
        {!isInitialized ? (
          <Pagination {...pageData} />
        ) : !isInfiniteScrollEnabled ? (
          <Button onClick={enableInfiniteScroll}>Load more</Button>
        ) : (
          <span ref={ref}>
            {hasMore() ? `Loading more…` : `You've reached the end!`}
          </span>
        )}
      </Footer>
      <Modal />
    </React.Fragment>
  );
};

PhotoGrid.propTypes = propTypes;

PhotoGrid.defaultProps = defaultProps;

export default PhotoGrid;
