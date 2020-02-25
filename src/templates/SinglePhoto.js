import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import GatsbyImage from 'gatsby-image';

import ModalContext from 'context/ModalContext';

const Image = styled(GatsbyImage)({
  margin: 'auto',
  width: '100%',
  maxWidth: '768px',
});

const SingleImage = ({
  data: {
    photo: { image },
  },
}) => {
  const { modal } = React.useContext(ModalContext);

  if (modal) {
    return (
      <Image
        css={{
          height: '100%',
          maxHeight: '100vh',
        }}
        imgStyle={{
          objectFit: 'contain',
        }}
        backgroundColor="transparent"
        fluid={image.fluid}
      />
    );
  }

  return (
    <Image
      css={css({
        boxShadow: 'raised',
      })}
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
