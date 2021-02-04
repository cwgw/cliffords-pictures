import React from "react";

import { PhotosProvider } from "./src/context/photos";
import { Layout } from "./src/layouts";

export const wrapPageElement = ({ element, loadPage, props }) => (
  <PhotosProvider props={props} loadPage={loadPage}>
    <Layout {...props}>{element}</Layout>
  </PhotosProvider>
);
