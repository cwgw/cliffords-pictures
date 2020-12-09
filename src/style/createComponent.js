import styled from "@emotion/styled";
import memoize from "@emotion/memoize";
import isPropValid from "@emotion/is-prop-valid";
import { compose } from "styled-system";
import { css, get } from "theme-ui";

function createShouldForwardProp({ yes = [], no = [] }) {
  const y = new RegExp(`^(${yes.join("|")})$`);
  const n = new RegExp(`^(${no.join("|")})$`);
  return memoize((prop) => {
    return isPropValid(prop) ? true : y.test(prop) && !n.test(prop);
  });
}

export function createComponent(
  component = "div",
  {
    systemProps = [],
    baseStyles = {},
    forwardProps = [],
    themeKey = "variants",
    defaultVariant,
  } = {}
) {
  const shouldForwardProp = createShouldForwardProp({
    yes: forwardProps,
    no: systemProps.reduce((arr, p) => {
      return p.propNames ? arr.concat(p.propNames) : arr;
    }, []),
  });

  const style = ({
    __css = {},
    __themeKey = themeKey,
    sx = {},
    variant = defaultVariant,
    theme,
  }) => {
    return css({
      ...baseStyles,
      ...__css,
      ...(Array.isArray(variant)
        ? variant.reduce(
            (obj, v) => ({
              ...obj,
              ...get(theme, `${__themeKey}.${v}`, get(theme, v)),
            }),
            {}
          )
        : get(theme, `${__themeKey}.${variant}`, get(theme, variant))),
      ...sx,
    });
  };

  return styled(component, { shouldForwardProp })(
    compose(...systemProps),
    style
  );
}
