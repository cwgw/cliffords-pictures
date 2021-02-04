import React from "react";
import GatsbyImage from "gatsby-image";

import { useInfiniteScroll } from "../context/photos";
import { Box } from "./Box";
import { Button } from "./Button";
import { Link } from "./Link";
import { Pagination } from "./Pagination";
import { VisuallyHidden } from "./VisuallyHidden";

const style = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(0, 384px))",
    gridColumnGap: "lg",
    gridRowGap: "lg",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: (t) => `calc(384px * 3 + ${t.space["lg"]}px * 2)`,
    my: "xl",
    mx: "auto",
    p: "sm",
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
        <Grid items={photos} />
        <Box sx={style.footer}>{footer}</Box>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid items={data.allPhoto.edges} />
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

function Grid({ items }) {
  const linkState = { noScroll: true, modal: true };
  return (
    <Box sx={style.grid}>
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
    </Box>
  );
}
