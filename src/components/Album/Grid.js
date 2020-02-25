import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import GatsbyImage from 'gatsby-image';

import { space } from 'style/utils';

import VisuallyHidden from 'components/VisuallyHidden';
import Link from 'components/Link';

const propTypes = {
  children: PropTypes.node,
  columnGap: PropTypes.string,
  items: PropTypes.array,
  itemWidth: PropTypes.string,
  rowGap: PropTypes.string,
};

const defaultProps = {
  children: null,
  columnGap: `${space.lg}px`,
  items: [],
  itemWidth: '384px',
  rowGap: `${space.lg}px`,
};

const List = styled.ul(
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

const Grid = ({ columnGap, items, itemWidth, rowGap }) => (
  <List
    style={{
      gridColumnGap: columnGap,
      gridRowGap: rowGap,
      gridTemplateColumns: `repeat(auto-fill, minmax(0, ${itemWidth}))`,
      maxWidth: `calc(${itemWidth} * 3 + ${columnGap} * 2)`,
    }}
  >
    {items.map(({ id, image, fields }) => (
      <li
        key={id}
        css={css({
          position: 'relative',
          boxShadow: 'slight',
        })}
      >
        <GatsbyImage {...image} />
        <Link to={fields.slug} variant="spanParent" inModal>
          <VisuallyHidden>View photo</VisuallyHidden>
        </Link>
      </li>
    ))}
  </List>
);

Grid.propTypes = propTypes;

Grid.defaultProps = defaultProps;

export default Grid;
