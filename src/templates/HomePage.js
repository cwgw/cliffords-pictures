import React from 'react';

import PhotoGrid from 'components/PhotoGrid';

const Index = ({ pageContext }) => (
  <PhotoGrid pageData={pageContext} isInfiniteScrollAllowed={true} />
);

export default Index;
