import React from 'react';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import { graphql, navigate } from 'gatsby';
import mousetrap from 'mousetrap';

import { breakpoints } from 'style/tokens';
import { getDisplayName } from 'utils/people';
import { color } from 'style/system';

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
    photosJson: { id, image },
  },
}) => {
  const toNext = React.useCallback(() => {
    if (!pageContext.next) return;
    navigate(pageContext.next, {
      state: {
        ...(location.state || {}),
      },
    });
  }, [pageContext, location]);

  const toPrevious = React.useCallback(() => {
    if (!pageContext.prev) return;
    navigate(pageContext.prev, {
      state: {
        ...(location.state || {}),
      },
    });
  }, [pageContext, location]);

  React.useEffect(() => {
    mousetrap.bind('left', toPrevious);
    mousetrap.bind('right', toNext);

    return () => {
      mousetrap.unbind('left');
      mousetrap.unbind('right');
    };
  }, [toPrevious, toNext]);

  const people = [];

  const tags =
    allFacesJson &&
    allFacesJson.edges.map(({ node }) => {
      people.push(node.person ? getDisplayName(node.person) : 'Unknown person');
      return node;
    });

  console.log(image);

  return (
    <Layout>
      <Wrapper>
        <Photo tags={tags} image={image}>
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
  query singleImage($id: String!) {
    photosJson(id: { eq: $id }) {
      id
      image {
        fluid(maxWidth: 800) {
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
