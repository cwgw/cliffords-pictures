import React from 'react';

import { Provider as AlbumViewProvider } from 'context/AlbumViewState';
import { Provider as EditorProvider } from 'context/EditorContext';

export const wrapRootElement = ({ element }) => (
  <EditorProvider>
    <AlbumViewProvider children={element} />
  </EditorProvider>
);
