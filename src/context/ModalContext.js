import React from "react";

export const defaultValue = {
  isModal: false,
  closeTo: null,
};
const ModalContext = React.createContext(defaultValue);

export default ModalContext;
