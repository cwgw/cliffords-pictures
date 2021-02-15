import React from "react";
import { graphql } from "gatsby";

import { useIsModal } from "../context/app";
import { Image } from "../components/Image";

const style = {
  default: {
    width: "100%",
    maxWidth: "768px",
    margin: "auto",
    boxShadow: "raised",
  },
  modal: {
    maxWidth: "calc(100vw - 3rem)",
    maxHeight: "calc(100vh - 3rem)",
    margin: "auto",
  },
};

const SingleImage = ({
  data: {
    photo: { transform, image, aspectRatio },
  },
}) => {
  const isModal = useIsModal();
  if (transform && transform.rotate % 180) {
    aspectRatio = 1 / aspectRatio;
  }
  const width = 768;
  const height = width / aspectRatio;

  // React.useEffect(() => {
  //   const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  //   console.log("SingleImage", scrollY);
  // }, []);

  return (
    <Image
      sx={isModal ? style.modal : style.default}
      style={isModal ? { width, height } : null}
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
      id
      aspectRatio
      transform {
        rotate
      }
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
