import React from 'react';

import { Provider as AlbumViewProvider } from 'context/AlbumViewState';

export default ({ element }) => (
  <AlbumViewProvider>{element}</AlbumViewProvider>
);
