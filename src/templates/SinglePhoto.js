import React from 'react';
import css from '@styled-system/css';
import { graphql, navigate } from 'gatsby';
import mousetrap from 'mousetrap';

import { breakpoints } from 'style/tokens';

import Photo from 'components/Photo';

const SingleImage = ({
  pageContext,
  location,
  data: {
    photo: { image },
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

  return (
    <div
      css={css({
        margin: '0 auto',
        padding: '0 1.5rem',
        maxWidth: breakpoints.lg,
        display: 'flex',
        flexFlow: 'column nowrap',
      })}
    >
      <Photo
        image={image}
        css={css({
          width: '768px',
          maxWidth: '100%',
          margin: '0 auto',
        })}
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
