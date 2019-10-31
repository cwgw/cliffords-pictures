import React from 'react';

const AlbumContext = React.createContext({
  pageIndex: 0 /* Which page infinite scroll should fetch next. */,
  data: [],
  isInfiniteScrollEnabled: false,
  isInitializing: () => {
    return true;
  },
  hasMore: () => {},
  loadMore: () => {},
  isModalOpen: false,
  closeModal: () => {},
  openModal: () => {},
  currentPhoto: [],
});

const Provider = ({ children }) => {
  const [pageState, setPageState] = React.useState({
    pageIndex: 0,
    data: [],
    pageTotal: 0,
  });
  const [isInfiniteScrollEnabled, setEnabled] = React.useState(false);
  const [isModalOpen, setStatus] = React.useState(false);
  const [currentPhoto, setCurrentPhoto] = React.useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState([]);

  const getPhotoById = React.useCallback(({ id, data }) => {
    for (let i = data.length - 1; i >= 0; i--) {
      if (id === data[i].node.id) {
        return i;
      }
    }
    return null;
  }, []);

  const updateCurrentPhoto = React.useCallback(
    index => {
      if (typeof index !== 'number') {
        return;
      }
      const data = pageState.data;
      const i = index >= data.length ? 0 : index < 0 ? data.length - 1 : index;
      const next = data[i + 1] ? data[i + 1].node : data[0].node;
      const current = data[i].node;
      const prev = data[i - 1] ? data[i - 1].node : data[data.length - 1].node;
      setCurrentPhoto([prev, current, next]);
      setCurrentPhotoIndex(i);
    },
    [pageState.data]
  );

  const nextPhoto = () => {
    updateCurrentPhoto(currentPhotoIndex + 1);
  };

  const prevPhoto = () => {
    updateCurrentPhoto(currentPhotoIndex - 1);
  };

  const closeModal = React.useCallback(() => {
    setStatus(false);
  }, [setStatus]);

  const openModal = React.useCallback(
    e => {
      const id = e.currentTarget.dataset.photoId;
      updateCurrentPhoto(getPhotoById({ id, data: pageState.data }));
      setStatus(true);
    },
    [setStatus, getPhotoById, updateCurrentPhoto, pageState.data]
  );

  function isInitializing() {
    return pageState.pageIndex === 0;
  }

  const enableInfiniteScroll = React.useCallback(() => {
    setEnabled(true);
  }, [setEnabled]);

  const updatePageState = React.useCallback(
    ({ pageIndex, pageTotal, data }) => {
      setPageState(o => ({
        pageIndex: typeof pageIndex === 'number' ? pageIndex : o.pageIndex,
        pageTotal: typeof pageTotal === 'number' ? pageTotal : o.pageTotal,
        data: Array.isArray(data) ? o.data.concat(data) : o.data,
      }));
    },
    [setPageState]
  );

  function hasMore() {
    if (!isInfiniteScrollEnabled) {
      return false;
    }
    if (isInitializing()) {
      return true;
    }
    return pageState.pageIndex < pageState.pageTotal;
  }

  function loadMore() {
    if (!hasMore()) {
      return;
    }
    const pageIndex = pageState.pageIndex + 1;
    const path = `${__PATH_PREFIX__}/pagination/${pageIndex}.json`;
    fetch(path)
      .then(res => {
        return res.json();
      })
      .then(data => {
        updatePageState({
          ...data,
          pageIndex,
        });
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
    <AlbumContext.Provider
      value={{
        enableInfiniteScroll,
        hasMore,
        isInfiniteScrollEnabled,
        isInitializing,
        loadMore,
        updatePageState,
        ...pageState,
        isModalOpen,
        closeModal,
        openModal,
        currentPhoto,
        updateCurrentPhoto,
        nextPhoto,
        prevPhoto,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
};

export { AlbumContext as default, Provider };
