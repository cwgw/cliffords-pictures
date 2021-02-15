import styled from "@emotion/styled";
import memoize from "@emotion/memoize";
import isPropValid from "@emotion/is-prop-valid";
import { compose } from "styled-system";
import { css, get } from "theme-ui";
import merge from "deepmerge";

function createShouldForwardProp({ yes = [], no = [] }) {
  const y = new RegExp(`^(${yes.join("|")})$`);
  const n = new RegExp(`^(${no.join("|")})$`);
  return memoize((prop) => {
    return isPropValid(prop) ? true : y.test(prop) && !n.test(prop);
  });
}

function mergeVariants({ variant, theme, __themeKey }) {
  const variants = Array.isArray(variant) ? variant : [variant];
  return variants.reduce((memo, v) => {
    return merge(memo, get(theme, `${__themeKey}.${v}`, get(theme, v)) || {});
  }, {});
}

function createThemedElement(
  component = "div",
  {
    systemProps = [],
    baseStyles = {},
    forwardProps = [],
    themeKey = "variants",
    defaultVariant,
  } = {},
  ...additionalStyleFunctions
) {
  const shouldForwardProp = createShouldForwardProp({
    yes: forwardProps,
    no: systemProps.reduce((memo, p) => {
      return p.propNames ? memo.concat(p.propNames) : memo;
    }, []),
  });

  const style = (props) => {
    const {
      __css = {},
      __themeKey = themeKey,
      sx = {},
      variant = defaultVariant,
      theme,
    } = props;
    const variants = mergeVariants({ variant, theme, __themeKey });
    return css(merge.all([baseStyles, __css, variants, sx]));
  };

  return styled(component, { shouldForwardProp })(
    compose(...systemProps),
    style,
    ...additionalStyleFunctions
  );
}

export { createThemedElement };
