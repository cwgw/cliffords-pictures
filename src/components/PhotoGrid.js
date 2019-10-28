/** @jsx jsx */
import PropTypes from 'prop-types';
import { jsx } from '@emotion/core';
import css from '@styled-system/css';
import { Link as GatsbyLink } from 'gatsby';

import { breakpoints } from 'style/tokens';

import Photo from 'components/Photo';

const propTypes = {
  items: PropTypes.array.isRequired,
  itemWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  itemWidth: 320,
};

const PhotoGrid = ({ items, itemWidth, ...props }) => {
  // console.log(items[0]);
  return (
    <ul
      css={css({
        display: 'grid',
        maxWidth: breakpoints.xl,
        margin: '0.75rem auto',
        padding: '0 1.5rem',
        listStyle: 'none',
        justifyContent: 'center',
        gridGap: '1.5rem',
        gridTemplateColumns: [
          '1fr',
          'repeat(2, 1fr)',
          `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
        ],
      })}
      {...props}
    >
      {items &&
        items.map(({ fields, id, transform, image }) => (
          <li key={id}>
            <Photo
              key={id}
              image={image}
              style={{ cursor: 'zoom-in' }}
              transform={transform}
            >
              <GatsbyLink
                to={fields.slug}
                css={{
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </Photo>
          </li>
        ))}
    </ul>
  );
};

PhotoGrid.propTypes = propTypes;

PhotoGrid.defaultProps = defaultProps;

export default PhotoGrid;
