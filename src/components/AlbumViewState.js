import React from 'react';
import findIndex from 'lodash/findIndex';

const initialState = {
  photos: [],
  photoIndex: {
    current: 0,
    previous: 0,
  },
  pageIndex: 0,
  pageTotal: 0,
  paginationEndpoint: null,
  isInitialized: false,
  isInfiniteScrollEnabled: false,
  isModalOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE': {
      const {
        pageIndex,
        pageTotal,
        paginationEndpoint,
        photos,
      } = action.payload;
      return {
        ...state,
        pageIndex,
        pageTotal,
        paginationEndpoint,
        photos: state.photos.length ? state.photos.concat(photos) : photos,
        isInitialized: true,
      };
    }
    case 'OPEN_MODAL': {
      return { ...state, isModalOpen: true };
    }
    case 'CLOSE_MODAL': {
      return { ...state, isModalOpen: false };
    }
    case 'ENABLE_INFINITE_SCROLL': {
      return { ...state, isInfiniteScrollEnabled: true };
    }
    case 'DISABLE_INFINITE_SCROLL': {
      return { ...state, isInfiniteScrollEnabled: false };
    }
    case 'SET_PHOTO': {
      const next = action.index;
      if (0 <= next && next < state.photos.length) {
        return {
          ...state,
          photoIndex: {
            current: next,
            previous: next,
          },
        };
      }
      return state;
    }
    case 'CHANGE_PHOTO': {
      const { current } = state.photoIndex;
      const next = current + action.index;
      if (0 <= next && next < state.photos.length) {
        return {
          ...state,
          photoIndex: {
            current: next,
            previous: current,
          },
        };
      }
      return state;
    }
    case 'ADD_PHOTOS': {
      const { photos, ...data } = action.data;
      return {
        ...state,
        ...data,
        photos: state.photos.concat(photos),
      };
    }
    default:
      throw new Error();
  }
}

const AlbumViewState = React.createContext(initialState);

function Provider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const init = React.useCallback(payload => {
    dispatch({ type: 'INITIALIZE', payload });
  }, []);

  const openModal = React.useCallback(
    e => {
      dispatch({ type: 'OPEN_MODAL' });
      if (e && e.currentTarget) {
        const id = e.currentTarget.dataset.photoId;
        if (id) {
          dispatch({
            type: 'SET_PHOTO',
            index: findIndex(state.photos, o => o.id === id),
          });
        }
      }
    },
    [state.photos]
  );

  const closeModal = React.useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const enableInfiniteScroll = React.useCallback(() => {
    dispatch({ type: 'ENABLE_INFINITE_SCROLL' });
  }, []);

  const changePhoto = React.useCallback(index => {
    dispatch({ type: 'CHANGE_PHOTO', index });
  }, []);

  const hasMore = React.useCallback(() => {
    if (!state.isInfiniteScrollEnabled) return false;
    if (!state.isInitialized) return true;
    return state.pageIndex < state.pageTotal;
  }, [
    state.isInfiniteScrollEnabled,
    state.isInitialized,
    state.pageIndex,
    state.pageTotal,
  ]);

  const loadMore = React.useCallback(() => {
    if (!hasMore()) return;
    const index = state.pageIndex + 1;
    const uri = `${__PATH_PREFIX__}/${state.paginationEndpoint}/${index}.json`;
    fetch(uri)
      .then(res => res.json())
      .then(data => {
        dispatch({ type: 'ADD_PHOTOS', data });
      })
      .catch(err => {
        console.error(
          `Failed to load more images.`,
          `Couldn't fetch pagination data.`,
          err
        );
      });
  }, [hasMore, state.pageIndex, state.paginationEndpoint]);

  return (
    <AlbumViewState.Provider
      value={{
        ...state,
        init,
        openModal,
        closeModal,
        changePhoto,
        enableInfiniteScroll,
        hasMore,
        loadMore,
      }}
    >
      {children}
    </AlbumViewState.Provider>
  );
}

export { AlbumViewState as default, Provider };
