import { StyledButton, ButtonProps } from './Button.style';

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
