import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import GatsbyImage from 'gatsby-image';

import VisuallyHidden from 'components/VisuallyHidden';

import { span } from 'style/shared';

import Link from 'components/Link';

const propTypes = {
  id: PropTypes.string,
  image: PropTypes.object,
  fields: PropTypes.object,
};

const Button = styled('button')(
  css({
    ...span,
    width: '100%',
    padding: 0,
    margin: 0,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  })
);

const Item = ({ id, image, fields, onClick, isInitialized }) => {
  return (
    <li
      css={css({
        position: 'relative',
        boxShadow: 'slight',
      })}
    >
      <GatsbyImage {...image} />
      {isInitialized ? (
        <Button onClick={onClick} data-photo-id={id}>
          <VisuallyHidden>{`View photo"`}</VisuallyHidden>
        </Button>
      ) : (
        <Link to={fields.slug} variant="span">
          <VisuallyHidden>{`View photo`}</VisuallyHidden>
        </Link>
      )}
    </li>
  );
};

Item.propTypes = propTypes;

export default Item;
