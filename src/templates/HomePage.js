import React from "react";
import { graphql } from "gatsby";

import { Gallery } from "../components/Gallery";

const HomeTemplate = (props) => {
  // React.useEffect(() => {
  //   const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  //   console.log("HomeTemplate", scrollY);
  // }, []);

  return <Gallery {...props} />;
};

export default HomeTemplate;

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
