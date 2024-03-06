import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import rehypeParse from "rehype-parse";
import rehypeMinify from "rehype-preset-minify";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import UnoCSS from "unocss/vite";

import * as filters from "./src/lib/filters/index.js";
import * as shortcodes from "./src/lib/shortcodes/index.js";

/**
 * Transforms and minifes HTML with unified/rehype
 */
const transformIndexHtml = (() => {
  const parser = unified()
    .use(rehypeParse)
    .use(rehypeMinify)
    .use(rehypeStringify);
  /**
   * @param {string} value The HTML string to parse
   * @returns {string} A transformed and minified HTML string
   */
  return async (value) => String(await parser.process(value));
})();

/**
 * @param {import('@11ty/eleventy').UserConfig} eleventy The Eleventy config API
 * @returns {object} An Eleventy configuration object
 */
export default function eleventyConfig(eleventy) {
  const config = {
    dir: {
      data: "../lib/data",
      includes: "../lib/includes",
      input: "./src/pages",
      layouts: "../lib/layouts",
      output: "./dist",
    },
  };

  eleventy.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      build: {
        mode: "production",
        sourcemap: "true",
        rollupOptions: {
          output: {
            assetFileNames: "assets/css/main.[hash].css",
            chunkFileNames: "assets/js/[name].[hash].js",
            entryFileNames: "assets/js/main.[hash].js",
          },
        },
      },
      plugins: [{ name: "transform-html", transformIndexHtml }, UnoCSS()],
    },
  });

  eleventy.addPassthroughCopy("public");
  eleventy.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventy.addPassthroughCopy({ "src/assets/js": "assets/js" });

  Object.entries(filters).forEach(([name, fn]) => {
    eleventy.addFilter(name, fn);
  });

  Object.entries(shortcodes).forEach(([name, fn]) => {
    eleventy.addShortcode(name, fn);
  });

  eleventy.setFrontMatterParsingOptions({
    delimiters: ["<!---", "--->"],
  });

  return config;
}
