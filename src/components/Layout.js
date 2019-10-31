import React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import Helmet from 'react-helmet';
import css from '@styled-system/css';

import global from 'style/global';
import theme from 'style/theme';

import Footer from 'components/Footer';
import Header from 'components/Header';
import Modal from 'components/Modal';

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
        <Modal />
      </React.Fragment>
    </ThemeProvider>
  );
};

Layout.propTypes = propTypes;

export default Layout;
