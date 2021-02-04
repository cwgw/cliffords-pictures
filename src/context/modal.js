import React from "react";
import { navigate } from "gatsby";

const ModalContext = React.createContext();

const LOCATION_CHANGED = "LOCATION_CHANGED";

const initialState = {
  origin: null,
  next: null,
  prev: null,
  isOpen: false,
};

const prefetch = (path) => {
  if (typeof window !== "undefined") {
    return window.___loader.prefetch(path);
  }
};

const ModalProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    if (state.prev) {
      prefetch(state.prev);
    }

    if (state.next) {
      prefetch(state.next);
    }
  }, [state.next, state.prev]);

  const handleLocationChange = React.useCallback(
    (payload) => {
      dispatch([LOCATION_CHANGED, payload]);
    },
    [dispatch]
  );

  const onDismiss = React.useCallback(() => {
    if (state.origin) {
      navigate(state.origin, { state: { noScroll: true } });
    }
  }, [state.origin]);

  const onPrevious = React.useCallback(() => {
    if (state.prev) {
      navigate(state.prev, { state: { noScroll: true, modal: true } });
    }
  }, [state.prev]);

  const onNext = React.useCallback(() => {
    if (state.next) {
      navigate(state.next, { state: { noScroll: true, modal: true } });
    }
  }, [state.next]);

  return (
    <ModalContext.Provider
      value={{
        onDismiss,
        onPrevious,
        onNext,
        handleLocationChange,
        state,
      }}
      children={children}
    />
  );
};

function reducer(state, [action, payload]) {
  switch (action) {
    case LOCATION_CHANGED: {
      return payload ? { ...state, ...payload } : initialState;
    }
    default: {
      return state;
    }
  }
}

function useOnLocationChange() {
  const { handleLocationChange } = React.useContext(ModalContext);
  return handleLocationChange;
}

function useModalProps() {
  const { onDismiss, onPrevious, onNext } = React.useContext(ModalContext);
  return { onDismiss, onPrevious, onNext };
}

function useModalState() {
  const { state } = React.useContext(ModalContext);
  return state;
}

export { ModalProvider, useModalProps, useModalState, useOnLocationChange };
