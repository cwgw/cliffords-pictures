import React from 'react';
import PropTypes from 'prop-types';
import css from '@styled-system/css';
import GatsbyImage from 'gatsby-image';

import VisuallyHidden from 'components/VisuallyHidden';

import Link from 'components/Link';

const propTypes = {
  image: PropTypes.object,
  fields: PropTypes.object,
};

const Item = ({ image, fields }) => {
  return (
    <li
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
  );
};

Item.propTypes = propTypes;

export default Item;
