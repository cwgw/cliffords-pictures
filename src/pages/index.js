import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import PhotoGrid from 'components/PhotoGrid';

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
  const items = images.edges.map(({ node }) => node);
  return (
    <Layout>
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
    images: allPhotosJson {
      edges {
        node {
          id
          fields {
            slug
          }
          image {
            fluid(maxWidth: 400) {
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
    }
  }
`;
