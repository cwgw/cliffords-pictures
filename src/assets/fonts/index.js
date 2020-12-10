import * as amstelvar from "./amstelvar";

const fonts = [amstelvar].reduce((obj, { font }) => {
  obj = [...obj, ...(font || [])];
  return obj;
}, []);

const fontFaceDeclarations = fonts.map(({ family, src, descriptors }) => ({
  fontFamily: family,
  src: src
    .map(({ url, format }) => `url(${url}) format('${format}')`)
    .join(", "),
  fontWeight: descriptors.weight,
  fontStyle: descriptors.style,
  fontStretch: descriptors.stretch,
  fontDisplay: "swap",
}));

export { fontFaceDeclarations, fonts };
