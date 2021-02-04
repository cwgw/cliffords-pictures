import React from "react";

import { useOnLocationChange } from "./src/context/modal";
import { Modal } from "components/Modal";

function createElement(props) {
  return React.createElement(props.pageResources.component, {
    ...props,
    key: props.pageResources.page.path,
  });
}

const ComponentRenderer = (props) => {
  const handleLocationChange = useOnLocationChange();
  const origin = React.useRef(null);
  const isOpen = Boolean(origin.current && props.location.state.modal);

  React.useEffect(() => {
    if (!isOpen) {
      origin.current = props;
    }
  }, [props, isOpen]);

  React.useEffect(() => {
    handleLocationChange(
      isOpen && {
        isOpen,
        origin: origin.current.pageResources.page.path,
        ...props.pageContext.navigation,
      }
    );
  }, [handleLocationChange, isOpen, props.pageContext]);

  let pageElement = createElement(props);
  let modalElement = null;

  if (isOpen) {
    modalElement = pageElement;
    pageElement = createElement(origin.current);
  }

  return (
    <React.Fragment>
      {pageElement}
      <Modal isOpen={isOpen}>{modalElement}</Modal>
    </React.Fragment>
  );
};

export function replaceComponentRenderer({ props }) {
  return React.createElement(ComponentRenderer, props);
}
