import React from 'react';
import PropTypes from 'prop-types';
import css from '@emotion/css';

import { span } from 'style/shared';

import Link from 'components/Link';
import AlbumContext from 'components/AlbumContext';
import Photo from 'components/Photo';
import VisuallyHidden from 'components/VisuallyHidden';

const propTypes = {
  id: PropTypes.string,
  image: PropTypes.object,
  fields: PropTypes.object,
};

const Item = ({ id, image: { fluid }, fields }) => {
  const { openModal } = React.useContext(AlbumContext);
  return (
    <li>
      <Photo
        image={{ fluid }}
        onClick={openModal}
        data-photo-id={id}
        css={css({
          cursor: 'pointer',
        })}
      >
        <noscript>
          <Link to={fields.slug} style={span}>
            <VisuallyHidden>{`View photo with id ${id}`}</VisuallyHidden>
          </Link>
        </noscript>
      </Photo>
    </li>
  );
};

Item.propTypes = propTypes;

export default Item;
