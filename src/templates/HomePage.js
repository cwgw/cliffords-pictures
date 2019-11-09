import React from 'react';

import Layout from 'components/Layout';
import PhotoGrid from 'components/PhotoGrid';
// import AlbumContext from 'components/AlbumContext';
import AlbumContext from 'components/AlbumViewState';

const Index = ({ pageContext }) => {
  const { photos } = React.useContext(AlbumContext);
  const count = photos.length || pageContext.photos.length;
  return (
    <Layout>
      <p style={{ textAlign: 'center' }}>{count} images</p>
      <PhotoGrid pageData={pageContext} isInfinite={true} />
    </Layout>
  );
};

export default Index;
