import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import { Box } from "./Box";
import { Link } from "./Link";

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

  return (
    <Box
      as="header"
      sx={{
        margin: "0 auto 4rem",
        padding: "1rem 0 0",
        textAlign: "center",
        borderTop: "1px solid transparent",
        borderBottom: "1px solid transparent",
      }}
    >
      {title && (
        <Link
          to="/"
          sx={{
            display: "inline-block",
            fontSize: 8,
            fontFamily: "serif",
            fontVariationSettings:
              '"wght" 300, "opsz" 50, "XOPQ" 120, "PWGT" 150',
            textDecoration: "none",
            py: "xs",
            px: "sm",
          }}
          children={title}
        />
      )}
    </Box>
  );
};

export { Header };
