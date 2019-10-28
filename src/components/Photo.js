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
  style: PropTypes.object,
};

const defaultProps = {
  children: null,
  style: {},
};

const Photo = ({ children, image, style, ...props }) => {
  const { img: imgStyle, wrapper: wrapperStyle, ...figureStyle } = style || {};
  return (
    <figure
      style={figureStyle}
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
        style={wrapperStyle}
        imgStyle={imgStyle}
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
