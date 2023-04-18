import { HTMLAttributes } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

type SizeType = 'lg' | 'base' | 'sm' | 'xm';

const sizeList = {
  lg: css`
    font-size: ${({ theme: { fonts } }) => fonts.body_lg};
    line-height: ${({ theme: { lineHeights } }) => lineHeights.body_lg};
  `,
  base: css`
    font-size: ${({ theme: { fonts } }) => fonts.body_base};
    line-height: ${({ theme: { lineHeights } }) => lineHeights.body_base};
  `,

  sm: css`
    font-size: ${({ theme: { fonts } }) => fonts.body_sm};
    line-height: ${({ theme: { lineHeights } }) => lineHeights.body_sm};
  `,

  xm: css`
    font-size: ${({ theme: { fonts } }) => fonts.body_xm};
    line-height: ${({ theme: { lineHeights } }) => lineHeights.body_xm};
  `,
};

export interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  sizeType?: SizeType;
  margin?: string;
  padding?: string;
  fontWeight?: string;
  color?: keyof DefaultTheme['colors'];
  display?: 'block' | 'inline-block' | 'inline-flex' | 'inline';
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'inherit';
}

const StyledParagraph = styled.h1<ParagraphProps>`
  display: ${({ display }) => display || 'block'};
  text-align: ${({ textAlign }) => textAlign || 'left'};
  margin: ${({ margin }) => margin || 0};
  padding: ${({ padding }) => padding || 0};
  font-weight: ${({ fontWeight }) => fontWeight || '400'};
  // letter-spacing: -0.02em;
  color: ${({ color, theme: { colors } }) => colors[color] || colors.blackColor70};

  ${({ sizeType }) => sizeType && sizeList[sizeType]}
`;

const Paragraph = ({
  children,
  sizeType = 'base',
  color = 'blackColor70',
  margin,
  padding,
  fontWeight,
  display,
  textAlign,
  ...rest
}: ParagraphProps) => {
  return (
    <StyledParagraph
      margin={margin}
      padding={padding}
      color={color}
      fontWeight={fontWeight}
      display={display}
      textAlign={textAlign}
      sizeType={sizeType}
      {...rest}
    >
      {children}
    </StyledParagraph>
  );
};

export default Paragraph;
