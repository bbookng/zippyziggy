import { HTMLAttributes } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

type SizeType = 'lg' | 'sm' | 'xm' | 'base';

const sizeList = {
  lg: css`
    font-size: 1rem;
    line-height: 1rem;
  `,
  base: css`
    font-size: 1rem;
    line-height: 1rem;
  `,

  sm: css`
    font-size: 1rem;
    line-height: 1rem;
  `,

  xm: css`
    font-size: 1rem;
    line-height: 1rem;
  `,
};

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  sizeType?: SizeType;
  children?: React.ReactNode;
  margin?: string;
  padding?: string;
  fontWeight?: string;
  color?: keyof DefaultTheme['colors'];
  display?: 'block' | 'inline-block' | 'inline-flex' | 'inline';
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'inherit';
}

const StyledTitle = styled.h1<TitleProps>`
  display: ${({ display }) => display || 'block'};
  text-align: ${({ textAlign }) => textAlign || 'center'};
  margin: ${({ margin }) => margin || 0};
  padding: ${({ padding }) => padding || 0};
  font-weight: ${({ fontWeight }) => fontWeight || '700'};
  letter-spacing: -0.02em;
  color: ${({ color, theme: { colors } }) => colors[color] || colors.successColor};

  ${({ sizeType }) => sizeType && sizeList[sizeType]}
`;

const Title = ({
  children,
  margin,
  padding,
  fontWeight,
  display,
  textAlign,
  ...rest
}: TitleProps) => {
  return (
    <StyledTitle
      margin={margin}
      padding={padding}
      fontWeight={fontWeight}
      display={display}
      textAlign={textAlign}
      {...rest}
    >
      {children}
    </StyledTitle>
  );
};

export default Title;
