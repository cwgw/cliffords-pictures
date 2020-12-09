import React from "react";
import get from "lodash/get";

import ModalContext from "context/ModalContext";

import { Modal } from "components/Modal";

const withoutPrefix = (path) => {
  const prefix =
    typeof __BASE_PATH__ !== `undefined` ? __BASE_PATH__ : __PATH_PREFIX__;

  return path.slice(prefix ? prefix.length : 0);
};

const ComponentRenderer = (props) => {
  const pathname = React.useRef();
  const modalPage = React.useRef();
  const originPage = React.useRef();

  const contentRef = React.useRef();

  const { location, navigate, pageResources, pageContext } = props;

  React.useEffect(() => {
    if (location.pathname !== pathname.current) {
      pathname.current = location.pathname;
      if (get(location, "state.modal", false)) {
        // old page was a modal, keep track so we can render the contents while closing
        modalPage.current = props;
      } else {
        // old page was not a modal, keep track so we can render the contents under modals
        originPage.current = props;
      }
    }
  });

  React.useLayoutEffect(() => {
    if (
      location.pathname !== pathname.current &&
      get(location, "state.modal") &&
      contentRef.current
    ) {
      // modal remains open after path change, so make sure it's scrolled to the top
      contentRef.current.scrollTop = 0;
    }
  });

  // render modal if props location has modal
  const isModal = !!originPage.current && get(location, "state.modal", false);

  // the page is the previous path if this is a modal, otherwise it's the current path
  const pageElement = isModal
    ? React.createElement(originPage.current.pageResources.component, {
        ...originPage.current,
        key: originPage.current.pageResources.page.path,
      })
    : React.createElement(pageResources.component, {
        ...props,
        key: pageResources.page.path,
      });

  let modalElement = null;

  if (isModal) {
    // Rendering the current page as a modal, so create an element with the page contents
    modalElement = React.createElement(pageResources.component, {
      ...props,
      key: pageResources.page.path,
    });
  } else if (modalPage.current) {
    // Not rendering the current page as a modal, but we may be in the process of animating
    // the old modal content to close, so render the last modal content we have cached

    modalElement = React.createElement(
      get(modalPage.current, "pageResources.component"),
      {
        ...modalPage.current,
        key: get(modalPage.current, "pageResources.page.path"),
      }
    );
  }

  return (
    <>
      {pageElement}
      <Modal
        onDismiss={() => {
          navigate(withoutPrefix(originPage.current.location.pathname), {
            state: { noScroll: true },
          });
        }}
        setContentRef={(node) => (contentRef.current = node)}
        onPrevious={() => {
          if (pageContext.prevPhotoPath) {
            navigate(pageContext.prevPhotoPath, {
              state: location.state || {},
            });
          }
        }}
        onNext={() => {
          if (pageContext.nextPhotoPath) {
            navigate(pageContext.nextPhotoPath, {
              state: location.state || {},
            });
          }
        }}
        isOpen={!!isModal}
      >
        {modalElement ? (
          <React.Fragment key={props.location.key}>
            <ModalContext.Provider
              value={{
                modal: true,
                closeTo: originPage.current
                  ? withoutPrefix(originPage.current.location.pathname)
                  : "/",
              }}
            >
              {modalElement}
            </ModalContext.Provider>
          </React.Fragment>
        ) : null}
      </Modal>
    </>
  );
};

const replaceComponentRenderer = ({ props }) => {
  return React.createElement(ComponentRenderer, props);
};

export default replaceComponentRenderer;
