import fs from "node:fs/promises";
import path from "node:path";

import merge from "lodash.merge";
import { createServer as createViteServer, build as buildVite } from "vite";

const DEFAULT_OPTIONS = {
  tempFolderName: ".11ty-vite",
  viteOptions: {
    resolve: {
      alias: {
        // Allow references to `node_modules` directly for bundling.
        "/node_modules": path.resolve(".", "node_modules"),
        // Note that bare module specifiers are also supported
      },
    },
    clearScreen: false,
    appType: "mpa",
    server: {
      mode: "development",
      middlewareMode: true,
    },
    build: {
      mode: "production",
      rollupOptions: {}, // we use this to inject input for MPA build below
    },
  },
};

export default class EleventyVite {
  constructor(outputDir, pluginOptions = {}) {
    this.outputDir = outputDir;
    this.options = merge({}, DEFAULT_OPTIONS, pluginOptions);
  }

  async getServerMiddleware() {
    let viteOptions = merge({}, this.options.viteOptions);
    viteOptions.root = this.outputDir;

    let vite = await createViteServer(viteOptions);

    return vite.middlewares;
  }

  getIgnoreDirectory() {
    return path.join(this.options.tempFolderName, "**");
  }

  async runBuild(input) {
    let tmp = path.resolve(".", this.options.tempFolderName);

    await fs.mkdir(tmp, { recursive: true });
    await fs.rename(this.outputDir, tmp);

    try {
      let viteOptions = merge({}, this.options.viteOptions);
      viteOptions.root = tmp;

      viteOptions.build.rollupOptions.input = input
        .filter((entry) => !!entry.outputPath) // filter out `false` serverless routes
        .filter((entry) => (entry.outputPath || "").endsWith(".html")) // only html output
        .map((entry) => {
          if (!entry.outputPath.startsWith(this.outputDir + path.sep)) {
            throw new Error(
              `Unexpected output path (was not in output directory ${this.outputDir}): ${entry.outputPath}`,
            );
          }

          return path.resolve(
            tmp,
            entry.outputPath.substr(this.outputDir.length + path.sep.length),
          );
        });

      viteOptions.build.outDir = path.resolve(".", this.outputDir);

      await buildVite(viteOptions);
    } catch (e) {
      console.warn(
        `[11ty] Encountered a Vite build error, restoring original Eleventy output to ${this.outputDir}`,
        e,
      );
      await fs.rename(tmp, this.outputDir);
      throw e;
    } finally {
      // remove the tmp dir
      await fs.rm(tmp, { recursive: true });
    }
  }
}
