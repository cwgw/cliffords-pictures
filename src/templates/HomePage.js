import React from 'react';

import Layout from 'components/Layout';
import PhotoGrid from 'components/PhotoGrid';
import PaginationContext from 'components/PaginationContext';

const Index = ({ pageContext: { photos, pagination, index, total } }) => {
  const { data } = React.useContext(PaginationContext);
  const count = data.length || photos.length;
  return (
    <Layout>
      <p style={{ textAlign: 'center' }}>{count} images</p>
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

export default Index;
