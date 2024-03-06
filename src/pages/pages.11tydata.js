import { titleCase } from "../lib/utils/helpers.js";

export default {
  layout: "page",
  eleventyComputed: {
    title: ({ page, title }) => {
      if (!title) {
        const [slug] = page.url.split("/").filter(Boolean).reverse();
        return slug ? titleCase(slug) : "";
      }
      return title;
    },
  },
};
