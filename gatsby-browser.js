import React from 'react';

import { Provider as AlbumViewProvider } from 'components/AlbumViewState';
import { Provider as EditorProvider } from 'components/EditorContext';

export const wrapRootElement = ({ element }) => (
  <EditorProvider>
    <AlbumViewProvider children={element} />
  </EditorProvider>
);
