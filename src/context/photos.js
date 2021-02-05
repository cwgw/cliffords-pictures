import React from "react";
import { graphql } from "gatsby";
import { useLocation } from "@reach/router";

import useIntersectionObserver from "../hooks/useIntersectionObserver";

const PhotosContext = React.createContext();

const INITIALIZED = "INITIALIZED";
const PHOTOS_ADDED = "PHOTOS_ADDED";

const PhotosProvider = ({ props, loadPage, children }) => {
  const [state, dispatch] = React.useReducer(reducer, getInitialState());
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

  return (
    <PhotosContext.Provider
      value={{ loadPhotos, refs, state }}
      children={children}
    />
  );
};

function getInitialState() {
  return {
    photos: [],
    index: null,
    total: null,
    next: null,
    prev: null,
  };
}

function reducer(state, [action, payload]) {
  switch (action) {
    case INITIALIZED: {
      const { photos, pagination } = payload;
      return {
        ...normalizePhotos(photos),
        ...pagination,
      };
    }
    case PHOTOS_ADDED: {
      const { photos, photosByKey } = normalizePhotos(payload.photos);
      return {
        photos: state.photos.concat(photos),
        photosByKey: { ...state.photosByKey, ...photosByKey },
        ...payload.pagination,
      };
    }
    default: {
      return state;
    }
  }
}

function normalizePhotos(photos) {
  const key = "slug";
  return photos.reduce(
    (memo, item) => {
      memo.photos.push(item[key]);
      memo.photosByKey[item[key]] = item;
      return memo;
    },
    { photos: [], photosByKey: {} }
  );
}

function denormalizePhotos(state) {
  const { photos, photosByKey } = state;
  return photos.map((key) => photosByKey[key]);
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

/**
 * Hooks
 */

function useInfiniteScroll() {
  const { loadPhotos, state } = React.useContext(PhotosContext);
  const [isEnabled, setEnabled] = React.useState(false);
  const enable = React.useCallback(() => setEnabled(true), [setEnabled]);
  const disable = React.useCallback(() => setEnabled(false), [setEnabled]);
  const hasMore = React.useCallback(() => !!state.next, [state.next]);
  const ref = useIntersectionObserver(loadPhotos);

  return {
    isEnabled,
    enable,
    disable,
    ref,
    hasMore,
    photos: denormalizePhotos(state),
  };
}

function prefetch(path) {
  if (typeof window !== "undefined") {
    return window.___loader.prefetch(path);
  }
}

function useGetSiblings() {
  const location = useLocation();
  const {
    state: { photos, photosByKey },
  } = React.useContext(PhotosContext);

  let previous = null;
  let next = null;

  if (photosByKey[location.pathname]) {
    const i = photos.indexOf(photosByKey[location.pathname].slug);
    if (photos[i - 1]) {
      previous = photosByKey[photos[i - 1]];
      prefetch(previous.slug);
    }

    if (photos[i + 1]) {
      next = photosByKey[photos[i + 1]];
      prefetch(next.slug);
    }
  }

  return { previous, next };
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

export { PhotoFragment, PhotosProvider, useGetSiblings, useInfiniteScroll };
