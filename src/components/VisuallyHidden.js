import React from "react";

import { Box } from "./Box";

const VisuallyHidden = (props) => (
  <Box as="span" variant="visuallyHidden" {...props} />
);

export { VisuallyHidden };
