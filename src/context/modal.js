import React from "react";
import { navigate } from "gatsby";

import { Modal } from "../components/Modal";

const ModalContext = React.createContext();

const ModalProvider = ({ props, children }) => {
  const origin = React.useRef(null);
  const isOpen = Boolean(origin.current && props.location.state.modal);

  React.useEffect(() => {
    if (!isOpen) {
      origin.current = props;
    }
  }, [props, isOpen]);

  const getOriginPath = React.useCallback(() => {
    if (isOpen && origin.current) {
      return origin.current.pageResources.page.path;
    }

    return null;
  }, [isOpen]);

  const onDismiss = React.useCallback(() => {
    const path = getOriginPath();
    if (path) {
      navigate(path, { state: { noScroll: true } });
    }
  }, [getOriginPath]);

  let pageElement = children;
  let modalElement = null;

  if (isOpen) {
    modalElement = createElement(props);
    pageElement = createElement(origin.current);
  }

  return (
    <ModalContext.Provider value={{ onDismiss, isOpen }}>
      {pageElement}
      <Modal>{modalElement}</Modal>
    </ModalContext.Provider>
  );
};

function createElement(props) {
  return React.createElement(props.pageResources.component, {
    ...props,
    key: props.pageResources.page.path,
  });
}

function useModalProps() {
  const props = React.useContext(ModalContext);
  return props;
}

function useIsModal() {
  const { isOpen } = React.useContext(ModalContext);
  return isOpen;
}

export { ModalProvider, useModalProps, useIsModal };
