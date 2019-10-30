import React from 'react';

import { Provider as PaginationProvider } from 'components/PaginationContext';

export const wrapRootElement = ({ element }) => (
  <PaginationProvider children={element} />
);
