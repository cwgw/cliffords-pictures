import React from 'react';

import Layout from 'components/Layout';
import PhotoGrid from 'components/PhotoGrid';

const PhotoListTemplate = ({
  pageContext: { pagination, photos, index, total },
}) => {
  return (
    <Layout>
      <PhotoGrid
        items={photos || []}
        index={index}
        total={total}
        isInfinite={false}
        pagination={pagination}
      />
    </Layout>
  );
};

export default PhotoListTemplate;
