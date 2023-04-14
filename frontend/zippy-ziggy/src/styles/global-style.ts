import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  html
  body {
    padding: 0;
    margin: 0;
    font-family: 'Red Hat Display', 'Pretendard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
      Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    overflow: hidden;
    font-weight: 500;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
