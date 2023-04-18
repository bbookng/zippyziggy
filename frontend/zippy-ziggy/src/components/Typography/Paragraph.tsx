import { media } from '@/styles/media';
import styled, { css, StyledComponent } from 'styled-components';

enum Size {
  small = '0.875rem',
  medium = '1rem',
  large = '1.25rem',
}
export interface ParagraphProps extends HTMLParagraphElement {
  size?: keyof typeof Size;
  color?: string;
}

const sizeStyles = css<{ size: keyof typeof Size }>`
  ${({ size }) => css`
    font-size: ${Size[size]};
  `}
`;

const colorStyles = css<{ color }>`
  ${({ theme, color }) => {
    const selected = theme?.[color];
    return css`
      color: ${selected};
    `;
  }}
`;

const StyledParagraph = styled.p<ParagraphProps>`
  ${sizeStyles}
  ${colorStyles}
`;

function Paragraph({ children, color, size, ...rest }: ParagraphProps) {
  return (
    <StyledParagraph size={size} color={color} {...rest}>
      {children}
    </StyledParagraph>
  );
}

export default Paragraph;
