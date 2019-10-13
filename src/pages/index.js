import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import PhotoGrid from 'components/PhotoGrid';
// import Hero from 'components/Hero';

const propTypes = {
  data: PropTypes.shape({
    images: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

const defaultProps = {
  data: {
    images: {
      edges: [],
    },
  },
};

const Index = ({ data: { images } }) => {
  const items = images.edges.map(({ node: { image, ...node } }) => {
    if (!image) {
      console.log({ image, ...node });
      return {
        ...node,
        fluid: {},
      };
    }
    return {
      ...node,
      ...image.childImageSharp,
    };
  });
  return (
    <Layout>
      {/* <Hero /> */}
      <p style={{ textAlign: 'center' }}>{items.length} images</p>
      <PhotoGrid items={items} />
    </Layout>
  );
};

Index.propTypes = propTypes;

Index.defaultProps = defaultProps;

export default Index;

export const query = graphql`
  query {
    images: allImageMetaJson(sort: { fields: id }) {
      edges {
        node {
          id
          transform {
            rotation
          }
          fields {
            slug
          }
          image {
            childImageSharp {
              fluid(maxWidth: 300) {
                ...GatsbyImageSharpFluid_withWebp
                aspectRatio
              }
            }
          }
        }
      }
    }
  }
`;
