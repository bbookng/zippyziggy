import { HrProps, StyledHr } from './HrStyle';

/**
 * 타이틀을 사용한다.
 * @param {ButtonType} buttonType 버튼 종류 default: 'fill'
 * @param {DefaultTheme.colors} color 색 default: 'blackColor90'
 * @param {string} width default: 100%
 * @param {string} height default: 3rem
 * @param {DefaultTheme.colors} fontColor 글자색 default: color
 */

const Hr = ({ color = 'blackColor05', width, margin, padding, display, ...rest }: HrProps) => {
  return (
    <StyledHr
      margin={margin}
      padding={padding}
      width={width}
      display={display}
      color={color}
      {...rest}
    />
  );
};

export default Hr;
