import { ButtonHTMLAttributes } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

type ButtonType = 'fill' | 'outline';

const buttonList = (buttonType, color) => {
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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  buttonType?: ButtonType;
  margin?: string;
  padding?: string;
  width?: string;
  height?: string;
  isRound?: boolean;
  color?: keyof DefaultTheme['colors'];
  display?: 'block' | 'inline-block' | 'inline-flex' | 'inline';
}

const StyledButton = styled.button<ButtonProps>`
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

  ${({ buttonType, color }) => buttonType && buttonList(buttonType, color)}
`;

/**
 * 타이틀을 사용한다.
 * @param {ButtonType} buttonType 버튼 종류 default: 'fill'
 * @param {DefaultTheme.colors} color 색 default: 'blackColor90'
 * @param {boolean} isRound 라운드 여부
 * @param {string} width default: 100%
 * @param {string} height default: 3rem
 */

const Button = ({
  children,
  color = 'primaryColor',
  buttonType = 'fill',
  isRound = false,
  width,
  height,
  margin,
  padding,
  display,
  ...rest
}: ButtonProps) => {
  return (
    <StyledButton
      type="button"
      margin={margin}
      padding={padding}
      width={width}
      height={height}
      isRound={isRound}
      display={display}
      color={color}
      buttonType={buttonType}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
