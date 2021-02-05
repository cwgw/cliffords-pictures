import React from "react";
import { graphql } from "gatsby";

import { useIsModal } from "../context/modal";
import { Image } from "../components/Image";

const style = {
  default: {
    width: "100%",
    maxWidth: "768px",
    margin: "auto",
    boxShadow: "raised",
  },
  modal: {
    width: "100%",
    height: "100%",
    maxWidth: "768px",
    maxHeight: "100vh",
    margin: "auto",
  },
};

const SingleImage = ({
  data: {
    photo: { image },
  },
}) => {
  const isModal = useIsModal();

  return (
    <Image
      sx={isModal ? style.modal : style.default}
      imgStyle={{ objectFit: "contain" }}
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
