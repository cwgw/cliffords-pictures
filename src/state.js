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
    case "INITIALIZE":
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
    case "OPEN_MODAL":
      return { ...state, isModalOpen: true };
    case "CLOSE_MODAL":
      return { ...state, isModalOpen: false };
    case "ENABLE_INFINITE_SCROLL":
      return { ...state, isInfiniteScrollEnabled: true };
    case "DISABLE_INFINITE_SCROLL":
      return { ...state, isInfiniteScrollEnabled: false };
    case "CHANGE_PHOTO":
      const { current, previous } = state.photoIndex;
      const next = current + action.index;
      let photoIndex = { current, previous };
      if (0 <= next && next < state.photos.length) {
        photoIndex = {
          current: next,
          previous: current,
        };
      }
      return { ...state, photoIndex };
    case "ADD_PHOTOS":
      const photos = state.photos.length
        ? state.photos.concat(action.data)
        : action.data;
      return { ...state, photos };
    default:
      throw new Error();
  }
}
