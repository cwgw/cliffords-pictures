import React from 'react';

import Layout from 'components/Layout';
import PhotoGrid from 'components/PhotoGrid';

const PhotoListTemplate = ({ pageContext }) => {
  return (
    <Layout>
      <PhotoGrid pageData={pageContext} />
    </Layout>
  );
};

export default PhotoListTemplate;
