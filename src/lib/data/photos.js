import fs from "node:fs/promises";

import { glob } from "glob";

/**
 *
 * @param root0
 * @param root0.eleventy
 */
export default async function photos({ eleventy }) {
  const files = await glob("content/photos/*.json", {
    absolute: true,
    cwd: eleventy.env.root,
  });
  const items = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file, { encoding: "utf-8" });
      const data = JSON.parse(content);
      return data;
    }),
  );
  // console.log(items);
  items.sort((a, b) => a.id - b.id);
  return items;
}
