import useDarkMode from '@/hooks/useDarkMode';
import { media } from '@/styles/media';
import { darkTheme, lightTheme } from '@/styles/theme';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import normalize from 'styled-normalize';
import '@/styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  *{
    transition: background-color 0.3s ease-in;
  }
  
  html {
    background-color: ${({ theme }) => theme?.bgColor};
    color: ${({ theme }) => theme?.textColor};
    min-width: var(--breakpoints-desktop);
    
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
    box-shadow: ${({ theme }) => theme?.boxShadowLarge};
  }
`;

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const { colorTheme, toggleTheme } = useDarkMode();

  return (
    <>
      <Head>
        <meta name="zippy-ziggy" content="width=device-width, initial-scale=1" />
        <title>지피지기</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={colorTheme === 'dark' ? darkTheme : lightTheme}>
          <button onClick={toggleTheme} type="button">
            테마 바꾸기
          </button>
          <GlobalStyle />
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
