import React from 'react';

import { Provider } from 'components/InfiniteScrollContext';

export const wrapRootElement = ({ element }) => <Provider children={element} />;
