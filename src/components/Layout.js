import React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import css from '@styled-system/css';

import theme from 'style/theme';

import Head from 'components/Head';
import Header from 'components/Header';
import global from 'style/global';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const Layout = ({ children, location }) => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Global styles={css(global)} />
        <Head />
        <Header />
        <main>{children}</main>
        <footer />
      </div>
    </ThemeProvider>
  );
};

Layout.propTypes = propTypes;

export default Layout;
