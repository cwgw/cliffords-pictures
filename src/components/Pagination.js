import React from "react";

import { Box } from "./Box";
import { Button } from "./Button";

const defaultProps = {
  getPath: null,
  options: {
    ellipsis: "…",
    delta: 4,
  },
};

const style = {
  pagination: {
    display: "inline-flex",
    alignItems: "center",
    justifyItems: "center",
    listStyle: "none",
    mx: -2,
    p: 0,
  },
  pageItem: {
    mx: 2,
    "[aria-current]": {
      textDecoration: "underline",
    },
  },
  ellipsis: {
    display: "block",
    py: 0.5,
    px: 1,
  },
};

function Pagination({ next, prev, total, index, getPath, options }) {
  const items = getPagination(index, total, options).map((item) => {
    if (options.ellipsis && item === options.ellipsis) {
      return (
        <Box as="span" aria-hidden="true" sx={style.ellipsis} children={item} />
      );
    }

    const isCurrent = item === index;
    const path = getPath ? getPath(item) : item;
    const label = isCurrent
      ? `Current page: Page ${item}`
      : `Go to page ${item}`;

    return (
      <Button
        variant="plain"
        to={path}
        children={item}
        aria-label={label}
        {...(isCurrent ? { "aria-current": "page" } : {})}
      />
    );
  });

  return (
    <Box
      as="nav"
      role="navigation"
      aria-label="Pagination"
      sx={style.pagination}
    >
      <Button
        to={prev && (getPath ? getPath(prev) : prev)}
        variant="plain"
        sx={style.pageItem}
        disabled={!!!prev}
        children={"←"}
      />
      <Box as="ul" sx={style.pagination}>
        {items.map((item, i) => (
          <Box key={i} as="li" sx={style.pageItem} children={item} />
        ))}
      </Box>
      <Button
        to={next && (getPath ? getPath(next) : next)}
        variant="plain"
        sx={style.pageItem}
        disabled={!!!next}
        children={"→"}
      />
    </Box>
  );
}

Pagination.defaultProps = defaultProps;

export { Pagination };

function getPagination(current, length, options) {
  const { delta, ellipsis } = { ellipsis: "…", delta: 4, ...(options || {}) };

  function withEllipsis(value, pair) {
    return pages.length + 1 !== length ? pair : [value];
  }

  function getRange(start, end) {
    return Array(end - start + 1)
      .fill()
      .map((v, i) => i + start);
  }

  const range = {
    start: Math.round(current - delta / 2),
    end: Math.round(current + delta / 2),
  };

  if (range.start - 1 === 1 || range.end + 1 === length) {
    range.start += 1;
    range.end += 1;
  }

  let pages;
  if (current > delta) {
    pages = getRange(
      Math.min(range.start, length - delta),
      Math.min(range.end, length)
    );
  } else {
    pages = getRange(1, Math.min(length, delta + 1));
  }

  if (pages[0] !== 1) {
    pages = withEllipsis(1, [1, ellipsis]).concat(pages);
  }

  if (pages[pages.length - 1] < length) {
    pages = pages.concat(withEllipsis(length, [ellipsis, length]));
  }

  return pages;
}
