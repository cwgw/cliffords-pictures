import React from "react";
import { Global } from "@emotion/react";
import { Helmet } from "react-helmet";
import { css } from "theme-ui";

import { fontFaceDeclarations, fonts } from "../assets/fonts";
import { global } from "../style";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Helmet
        defaultTitle="Clifford's Pictures"
        htmlAttributes={{ lang: "en-US" }}
      >
        <style>
          {`:root {
            --reach-dialog: 1;
          }`}
        </style>
        {fonts.reduce(
          (arr, font) =>
            font.src.map(({ url, format }) => [
              ...arr,
              <link
                key={url}
                rel="preload"
                href={url}
                as="font"
                type={`font/${format}`}
                crossOrigin="anonymous"
              />,
            ]),
          []
        )}
      </Helmet>
      <Global
        styles={[
          ...fontFaceDeclarations.map((o) => ({ "@font-face": o })),
          css(global),
        ]}
      />
      <Header />
      <main>{children}</main>
      <Footer />
    </React.Fragment>
  );
};

export { Layout };
