import React from 'react';
import PropTypes from 'prop-types';
import { Global, ThemeProvider } from '@emotion/react';
import { Helmet } from 'react-helmet';
import css from '@styled-system/css';

import global from 'style/global';
import theme from 'style/theme';

import Footer from 'components/Footer';
import Header from 'components/Header';

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
