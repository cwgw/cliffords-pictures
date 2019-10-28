/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import Image from 'gatsby-image';

const propTypes = {
  children: PropTypes.node,
  image: PropTypes.object.isRequired,
  imgClassName: PropTypes.string,
  style: PropTypes.object,
  tags: PropTypes.array,
};

const defaultProps = {
  children: null,
  imgClassName: 'SingleImage__Image',
  style: {},
  tags: null,
};

const PhotoItem = React.forwardRef(
  ({ children, image, imgRef, imgClassName, style, ...props }, ref) => {
    const { img: imgStyle, wrapper: wrapperStyle, ...figureStyle } =
      style || {};
    return (
      <figure
        ref={ref}
        style={figureStyle}
        css={css({
          display: 'block',
          position: 'relative',
          margin: 0,
          '& figcaption': {
            margin: '1.5rem 0',
          },
        })}
        {...props}
      >
        <div ref={imgRef}>
          <Image
            className={imgClassName}
            style={wrapperStyle}
            imgStyle={imgStyle}
            css={css({
              display: 'block',
              maxWidth: '100%',
              boxShadow: 'raised',
            })}
            {...image}
          />
        </div>
        {children}
      </figure>
    );
  }
);

PhotoItem.propTypes = propTypes;

PhotoItem.defaultProps = defaultProps;

export default styled(PhotoItem)();
