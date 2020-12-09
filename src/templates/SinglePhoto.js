import React from "react";
import { graphql } from "gatsby";
import GatsbyImage from "gatsby-image";

import ModalContext from "context/ModalContext";
import { Box } from "../components/Box";
import { Image } from "../components/Image";

React.forwardRef((props, ref) => (
  <Box as={GatsbyImage} ref={ref} __css={{}} {...props} />
));

const SingleImage = ({
  data: {
    photo: { image },
  },
}) => {
  const { modal } = React.useContext(ModalContext);

  if (modal) {
    return (
      <Image
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: "768px",
          maxHeight: "100vh",
          margin: "auto",
        }}
        imgStyle={{ objectFit: "contain" }}
        backgroundColor="transparent"
        fluid={image.fluid}
      />
    );
  }

  return (
    <Image
      sx={{
        width: "100%",
        maxWidth: "768px",
        margin: "auto",
        boxShadow: "raised",
      }}
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
