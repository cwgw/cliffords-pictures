import React from 'react';
import { graphql } from 'gatsby';
import css from '@styled-system/css';
import GatsbyImage from 'gatsby-image';

const SingleImage = ({
  data: {
    photo: { image },
  },
}) => {
  return (
    <GatsbyImage
      css={css({
        display: 'block',
        boxShadow: 'raised',
        width: '100%',
        maxHeight: '100%',
        maxWidth: '768px',
      })}
      style={{
        margin: 'auto',
      }}
      backgroundColor="transparent"
      fluid={image.fluid}
    />
  );
};

export default SingleImage;

export const query = graphql`
  query singleImage($id: String!) {
    photo(id: { eq: $id }) {
      image {
        fluid(maxWidth: 768) {
          src
          srcSet
          srcSetWebp
          srcWebp
          sizes
          aspectRatio
          base64
          width
          height
        }
      }
    }
  }
`;
