import React from "react";

// import { PhotosProvider } from "./src/context/photos";
// import { ModalProvider } from "./src/context/modal";
import { Provider } from "./src/context/app";
import { Layout } from "./src/layouts";

export const wrapPageElement = ({ element, loadPage, props }) => (
  <Layout {...props}>
    <Provider props={props} loadPage={loadPage}>
      {element}
    </Provider>
  </Layout>
);
