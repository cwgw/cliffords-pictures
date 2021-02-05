import React from "react";

import { PhotosProvider } from "./src/context/photos";
import { ModalProvider } from "./src/context/modal";
import { Layout } from "./src/layouts";

export const wrapPageElement = ({ element, loadPage, props }) => (
  <PhotosProvider props={props} loadPage={loadPage}>
    <Layout {...props}>
      <ModalProvider props={props}>{element}</ModalProvider>
    </Layout>
  </PhotosProvider>
);
