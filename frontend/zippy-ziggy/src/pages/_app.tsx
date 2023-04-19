import useDarkMode from '@/hooks/useDarkMode';
import { media } from '@/styles/media';
import { darkTheme, lightTheme } from '@/styles/theme';
import type { AppProps } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import normalize from 'styled-normalize';
import '@/styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from '@/layout/AppLayout';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  *{
    transition: background-color 0.3s ease-in;
  }
  
  html {
    background-color: ${({ theme }) => theme?.colors?.bgColor};
    color: ${({ theme }) => theme?.colors?.blackColor90};
    /* min-width: var(--breakpoints-desktop); */
    
    ${media.small`
    min-width: unset;
    width: 100%;
    `}
  }

  body {
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    box-shadow: ${({ theme }) => theme?.shadows?.boxShadowLarge};
    /* background-color: ${({ theme }) => theme?.whiteColor70}; */
  }

  ::selection {
    background-color: ${({ theme }) => theme?.colors?.navColor};
    color: ${({ theme }) => theme?.colors?.blackColor30}
  }
`;

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const { colorTheme, toggleTheme } = useDarkMode();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={colorTheme === 'dark' ? darkTheme : lightTheme}>
        <GlobalStyle />
        <AppLayout toggleTheme={toggleTheme}>
          <Component {...pageProps} />
        </AppLayout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
