import React from "react";
import { graphql } from "gatsby";

import { Gallery } from "../components/Gallery";

export default (props) => <Gallery {...props} />;

export const query = graphql`
  query HomeTemplateQuery($skip: Int!, $limit: Int!) {
    allPhoto(limit: $limit, skip: $skip, sort: { fields: id }) {
      edges {
        node {
          ...PhotoFragment
        }
      }
    }
  }
`;
