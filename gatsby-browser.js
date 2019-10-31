import React from 'react';

import { Provider as AlbumProvider } from 'components/AlbumContext';
import { Provider as EditorProvider } from 'components/EditorContext';

export const wrapRootElement = ({ element }) => (
  <EditorProvider>
    <AlbumProvider children={element} />
  </EditorProvider>
);
