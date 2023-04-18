// import { media } from '@/styles/media';
import { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

enum Size {
  small = '0.875rem',
  medium = '1rem',
  large = '1.25rem',
}
export interface ParagraphProps extends HTMLAttributes<HTMLHeadingElement> {
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

function Paragraph({ children, size, color, ...rest }: ParagraphProps) {
  return (
    <StyledParagraph size={size} color={color} {...rest}>
      {children}
    </StyledParagraph>
  );
}

export default Paragraph;
