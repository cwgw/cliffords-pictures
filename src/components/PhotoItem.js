import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import GatsbyImage from 'gatsby-image';

const propTypes = {
  children: PropTypes.node,
  image: PropTypes.object.isRequired,
  imgClassName: PropTypes.string,
  style: PropTypes.object,
  tags: PropTypes.array,
  transform: PropTypes.object,
};

const defaultProps = {
  children: null,
  imgClassName: 'SingleImage__Image',
  style: {},
  tags: null,
  transform: null,
};

const Figure = styled('figure')({
  display: 'block',
  position: 'relative',
  margin: 0,
  '& figcaption': {
    margin: '1.5rem 0',
  },
});

const Image = styled(GatsbyImage)(
  css({
    display: 'block',
    maxWidth: '100%',
    boxShadow: 'raised',
  })
);

const PhotoItem = React.forwardRef(
  (
    { children, image, imgRef, imgClassName, style, transform, ...props },
    ref
  ) => {
    const { img: imgStyle, wrapper: wrapperStyle, ...figureStyle } =
      style || {};
    return (
      <Figure ref={ref} style={figureStyle} {...props}>
        <div ref={imgRef}>
          <Image
            className={imgClassName}
            style={wrapperStyle}
            imgStyle={imgStyle}
            {...image}
          />
        </div>
        {children}
      </Figure>
    );
  }
);

PhotoItem.propTypes = propTypes;

PhotoItem.defaultProps = defaultProps;

export default styled(PhotoItem)();
