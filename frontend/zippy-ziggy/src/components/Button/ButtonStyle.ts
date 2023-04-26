import { ButtonHTMLAttributes } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

type ButtonType = 'fill' | 'outline';

// 버튼 props 설정
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  buttonType?: ButtonType;
  margin?: string;
  padding?: string;
  width?: string;
  height?: string;
  isRound?: boolean;
  color?: keyof DefaultTheme['colors'];
  fontColor?: keyof DefaultTheme['colors'];
  display?: 'block' | 'inline-block' | 'inline-flex' | 'inline';
}

// 버튼이 'fill' | 'outline'일 경우 css
const buttonList = (buttonType, color, fontColor) => {
  if (fontColor) {
    if (buttonType === 'outline') {
      return css`
        border: 1px solid ${({ theme: { colors } }) => colors[color]};
        color: ${({ theme: { colors } }) => colors[fontColor]};
      `;
    }
    return css`
      background-color: ${({ theme: { colors } }) => colors[color]};
      color: ${({ theme: { colors } }) => colors[fontColor]};
    `;
  }
  if (buttonType === 'outline') {
    return css`
      border: 1px solid ${({ theme: { colors } }) => colors[color]};
      color: ${({ theme: { colors } }) => colors[color]};
    `;
  }
  return css`
    background-color: ${({ theme: { colors } }) => colors[color]};
    color: ${({ theme: { colors } }) => colors.whiteColor};
  `;
};

// 버튼 css
export const StyledButton = styled.button<ButtonProps>`
  display: ${({ display }) => display || 'block'};
  margin: ${({ margin }) => margin || 0};
  padding: ${({ padding }) => padding || 0};
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '3rem'};
  font-weight: 500;
  border-radius: ${({ isRound }) => (isRound ? '100px' : '4px')};
  font-size: ${({ theme: { fonts } }) => fonts.body_base};
  line-height: ${({ theme: { fonts } }) => fonts.body_base};
  cursor: pointer;
  transition: all 0.2s ease-out;
  box-shadow: ${({ theme: { shadows } }) => shadows.boxShadowSmall};
  &:hover {
    transform: translate(0, -0.4ex);
    box-shadow: ${({ theme: { shadows } }) => shadows.boxShadowLarge};
  }
  &:active {
    transform: scale(0.95);
  }

  ${({ buttonType, color, fontColor }) => buttonType && buttonList(buttonType, color, fontColor)}
`;
