import React from 'react';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import { graphql, navigate } from 'gatsby';
import mousetrap from 'mousetrap';

import { breakpoints } from 'style/tokens';
import { getDisplayName } from 'utils/people';

import Layout from 'components/Layout';
import Photo from 'components/PhotoItem';

const propTypes = {};

const Wrapper = styled('div')(
  css({
    margin: '0 auto',
    padding: '0 1.5rem',
    maxWidth: breakpoints.lg,
    display: 'flex',
    flexFlow: 'column nowrap',
    [`& ${Photo}`]: {
      width: '768px',
      maxWidth: '100%',
      margin: '0 auto',
      '& img': {
        cursor: 'zoom-in',
      },
    },
  })
);

const SingleImage = ({
  pageContext,
  location,
  data: {
    allFacesJson,
    imageMetaJson: {
      id,
      transform,
      image: { childImageSharp },
    },
  },
}) => {
  const to = dir => {
    if (!pageContext[dir]) return;
    navigate(pageContext[dir], {
      state: {
        ...(location.state || {}),
      },
    });
  };

  const toNext = React.useCallback(() => {
    to('next');
  }, []);

  const toPrevious = React.useCallback(() => {
    to('previous');
  }, []);

  React.useEffect(() => {
    mousetrap.bind('left', toPrevious);
    mousetrap.bind('right', toNext);

    return () => {
      mousetrap.unbind('left');
      mousetrap.unbind('right');
    };
  }, []);

  const people = [];

  const tags = allFacesJson.edges.map(({ node }) => {
    people.push(node.person ? getDisplayName(node.person) : 'Unknown person');
    return node;
  });

  return (
    <Layout>
      <Wrapper>
        <Photo tags={tags} image={childImageSharp} transform={transform}>
          <figcaption>
            <p>id: {id}</p>
            <p>{people && people.join(', ')}</p>
          </figcaption>
        </Photo>
      </Wrapper>
    </Layout>
  );
};

SingleImage.propTypes = propTypes;

export default SingleImage;

export const query = graphql`
  query singleImage($id: String!, $imageRotation: Int!) {
    imageMetaJson(id: { eq: $id }) {
      id
      transform {
        rotation
      }
      image {
        childImageSharp {
          fluid(maxWidth: 800, rotate: $imageRotation, toFormat: JPG) {
            ...GatsbyImageSharpFluid_withWebp
            aspectRatio
          }
        }
      }
    }
    allFacesJson(filter: { image: { fields: { imageID: { eq: $id } } } }) {
      edges {
        node {
          id
          rect {
            left
            top
            width
            height
          }
        }
      }
    }
  }
`;
