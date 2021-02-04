import React from "react";

import { ModalProvider } from "./src/context/modal";

export const wrapRootElement = ({ element }) => (
  <ModalProvider>{element}</ModalProvider>
);
