/** @jsx jsx */
import PropTypes from 'prop-types';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import Image from 'gatsby-image';

import { color } from 'style/system';

const propTypes = {
  children: PropTypes.node,
  image: PropTypes.object.isRequired,
};

const defaultProps = {
  children: null,
};

const Photo = ({ children, image, ...props }) => {
  return (
    <figure
      css={css({
        position: 'relative',
        margin: 0,
        '& figcaption': {
          margin: '1.5rem 0',
        },
      })}
      {...props}
    >
      <Image
        css={css({
          display: 'block',
          maxWidth: '100%',
          boxShadow: 'raised',
        })}
        backgroundColor={color.white}
        {...image}
      />
      {children}
    </figure>
  );
};

Photo.propTypes = propTypes;

Photo.defaultProps = defaultProps;

export default styled(Photo)();
