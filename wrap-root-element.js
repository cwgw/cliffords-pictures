import React from 'react';

import { Provider as AlbumViewProvider } from 'context/AlbumViewState';
import { Provider as EditorProvider } from 'context/EditorContext';

export default ({ element }) => (
  <EditorProvider>
    <AlbumViewProvider>{element}</AlbumViewProvider>
  </EditorProvider>
);
