import React from "react";
import { graphql, navigate } from "gatsby";

import { Modal } from "../components/Modal";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

const Context = React.createContext();

const INITIALIZED = "INITIALIZED";
const PHOTOS_ADDED = "PHOTOS_ADDED";

const Provider = ({ props, loadPage, children }) => {
  const [state, dispatch] = React.useReducer(reducer, getInitialState());
  const [refs] = React.useState(new WeakMap());
  const pageKey = React.useRef(null);
  const loaded = React.useRef([]);
  const origin = React.useRef(null);
  const isOpen = Boolean(
    origin.current && props.location.state && props.location.state.modal
  );

  React.useEffect(() => {
    if (pageKey.current !== props.path && isAlbumPage(props)) {
      pageKey.current = props.path;
      loaded.current = [];
      dispatch([INITIALIZED, getPayloadFromProps(props)]);
    }

    if (!isOpen) {
      origin.current = props;
    }
  }, [isOpen, props, refs]);

  const loadPhotos = React.useCallback(async () => {
    if (state.next && !loaded.current.includes(state.next)) {
      loaded.current.push(state.next);
      const page = await loadPage(`/photos/${state.next}`);
      dispatch([PHOTOS_ADDED, getPayloadFromProps(page.json, refs)]);
    }
  }, [loadPage, refs, state.next]);

  const onDismiss = () => {
    const path = origin.current && origin.current.pageResources.page.path;
    // const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    // const scrollTo = [ 0, scrollY ];
    // console.log("onDismiss", scrollTo)
    if (path) {
      // navigate(path, { state: { noScroll: true, scrollTo } });
      navigate(path, { state: { noScroll: true } });
    }
  };

  // let modalElement = null;
  let pageElement = children;
  let siblings = {};

  if (isOpen) {
    // modalElement = pageElement;
    pageElement = createElement(origin.current);
    siblings = getSiblings(props.path, state);
  }

  const current = state.photosByKey[props.path];
  const data = getPhotoData(props);

  return (
    <Context.Provider value={{ current, isOpen, loadPhotos, refs, state }}>
      {pageElement}
      <Modal
        onDismiss={onDismiss}
        isOpen={isOpen}
        siblings={siblings}
        data={data ? [data] : []}
      />
    </Context.Provider>
  );
};

function getInitialState() {
  return {
    photos: [],
    photosByKey: {},
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

function denormalizePhotos(state, refs) {
  const { photos, photosByKey } = state;
  return photos.map((key) => {
    const item = photosByKey[key];
    return { ...item, ref: setRef(item) };
  });

  function setRef(item) {
    return (el) => refs.set(item, el);
  }
}

function getPayloadFromProps(props) {
  const { data, pageContext } = props;
  return {
    photos: data.allPhoto.edges.map(({ node }) => node),
    pagination: pageContext.pagination,
  };
}

function isAlbumPage(props) {
  const { data, pageContext } = props || {};
  return data && data.allPhoto && pageContext && pageContext.pagination;
}

function getPhotoData(props) {
  if (!props.path.startsWith("/photo/") || !props.data.photo) {
    return;
  }

  const photo = props.data.photo;
  return {
    ...photo,
    width: photo.image.fluid.width,
    height: photo.image.fluid.height,
  };
}

function createElement(props) {
  return React.createElement(props.pageResources.component, {
    ...props,
    key: props.pageResources.page.path,
  });
}

function prefetch(path) {
  if (typeof window !== "undefined") {
    return window.___loader.prefetch(path);
  }
}

function getSiblings(slug, state) {
  const { photos, photosByKey } = state;
  let prev = null;
  let next = null;

  if (photosByKey[slug]) {
    const i = photos.indexOf(slug);
    if (photos[i - 1]) {
      prev = photosByKey[photos[i - 1]];
      prefetch(prev.slug);
    }

    if (photos[i + 1]) {
      next = photosByKey[photos[i + 1]];
      prefetch(next.slug);
    }
  }

  return { prev, next };
}

/**
 * Hooks
 */

function useInfiniteScroll() {
  const { loadPhotos, state, refs } = React.useContext(Context);
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
    photos: denormalizePhotos(state, refs),
  };
}

function useIsModal() {
  const { isOpen } = React.useContext(Context);
  return isOpen;
}

function useGetAlbumItemRef() {
  const { refs, current } = React.useContext(Context);
  return refs.has(current) ? refs.get(current) : null;
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
  Provider,
  useGetAlbumItemRef,
  useInfiniteScroll,
  useIsModal,
};
