import React from "react";
import { graphql } from "gatsby";

import useIntersectionObserver from "../hooks/useIntersectionObserver";

const PhotosContext = React.createContext();

const initialState = {
  photos: [],
  index: null,
  total: null,
  next: null,
  prev: null,
};

const INITIALIZED = "INITIALIZED";
const PHOTOS_ADDED = "PHOTOS_ADDED";

const PhotosProvider = ({ props, loadPage, children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [refs] = React.useState(new Map());
  const pageKey = React.useRef(null);
  const loaded = React.useRef([]);

  React.useEffect(() => {
    if (pageKey.current !== props.path && areValidProps(props)) {
      pageKey.current = props.path;
      loaded.current = [];
      dispatch([INITIALIZED, transformPayload(props, refs)]);
    }
  }, [props, refs]);

  const loadPhotos = React.useCallback(async () => {
    if (state.next && !loaded.current.includes(state.next)) {
      loaded.current.push(state.next);
      const page = await loadPage(`/photos/${state.next}`);
      dispatch([PHOTOS_ADDED, transformPayload(page.json, refs)]);
    }
  }, [loadPage, refs, state.next]);

  const getPhoto = React.useCallback(
    (id) => {
      return refs.has(id) ? refs.get(id) : null;
    },
    [refs]
  );

  function hasMore() {
    return !!state.next;
  }

  return (
    <PhotosContext.Provider
      value={{ getPhoto, hasMore, loadPhotos, state }}
      children={children}
    />
  );
};

function reducer(state, [action, payload]) {
  switch (action) {
    case INITIALIZED: {
      const { photos, pagination } = payload;
      return { photos, ...pagination };
    }
    case PHOTOS_ADDED: {
      const { photos, pagination } = payload;
      return { photos: state.photos.concat(photos), ...pagination };
    }
    default: {
      return state;
    }
  }
}

function areValidProps(props) {
  return (
    props.data &&
    props.data.allPhoto &&
    props.pageContext &&
    props.pageContext.pagination
  );
}

function transformPayload({ data, pageContext }, refs) {
  return {
    photos: data.allPhoto.edges.map(({ node }) => ({
      ...node,
      ref: setRef(node),
    })),
    pagination: pageContext.pagination,
  };

  function setRef({ id }) {
    return (el) => refs.set(id, el);
  }
}

function useInfiniteScroll() {
  const { loadPhotos, hasMore, state } = React.useContext(PhotosContext);
  const [isEnabled, setEnabled] = React.useState(false);
  const enable = React.useCallback(() => setEnabled(true), [setEnabled]);
  const disable = React.useCallback(() => setEnabled(false), [setEnabled]);
  const ref = useIntersectionObserver(loadPhotos);

  return {
    isEnabled,
    enable,
    disable,
    ref,
    hasMore,
    photos: state.photos,
  };
}

function useLoadPhotos() {
  const { loadPhotos } = React.useContext(PhotosContext);
  return loadPhotos;
}

function useGetPhoto() {
  const { getPhoto } = React.useContext(PhotosContext);
  return getPhoto;
}

function usePhotos() {
  const {
    state: { photos },
  } = React.useContext(PhotosContext);
  return photos;
}

const PhotoFragment = graphql`
  fragment PhotoFragment on Photo {
    id
    slug
    aspectRatio
    image {
      fluid(maxWidth: 384) {
        src
        srcSet
        srcSetWebp
        srcWebp
        sizes
        aspectRatio
        base64
        width
        height
      }
    }
  }
`;

export {
  PhotoFragment,
  PhotosProvider,
  useGetPhoto,
  useInfiniteScroll,
  useLoadPhotos,
  usePhotos,
};
