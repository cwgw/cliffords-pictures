/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import Image from 'gatsby-image';

import { color } from 'style/system';

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

const Photo = React.forwardRef(
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
            backgroundColor={color('white')}
            {...image}
          />
        </div>
        {children}
      </figure>
    );
  }
);

Photo.propTypes = propTypes;

Photo.defaultProps = defaultProps;

export default styled(Photo)();
