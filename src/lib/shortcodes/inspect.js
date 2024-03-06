import util from "node:util";

/**
 * Prints debugging info using Node's util.inspecct()
 * @param {...*} args Items to inspect
 * @returns {string} An HTML string
 */
export default function inspect(...args) {
  return args
    .map((arg) => `<pre>${util.inspect(arg, { depth: 4 })}</pre>`)
    .join("\n");
}
