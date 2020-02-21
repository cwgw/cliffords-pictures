import React from 'react';

import PhotoGrid from 'components/PhotoGrid';

const PhotoListTemplate = ({ pageContext }) => (
  <PhotoGrid pageData={pageContext} />
);

export default PhotoListTemplate;
