import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import get from 'lodash/get';

import Layout from 'components/Layout';

const List = styled.ul`
  display: flex;
  flex-flow: row wrap;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li``;

const Image = styled.div``;

const Unknowns = ({ data: { allFacesJson } }) => {
  const tags = allFacesJson.edges.map(({ node }) => node);
  return (
    <Layout>
      <List>
        {tags.map(({ id, rect, image }) => {
          const { src, width, height } = get(image, 'resize', {});
          const x = rect.width / 2 + rect.left;
          const y = rect.height / 2 + rect.top;
          const rectSize = width * 0.25;
          return (
            <ListItem key={id}>
              <Image
                style={{
                  height: `${rectSize}px`,
                  width: `${rectSize}px`,
                  backgroundImage: `url(${src})`,
                  backgroundSize: `${width}px ${height}px`,
                  backgroundPosition: `${0 - x * width + rectSize / 2}px ${0 -
                    y * height +
                    rectSize / 2}px`,
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Layout>
  );
};

export default Unknowns;

export const pageQuery = graphql`
  query {
    allFacesJson {
      edges {
        node {
          id
          rect {
            left
            top
            width
            height
          }
          image {
            id
            resize(width: 800) {
              src
              width
              height
              aspectRatio
            }
          }
        }
      }
    }
  }
`;

// person {
//   id
//   name {
//     first
//     middle
//     last
//     suffix
//     maiden
//     nickname
//   }
//   displayName
// }
