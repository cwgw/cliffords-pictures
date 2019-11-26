import React from 'react';

import AlbumContext from 'components/AlbumViewState';
import Layout from 'components/Layout';
import PhotoGrid from 'components/PhotoGrid';

const Index = ({ pageContext }) => {
  const { photos } = React.useContext(AlbumContext);
  const current = photos.length || pageContext.photos.length;
  const total = pageContext.photoTotal;
  return (
    <Layout>
      <p style={{ textAlign: 'center' }}>
        [{current}/{total}] images
      </p>
      <PhotoGrid pageData={pageContext} isInfiniteScrollAllowed={true} />
    </Layout>
  );
};

export default Index;
