import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import css from '@styled-system/css';

import { space } from 'style/utils';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

import Button from 'components/Button';
import Pagination from 'components/Pagination';
import AlbumContext from 'components/AlbumViewState';
import Modal from 'components/PhotoModal';

import GridItem from './GridItem';

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
  isInfiniteScrollAllowed: PropTypes.bool,
};

const defaultProps = {
  isInfiniteScrollAllowed: false,
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

const Footer = styled('div')({
  textAlign: 'center',
  minHeight: '120px',
});

const PhotoGrid = ({ pageData }) => {
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
      <Grid>
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
