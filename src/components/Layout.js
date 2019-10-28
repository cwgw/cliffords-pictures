import React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import css from '@styled-system/css';

import theme from 'style/theme';

import Header from 'components/Header';
import Helmet from 'react-helmet';
import Footer from 'components/Footer';
import global from 'style/global';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Global styles={css(global)} />
        <Helmet
          defaultTitle="Clifford's Pictures"
          htmlAttributes={{
            lang: 'en-US',
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </React.Fragment>
    </ThemeProvider>
  );
};

Layout.propTypes = propTypes;

export default Layout;
