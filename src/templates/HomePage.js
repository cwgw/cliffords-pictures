import React from 'react';

import Layout from 'components/Layout';
import PhotoGrid from 'components/PhotoGrid';
import AlbumContext from 'components/AlbumContext';

const Index = ({ pageContext }) => {
  const { data } = React.useContext(AlbumContext);
  const count = data.length || pageContext.data.length;
  return (
    <Layout>
      <p style={{ textAlign: 'center' }}>{count} images</p>
      <PhotoGrid pageData={pageContext} isInfinite={true} />
    </Layout>
  );
};

export default Index;
