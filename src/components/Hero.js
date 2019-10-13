import React from 'react';
import styled from '@emotion/styled';
import { useStaticQuery, graphql } from 'gatsby';

import PhotoComponent from 'components/PhotoItem';

const Wrapper = styled.div`
  margin: 0 0 5rem;
`;

const Photo = styled(PhotoComponent)`
  max-width: 800px;
  margin: 0 auto;
`;

const Hero = () => {
  const { photo } = useStaticQuery(graphql`
    query {
      photo: imageMetaJson(id: { eq: "0x23b0c86653ab3d8f" }) {
        id
        image {
          childImageSharp {
            fluid(maxWidth: 900, toFormat: JPG) {
              ...GatsbyImageSharpFluid_withWebp
              aspectRatio
            }
          }
        }
      }
    }
  `);

  return (
    <Wrapper>
      <Photo image={photo.image.childImageSharp} />
    </Wrapper>
  );
};

export default Hero;
