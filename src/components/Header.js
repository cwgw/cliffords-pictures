import React from 'react';
import styled from '@emotion/styled';
import { useStaticQuery, graphql, Link as GatsbyLink } from 'gatsby';
import css from '@styled-system/css';

const Wrapper = styled.header({
  margin: '0 auto 4rem',
  padding: '1rem 0 0',
  textAlign: 'center',
  borderTop: '1px solid transparent',
  borderBottom: '1px solid transparent',
});

const Link = styled(GatsbyLink)(
  css({
    display: 'inline-block',
    fontSize: '8',
    fontFamily: 'serif',
    fontVariationSettings: '"wght" 300, "opsz" 50, "XOPQ" 120, "PWGT" 150',
    textDecoration: 'none',
    paddingY: 'xs',
    paddingX: 'sm',
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
