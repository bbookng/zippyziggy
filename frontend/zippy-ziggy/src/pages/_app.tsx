import useDarkMode from '@/hooks/useDarkMode';
import { media } from '@/styles/media';
import { darkTheme, lightTheme } from '@/styles/theme';
import type { AppProps } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import normalize from 'styled-normalize';
import '@/styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from '@/layout/AppLayout';
import store, { persistor, wrapper } from '@/core/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'toastify-js/src/toastify.css';

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

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  const { colorTheme, toggleTheme } = useDarkMode();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {/* loading={<div></div>}  */}
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={colorTheme === 'dark' ? darkTheme : lightTheme}>
            <GlobalStyle />
            <AppLayout toggleTheme={toggleTheme}>
              <Component {...pageProps} />
            </AppLayout>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default wrapper.withRedux(App);
