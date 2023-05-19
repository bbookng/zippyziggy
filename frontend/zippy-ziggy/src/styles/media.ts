import { css, CSSObject, SimpleInterpolation } from 'styled-components';

type DeviceType = 'small' | 'large';

const sizes: Record<DeviceType, number> = {
  small: 1024,
  large: 1440,
};

const media = Object.entries(sizes).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [key]: (
      first: CSSObject | TemplateStringsArray,
      ...interpolations: SimpleInterpolation[]
    ) => css`
      @media (max-width: ${value}px) {
        ${css(first, ...interpolations)}
      }
    `,
  };
}, {}) as Record<DeviceType, any>;

export { media };
