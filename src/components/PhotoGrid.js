import React from 'react';
import PropTypes from 'prop-types';
import { grid } from 'styled-system';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import { Link as GatsbyLink } from 'gatsby';

import { breakpoints } from 'style/tokens';

import Photo from 'components/PhotoItem';

const propTypes = {
  items: PropTypes.array,
  itemWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  items: [],
  itemWidth: 320,
};

const List = styled('div')(
  css({
    display: 'grid',
    maxWidth: breakpoints.xl,
    margin: '0.75rem auto',
    padding: '0 1.5rem',
    justifyContent: 'center',
    gridGap: '1.5rem',
  }),
  grid
);

const Link = styled(GatsbyLink)({
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

const PhotoGrid = ({ items, itemWidth, ...props }) => (
  <List
    itemWidth={itemWidth}
    gridTemplateColumns={[
      '1fr',
      'repeat(2, 1fr)',
      `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
    ]}
    {...props}
  >
    {items &&
      items.map(({ fields, id, transform, ...image }) => (
        <Photo
          key={id}
          data-photo-id={id}
          image={image}
          style={{ cursor: 'zoom-in' }}
          transform={transform}
        >
          <Link to={fields.slug} />
        </Photo>
      ))}
  </List>
);

PhotoGrid.propTypes = propTypes;

PhotoGrid.defaultProps = defaultProps;

export default PhotoGrid;
