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
  current: [],
});

const Provider = ({ children }) => {
  const [pageState, setPageState] = React.useState({
    pageIndex: 0,
    data: [],
    pageTotal: 0,
  });
  const [isInfiniteScrollEnabled, setEnabled] = React.useState(false);
  const [isModalOpen, setStatus] = React.useState(false);
  const [current, setcurrent] = React.useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [slide, setSlide] = React.useState({ current: 0, previous: 0 });

  const getPhotoById = React.useCallback(({ id, data }) => {
    for (let i = data.length - 1; i >= 0; i--) {
      if (id === data[i].id) {
        return i;
      }
    }
    return null;
  }, []);

  const updatecurrent = React.useCallback(
    index => {
      if (typeof index !== 'number') {
        return;
      }
      const data = pageState.data;
      const i = index >= data.length ? data.length - 1 : index < 0 ? 0 : index;
      const next = data[i + 1] ? data[i + 1] : null;
      const current = data[i];
      const prev = data[i - 1] ? data[i - 1] : null;
      setcurrent([prev, current, next]);
      setCurrentIndex(i);
      setSlide(s => ({ current: i, previous: s.previous }));
    },
    [pageState.data]
  );

  const nextPhoto = () => {
    updatecurrent(currentIndex + 1);
  };

  const prevPhoto = () => {
    updatecurrent(currentIndex - 1);
  };

  const changeSlide = i => {
    setSlide(({ current, previous }) => {
      let next = current + i;
      if (0 <= next && next < pageState.data.length) {
        return {
          current: next,
          previous: current,
        };
      }
      return {
        current,
        previous,
      };
    });
    // setCurrentIndex(n => {
    //   if (0 <= n + i && n + i < pageState.data.length) {
    //     return n + i;
    //   }
    //   return n;
    // });
  };

  const closeModal = React.useCallback(() => {
    setStatus(false);
  }, [setStatus]);

  const openModal = React.useCallback(
    e => {
      const id = e.currentTarget.dataset.photoId;
      updatecurrent(getPhotoById({ id, data: pageState.data }));
      setStatus(true);
    },
    [setStatus, getPhotoById, updatecurrent, pageState.data]
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
        current,
        updatecurrent,
        nextPhoto,
        prevPhoto,
        currentIndex,
        changeSlide,
        slide,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
};

export { AlbumContext as default, Provider };
