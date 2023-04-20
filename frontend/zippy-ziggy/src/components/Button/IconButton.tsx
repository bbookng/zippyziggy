import styled, { css } from 'styled-components';
import GoogleIcon from '@/assets/svgs/google.svg';
import { ButtonProps } from './Button.style';

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

export const StyledIcon = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({ margin }) => margin || 0};
  padding: 0px 10px;
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
  .flex1 {
    flex: 1;
  }
`;
/**
 * 타이틀을 사용한다.
 * @param {ButtonType} buttonType 버튼 종류 default: 'fill'
 * @param {DefaultTheme.colors} color 색 default: 'blackColor90'
 * @param {boolean} isRound 라운드 여부
 * @param {string} width default: 100%
 * @param {string} height default: 3rem
 */

const IconButton = ({
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
    <StyledIcon
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
    </StyledIcon>
  );
};

export default IconButton;
