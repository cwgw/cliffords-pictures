import React from 'react';
import css from '@styled-system/css';
import { graphql, navigate } from 'gatsby';
import mousetrap from 'mousetrap';
import GatsbyImage from 'gatsby-image';

import { color } from 'style/utils';

const SingleImage = ({
  pageContext,
  location,
  data: {
    photo: { image },
  },
}) => {
  console.log('Rendering SingleImage');
  const toNext = React.useCallback(() => {
    console.log('toNext', pageContext.id);
    if (!pageContext.nextPhotoPath) return;
    navigate(pageContext.nextPhotoPath, {
      state: {
        ...(location.state || {}),
      },
    });
  }, [pageContext, location]);

  const toPrevious = React.useCallback(() => {
    console.log('toPrevious', pageContext.id);
    if (!pageContext.prevPhotoPath) return;
    navigate(pageContext.prevPhotoPath, {
      state: {
        ...(location.state || {}),
      },
    });
  }, [pageContext, location]);

  React.useEffect(() => {
    console.log('SinglePhoto useEffect hook');
    mousetrap.bind('left', toPrevious);
    mousetrap.bind('right', toNext);

    return () => {
      mousetrap.unbind('left');
      mousetrap.unbind('right');
    };
  }, [toPrevious, toNext, location]);

  return (
    <div
      css={css({
        margin: '0 auto',
        maxWidth: '768px',
      })}
    >
      <GatsbyImage
        css={css({
          display: 'block',
          boxShadow: 'raised',
        })}
        backgroundColor={color.white}
        fluid={image.fluid}
      />
    </div>
  );
};

export default SingleImage;

export const query = graphql`
  query singleImage($id: String!) {
    photo(id: { eq: $id }) {
      id
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
