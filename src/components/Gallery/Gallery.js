import React from 'react';
import PropTypes from 'prop-types';

import useInfiniteScroll from 'hooks/useInfiniteScroll';

import Button from 'components/Button';

import Pagination from './Pagination';
import Grid from './Grid';

const propTypes = {
  pageIndex: PropTypes.number.isRequired,
  pageTotal: PropTypes.number.isRequired,
  paginationEndpoint: PropTypes.string.isRequired,
  photos: PropTypes.array.isRequired,
};

const Gallery = ({
  pageIndex,
  pageTotal,
  nextPage,
  prevPage,
  paginationEndpoint,
  photos,
}) => {
  const {
    enable,
    items,
    isInitialized,
    isEnabled,
    hasMore,
    sentinelRef,
  } = useInfiniteScroll(
    { pageIndex, pageTotal, items: photos },
    async (state) => {
      const index = state.pageIndex + 1;
      const uri = `${__PATH_PREFIX__}/${paginationEndpoint}/${index}.json`;
      return fetch(uri)
        .then((res) => res.json())
        .then(({ photos, pageIndex }) => ({ items: photos, pageIndex }));
    }
  );

  let footer = <Pagination nextPage={nextPage} prevPage={prevPage} />;

  if (isInitialized) {
    footer = isEnabled ? (
      <span ref={sentinelRef}>
        {hasMore() ? `Loading more…` : `You've reached the end!`}
      </span>
    ) : (
      <Button onClick={enable}>Load more</Button>
    );
  }

  return (
    <React.Fragment>
      <Grid items={items.length > 0 ? items : photos} />
      <div
        css={{
          textAlign: 'center',
          minHeight: '120px',
        }}
      >
        {footer}
      </div>
    </React.Fragment>
  );
};

Gallery.propTypes = propTypes;

export default Gallery;
