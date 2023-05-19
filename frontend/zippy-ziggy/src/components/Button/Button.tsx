import { StyledButton, ButtonProps } from './ButtonStyle';

/**
 * 버튼을 사용한다.
 * @param {ButtonType} buttonType 버튼 종류 default: 'fill'
 * @param {DefaultTheme.colors} color 색 default: 'blackColor90'
 * @param {boolean} isRound 라운드 여부
 * @param {string} width default: 100%
 * @param {string} height default: 3rem
 * @param {DefaultTheme.colors} fontColor 글자색 default: color
 */

const Button = ({
  children,
  color = 'primaryColor',
  fontColor,
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
      fontColor={fontColor}
      buttonType={buttonType}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
