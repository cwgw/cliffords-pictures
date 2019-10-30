import React from 'react';

import { Provider as PaginationProvider } from 'components/PaginationContext';
import { Provider as EditorProvider } from 'components/EditorContext';

export const wrapRootElement = ({ element }) => (
  <PaginationProvider>
    <EditorProvider>{element}</EditorProvider>
  </PaginationProvider>
);
