import React from "react";
import PropTypes from "prop-types";

import { Button } from "../Button";
import { Box } from "../Box";

const propTypes = {
  nextPage: PropTypes.string,
  prevPage: PropTypes.string,
};

const defaultProps = {
  nextPage: null,
  prevPage: null,
};

const Nav = (props) => (
  <Box
    as="nav"
    sx={{
      marginY: "lg",
      marginX: "auto",
      paddingX: "md",
      maxWidth: "768px",
      boxSizing: "content-box",
    }}
    {...props}
  />
);

const List = (props) => (
  <Box
    as="ul"
    sx={{
      padding: 0,
      margin: 0,
      listStyle: "none",
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gridGap: "md",
    }}
    {...props}
  />
);

const Pagination = ({ nextPage, prevPage }) => {
  const navItems = [
    [prevPage, { justifySelf: "end" }, `←`],
    [nextPage, { justifySelf: "start", gridColumn: 2 }, `→`],
  ];

  return (
    <Nav>
      <List>
        {navItems.map(([slug, style, text]) =>
          slug ? (
            <Box as="li" key={slug} sx={{ display: "inline-block", ...style }}>
              <Button to={slug} disabled={!!!slug}>
                {text}
              </Button>
            </Box>
          ) : null
        )}
      </List>
    </Nav>
  );
};

Pagination.propTypes = propTypes;

Pagination.defaultProps = defaultProps;

export { Pagination };
