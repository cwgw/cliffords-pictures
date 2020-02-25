import React from 'react';

import useIntersectionObserver from 'hooks/useIntersectionObserver';

const initialState = {
  items: [],
  pageIndex: 0,
  pageTotal: 0,
  isInitialized: false,
  isEnabled: false,
};

const actions = {
  initialized: 'INITIALIZED',
  enabled: 'ENABLED',
  disabled: 'DISABLED',
  itemsAdded: 'ITEMS_ADDED',
};

function reducer(state, action) {
  switch (action.type) {
    case actions.initialized: {
      if (state.isInitialized) {
        return state;
      }

      const { pageIndex, pageTotal, items } = action.payload;

      return {
        ...state,
        pageIndex,
        pageTotal,
        items: state.items.length > 0 ? state.items.concat(items) : items,
        isInitialized: true,
      };
    }

    case actions.enabled: {
      return { ...state, isEnabled: true };
    }

    case actions.disabled: {
      return { ...state, isEnabled: false };
    }

    case actions.itemsAdded: {
      const { items, ...rest } = action.payload;
      return {
        ...state,
        ...rest,
        items: state.items.concat(items),
      };
    }

    default: {
      throw new Error();
    }
  }
}

const useInfiniteScroll = (initialData, loadData) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({ type: actions.initialized, payload: initialData });
  }, [initialData]);

  const hasMore = () => {
    if (!state.isEnabled) return false;
    if (!state.isInitialized) return true;
    return state.pageIndex < state.pageTotal;
  };

  const loadMore = async () => {
    if (!hasMore()) {
      return;
    }

    try {
      const payload = await loadData(state);
      dispatch({ type: actions.itemsAdded, payload });
    } catch (error) {
      console.error(`Failed to load more items`, error);
    }
  };

  const [sentinelRef] = useIntersectionObserver(loadMore);

  return {
    ...state,
    enable: () => {
      dispatch({ type: actions.enabled });
    },
    disable: () => {
      dispatch({ type: actions.disabled });
    },
    hasMore,
    loadMore,
    sentinelRef,
  };
};

export default useInfiniteScroll;
