import React from 'react';

const PaginationContext = React.createContext({
  index: 0 /* Which page infinite scroll should fetch next. */,
  data: [],
  isActive: false,
  isInitializing: () => {
    return true;
  },
  setState: () => {},
  hasMore: () => {},
  loadMore: () => {},
});

const Provider = ({ children }) => {
  const [state, setState] = React.useState({
    index: 0,
    data: [],
    total: 0,
  });
  const [isActive, setActiveStatus] = React.useState(false);

  function isInitializing() {
    return state.index === 0;
  }

  const activate = React.useCallback(() => {
    setActiveStatus(true);
  }, [setActiveStatus]);

  const update = React.useCallback(
    ({ index, total, data }) => {
      setState(o => ({
        index: typeof index === 'number' ? index : o.index,
        total: typeof total === 'number' ? total : o.total,
        data: Array.isArray(data) ? o.data.concat(data) : o.data,
      }));
    },
    [setState]
  );

  function hasMore() {
    if (!isActive) {
      return false;
    }
    if (isInitializing()) {
      return true;
    }
    return state.index < state.total;
  }

  function loadMore() {
    if (!hasMore()) {
      return;
    }
    const index = state.index + 1;
    const path = `${__PATH_PREFIX__}/pagination/${index}.json`;
    fetch(path)
      .then(res => res.json())
      .then(({ data }) => {
        update({ index, data });
      })
      .catch(err => {
        console.error(
          `Failed to load more images.`,
          `Couldn't fetch pagination data.`,
          err
        );
      });
  }

  return (
    <PaginationContext.Provider
      value={{
        activate,
        hasMore,
        isActive,
        isInitializing,
        loadMore,
        update,
        ...state,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export { PaginationContext as default, Provider };
