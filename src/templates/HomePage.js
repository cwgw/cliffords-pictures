import React from 'react';

// import AlbumContext from 'components/AlbumViewState';
import Layout from 'components/Layout';
import PhotoGrid from 'components/PhotoGrid';

const Index = ({ pageContext }) => {
  return (
    <Layout>
      <PhotoGrid pageData={pageContext} isInfiniteScrollAllowed={true} />
    </Layout>
  );
};

export default Index;
