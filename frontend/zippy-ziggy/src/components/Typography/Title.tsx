import { HTMLAttributes } from 'react';
import { media } from '@/styles/media';
import styled, { css, DefaultTheme } from 'styled-components';

type SizeType = '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'base' | 'sm';

const sizeList = {
  '5xl': css`
    font-size: ${({ theme: { fonts } }) => fonts.desktop_h_5xl};
    line-height: ${({ theme: { lineHeights } }) => lineHeights.desktop_h_5xl};
  `,
  '4xl': css`
    font-size: ${({ theme: { fonts } }) => fonts.desktop_h_4xl};
    line-height: ${({ theme: { lineHeights } }) => lineHeights.desktop_h_4xl};
    ${media.small`
      font-size: ${({ theme: { fonts } }) => fonts.mobile_h_4xl};
      line-height: ${({ theme: { lineHeights } }) => lineHeights.mobile_h_4xl};
    `}
  `,

  '3xl': css`
    font-size: ${({ theme: { fonts } }) => fonts.mobile_h_3xl};
    line-height: ${({ theme: { lineHeights } }) => lineHeights.desktop_h_3xl};
    ${media.small`
      font-size: ${({ theme: { fonts } }) => fonts.mobile_h_3xl};
      line-height: ${({ theme: { lineHeights } }) => lineHeights.mobile_h_3xl};
    `}
  `,

  '2xl': css`
    font-size: ${({ theme: { fonts } }) => fonts.desktop_h_2xl};
    line-height: ${({ theme: { lineHeights } }) => lineHeights.desktop_h_2xl};
    ${media.small`
      font-size: ${({ theme: { fonts } }) => fonts.mobile_h_2xl};
      line-height: ${({ theme: { lineHeights } }) => lineHeights.mobile_h_2xl};
    `}
  `,

  xl: css`
    font-size: ${({ theme: { fonts } }) => fonts.desktop_h_xl};
    line-height: ${({ theme: { lineHeights } }) => lineHeights.desktop_h_xl};
    ${media.small`
      font-size: ${({ theme: { fonts } }) => fonts.mobile_h_xl};
      line-height: ${({ theme: { lineHeights } }) => lineHeights.mobile_h_xl};
    `}
  `,

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
  text-align: ${({ textAlign }) => textAlign || 'left'};
  margin: ${({ margin }) => margin || 0};
  padding: ${({ padding }) => padding || 0};
  font-weight: ${({ fontWeight }) => fontWeight || '600'};
  // letter-spacing: -0.02em;
  color: ${({ color, theme: { colors } }) => colors[color] || colors.blackColor90};

  ${({ sizeType }) => sizeType && sizeList[sizeType]}
`;

/**
 * <h1>을 사용한다.
 * @param {SizeType} sizeType 타이틀 크기 default: '3xl'
 * @param {DefaultTheme.colors} color 색 default: 'blackColor90'
 * @param {string} margin
 * @param {string} padding
 */
const Title = ({
  children,
  sizeType = '3xl',
  margin,
  padding,
  fontWeight,
  display,
  textAlign,
  ...rest
}: TitleProps) => {
  return (
    <StyledTitle
      sizeType={sizeType}
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
