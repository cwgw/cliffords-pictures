#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

import { glob } from "glob";

const cwd = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @callback Enqueable
 * @returns {Promise}
 */

class Queue {
  /**
   * Enumerated queue states
   * @readonly
   * @enum
   * @property {string} Idle IDLE
   * @property {string} Running RUNNING
   * @property {string} Finished FINISHED
   * @property {string} Error ERROR
   */
  static States = /* const */ {
    Idle: "IDLE",
    Running: "RUNNING",
    Finished: "FINISHED",
    Error: "ERROR",
  };

  /**
   * A map of pending entries
   * @type {Set<symbol>}
   */
  #pending;

  /**
   * An array of enqueued entries
   * @type {Array<Enqueable | Enqueable[]>}
   */
  #queue;

  /**
   * The maximum number of items allowed to be pending concurrently
   * @type {number}
   */
  limit;

  /**
   * A promise that resolves when all items in the queue have settled
   * @type {Promise<void>}
   */
  finished;

  /**
   * The current state of the queue
   * @type {string}
   */
  state;

  /**
   * @param {object} options Queue options
   * @param {number} options.limit The maximum number of items allowed to be pending concurrently
   */
  constructor(options = {}) {
    this.limit = options.limit ?? 8;
    this.#pending = new Set();
    this.#queue = [];
    this.state = Queue.States.Idle;
    this.finished = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  #resolve = () => {};

  #reject = () => {};

  /**
   * Calls enqueued functions until the
   */
  #next() {
    if (this.state === Queue.States.Running) {
      if (this.#queue.length === 0 && this.#pending.size === 0) {
        this.state = Queue.States.Finished;
        this.#resolve();
      } else {
        while (this.#queue.length > 0 && this.#pending.size < this.limit) {
          const key = Symbol();
          const task = this.#queue.shift();
          this.#pending.add(key);
          task()
            .then(() => {
              this.#pending.delete(key);
              this.#next();
            })
            .catch((error) => {
              this.#pending.delete(key);
              this.state = Queue.States.Error;
              this.#reject(error);
            });
        }
      }
    }
  }

  /**
   * Adds an item to the queue
   * @param {...Enqueable} items A function that returns a promise to be enqueued.
   */
  push(...items) {
    items.forEach((task) => {
      if (typeof task === "function") {
        this.#queue.push(task);
      }
    });
    this.#next();
  }

  /**
   * Kicks off the queue
   */
  start() {
    this.state = Queue.States.Running;
    this.#next();
  }
}

(async function main() {
  const queue = new Queue({ limit: 16 });
  const files = await glob("content/**/data.json", { absolute: true });
  queue.push(...files.map(getTransform));
  queue.start();
  await queue.finished;
})();

/**
 * @param {string} file
 * @returns {Enqueable}
 */
function getTransform(file) {
  return async () => {
    const content = await fs.readFile(file, { encoding: "utf-8" });
    const data = JSON.parse(content);
    const dir = path.dirname(file);
    const dest = path.join(cwd, "public/assets/images", data.id);
    const root = path.join("/assets/images", data.id);
    const images = await glob("*.webp", { absolute: false, cwd: dir });
    delete data.date;
    delete data.faces;
    delete data.people;
    delete data.location;
    data.type = "image/webp";
    data.files = images
      .map((image) => {
        const width = parseInt(path.parse(image).name);
        const height = Math.round(width / data.aspectRatio);
        const src = path.join(root, image);
        return { width, height, src };
      })
      .sort((a, b) => a.width - b.width);
    await Promise.all([
      writeFile(path.join(cwd, "content/photos", `${data.id}.json`), data),
      ...images.map((image) =>
        copyFile(path.join(dir, image), path.join(dest, image)),
      ),
    ]);
  };
}

/**
 *
 * @param file
 * @param data
 */
async function writeFile(file, data) {
  ensureDir(file);
  const content =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);
  await fs.writeFile(file, content);
}

/**
 *
 * @param file
 * @param data
 * @param from
 * @param to
 */
async function copyFile(from, to) {
  await ensureDir(to);
  await fs.copyFile(from, to);
}

/**
 *
 * @param file
 */
async function ensureDir(file) {
  let { ext, dir } = path.parse(file);
  dir = ext ? dir : file;
  try {
    await fs.stat(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }
}
