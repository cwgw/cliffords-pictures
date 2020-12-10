import React from "react";
import PropTypes from "prop-types";
import GatsbyImage from "gatsby-image";

import { space } from "../../style";
import { Box } from "../Box";
import { VisuallyHidden } from "../VisuallyHidden";
import { Link } from "../Link";

const propTypes = {
  children: PropTypes.node,
  columnGap: PropTypes.string,
  items: PropTypes.array,
  itemWidth: PropTypes.string,
  rowGap: PropTypes.string,
};

const defaultProps = {
  children: null,
  columnGap: "lg",
  items: [],
  itemWidth: "384px",
  rowGap: "lg",
};

const List = (props) => (
  <Box
    as="ul"
    __css={{
      display: "grid",
      justifyContent: "center",
      alignItems: "center",
      padding: "sm",
      marginY: "xl",
      marginX: "auto",
      boxSizing: "content-box",
      listStyle: "none",
    }}
    {...props}
  />
);

const Grid = ({ columnGap, items, itemWidth, rowGap }) => (
  <List
    sx={{
      gridColumnGap: columnGap,
      gridRowGap: rowGap,
      gridTemplateColumns: `repeat(auto-fill, minmax(0, ${itemWidth}))`,
      maxWidth: (t) => `calc(${itemWidth} * 3 + ${space(columnGap)(t)} * 2)`,
    }}
  >
    {items.map(({ id, image, fields }) => (
      <Box key={id} as="li" sx={{ position: "relative", boxShadow: "slight" }}>
        <GatsbyImage {...image} />
        <Link to={fields.slug} variant="spanParent" inModal>
          <VisuallyHidden>View photo</VisuallyHidden>
        </Link>
      </Box>
    ))}
  </List>
);

Grid.propTypes = propTypes;

Grid.defaultProps = defaultProps;

export { Grid };
