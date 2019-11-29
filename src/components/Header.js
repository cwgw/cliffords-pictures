import React from 'react';
import styled from '@emotion/styled';
import { useStaticQuery, graphql, Link as GatsbyLink } from 'gatsby';
import css from '@styled-system/css';

import { transparentize } from 'style/utils';

const Wrapper = styled('header')({
  margin: '0 auto 4rem',
  padding: '1rem 0 0',
  textAlign: 'center',
  borderTop: '1px solid transparent',
  borderBottom: '1px solid transparent',
});

const Link = styled(GatsbyLink)(
  css({
    display: 'inline-block',
    fontSize: '2rem',
    fontFamily: 'serif',
    fontVariationSettings: '"wght" 300, "opsz" 50, "XOPQ" 120, "PWGT" 150',
    textShadow: `0 0 12px ${transparentize(
      0.8,
      'primary'
    )}, 0 0 3px ${transparentize(0.6, 'primary')}`,
    textDecoration: 'none',
  })
);

const Header = () => {
  const {
    site: {
      siteMetadata: { title },
    },
  } = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return <Wrapper>{title && <Link to="/">{title}</Link>}</Wrapper>;
};

export default Header;
