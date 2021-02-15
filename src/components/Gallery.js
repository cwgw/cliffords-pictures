import React from "react";
import GatsbyImage from "gatsby-image";
import { css } from "theme-ui";

import { createThemedElement } from "../style";
import { useInfiniteScroll } from "../context/app";
import { Box } from "./Box";
import { Button } from "./Button";
import { Link } from "./Link";
import { Pagination } from "./Pagination";
import { VisuallyHidden } from "./VisuallyHidden";

const style = {
  grid: {
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
    my: "xl",
    mx: "auto",
    p: [3, 4],
    boxSizing: "content-box",
  },
  gridItem: {
    position: "relative",
    boxShadow: "slight",
  },
  footer: {
    maxWidth: "768px",
    my: "lg",
    mx: "auto",
    px: "md",
    textAlign: "center",
  },
};

const Gallery = ({ data, pageContext }) => {
  const { enable, hasMore, isEnabled, photos, ref } = useInfiniteScroll();
  const [layout, setLayout] = React.useState("grid");

  // const layoutControls = (
  //   <Box>
  //     <Button onClick={() => { setLayout(s => s === "grid" ? "column" : "grid")}} >
  //       Toggle layout
  //     </Button>
  //   </Box>
  // );

  const layoutControls = null;

  if (photos && photos.length > 0) {
    let footer = <Button onClick={enable}>Load more</Button>;

    if (isEnabled) {
      if (hasMore()) {
        footer = <span ref={ref}>Loading...</span>;
      } else {
        footer = <span ref={ref}>You've reached the end!</span>;
      }
    }

    return (
      <React.Fragment>
        {layoutControls}
        <Grid items={photos} layout={layout} />
        <Box sx={style.footer}>{footer}</Box>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid items={data.allPhoto.edges} layout={layout} />
      <Box sx={style.footer}>
        <Pagination
          getPath={(i) => `/photos/${i}`}
          {...pageContext.pagination}
        />
      </Box>
    </React.Fragment>
  );
};

export { Gallery };

const layoutStyles = {
  grid: {
    // gridTemplateColumns: [
    //   "repeat(4, minmax(0px, 96px))",
    //   "repeat(4, minmax(0px, 144px))",
    //   "repeat(4, minmax(0px, 216px))",
    //   "repeat(4, minmax(0px, 288px))"
    // ],
    gridTemplateColumns: [
      "repeat(3, minmax(0px, 384px))",
      "repeat(4, minmax(0px, 384px))",
    ],
    gridGap: [2, 3, 3, 4],
  },
  column: {
    gridTemplateColumns: "repeat(1, minmax(0px, 576px))",
    gridGap: [3, 4],
  },
};

const GridWrapper = createThemedElement("div", {}, (props) => {
  return css(layoutStyles[props.layout] || layoutStyles["grid"]);
});

function Grid({ items, layout }) {
  const linkState = { noScroll: true, modal: true };
  return (
    <GridWrapper sx={style.grid} layout={layout}>
      {items.map((item) => {
        const { id, image, slug, ref } = item.node || item;
        return (
          <Box key={id} ref={ref} sx={style.gridItem}>
            <GatsbyImage {...image} />
            <Link to={slug} state={linkState} variant="cover">
              <VisuallyHidden>View photo</VisuallyHidden>
            </Link>
          </Box>
        );
      })}
    </GridWrapper>
  );
}
