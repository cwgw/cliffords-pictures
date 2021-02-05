import React from "react";
import { graphql } from "gatsby";

import { Gallery } from "../components/Gallery";

const AlbumTemplate = (props) => <Gallery {...props} />;

export default AlbumTemplate;

export const query = graphql`
  query AlbumTemplateQuery($skip: Int!, $limit: Int!) {
    allPhoto(limit: $limit, skip: $skip, sort: { fields: id }) {
      edges {
        node {
          ...PhotoFragment
        }
      }
    }
  }
`;
