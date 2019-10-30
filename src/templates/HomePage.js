import React from 'react';

import Layout from 'components/Layout';
import PhotoGrid from 'components/PhotoGrid';

const propTypes = {};

const Index = ({ pageContext: { photos, pagination, index, total } }) => {
  return (
    <Layout>
      <p style={{ textAlign: 'center' }}>{photos.length} images</p>
      <PhotoGrid
        items={photos || []}
        index={index}
        total={total}
        isInfinite={true}
        pagination={pagination}
      />
    </Layout>
  );
};

Index.propTypes = propTypes;

export default Index;
