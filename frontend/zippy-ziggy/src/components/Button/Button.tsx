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
  height: ${({ height }) => height || '48px'};
  font-weight: 500;
  border-radius: ${({ isRound }) => (isRound ? '100px' : '4px')};
  font-size: ${({ theme: { fonts } }) => fonts.body_base};
  line-height: ${({ theme: { fonts } }) => fonts.body_base};
  cursor: pointer;
  transition: all 0.1s ease-out;

  &:hover {
    animation: jelly 1s;
  }
  &:active {
    transform: scale(0.95);
  }

  @keyframes jelly {
    25% {
      transform: scale(0.95, 1.05);
      transform: translate(0, -0.2ex);
    }

    50% {
      transform: scale(1.05, 0.98);
      transform: translate(0, 0.2ex);
    }

    75% {
      transform: scale(0.97, 1.02);
    }
  }

  ${({ buttonType, color }) => buttonType && buttonList(buttonType, color)}
`;

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
