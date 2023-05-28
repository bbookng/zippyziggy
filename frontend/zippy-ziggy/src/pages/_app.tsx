import useDarkMode from '@/hooks/useDarkMode';
import { media } from '@/styles/media';
import { darkTheme, lightTheme } from '@/styles/theme';
import type { AppProps } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import normalize from 'styled-normalize';
import '@/styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from '@/layout/AppLayout';
import store, { persistor } from '@/core/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'toastify-js/src/toastify.css';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Construction from './construction';

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
    box-shadow: ${({ theme }) => theme.shadows.boxShadowLarge};
    background-color: ${({ theme }) => theme.colors.whiteColor70};
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.blackColor50};
    color: ${({ theme }) => theme.colors.blackColor90}
  }

  input::placeholder,
  textarea::placeholder {
    color: ${({ theme }) => theme.colors.blackColor50}
  }
`;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

function App({ Component, pageProps }: AppProps) {
  const { colorTheme, toggleTheme } = useDarkMode();

  return (
    <Provider store={store}>
      <Head>
        <title>Zippy Ziggy - ChatGPT 활용 플랫폼</title>
        <meta name="description" content="team deun deun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="57x57" href="/images/favicons/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/images/favicons/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/images/favicons/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/images/favicons/apple-icon-76x76.png" />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/images/favicons/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/images/favicons/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/images/favicons/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/images/favicons/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicons/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/images/favicons/android-icon-192x192.png"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicons/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicons/favicon-16x16.png" />
        <link href="/favicon.ico" type="image/x-icon" rel="shortcut icon" />
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicons/favicon-32x32.png"
        />
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="96x96"
          href="/images/favicons/favicon-96x96.png"
        />
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicons/favicon-16x16.png"
        />
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:url" content="https://zippyziggy.kr/" />
        <meta property="og:title" content="지피지기- Chat-GPT 프롬프트 공유" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/zippy_metaimage.png" />
        <meta
          name="keywords"
          content="ZippyZiggy, 지피지기, ChatGPT, 지피티, 프롬프트, prompt, AI"
        />
        <meta
          property="og:description"
          content="지피티를 알면 질문도 잘할 수 있다! GPT 프롬프트 및 대화 공유사이트 ZippyZiggy"
        />
      </Head>
      <PersistGate persistor={persistor}>
        {/* loading={<div></div>}  */}
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={colorTheme === 'dark' ? darkTheme : lightTheme}>
            <GlobalStyle />
            <AppLayout toggleTheme={toggleTheme}>
              <Construction />
              <Component {...pageProps} />
              <ToastContainer
                limit={1}
                pauseOnFocusLoss={false}
                theme={colorTheme === 'dark' ? 'dark' : 'light'}
              />
            </AppLayout>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
