import { HTMLAttributes } from 'react';
import styled, { DefaultTheme } from 'styled-components';

export interface HrProps extends HTMLAttributes<HTMLHRElement> {
  margin?: string;
  padding?: string;
  width?: string;
  color?: keyof DefaultTheme['colors'];
  display?: 'block' | 'inline-block' | 'inline-flex' | 'inline';
}

// hr css
export const StyledHr = styled.hr<HrProps>`
  display: ${({ display }) => display || 'block'};
  margin: ${({ margin }) => margin || 0};
  padding: ${({ padding }) => padding || 0};
  width: ${({ width }) => width || '100%'};
  transition: all 0.2s ease-out;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
  border-top: ${({ theme: { colors }, color }) => `1px solid ${colors[color]}`};
`;
