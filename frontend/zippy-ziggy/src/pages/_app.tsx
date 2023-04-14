import { GlobalStyle } from '@/styles/global-style';
import type { AppProps } from 'next/app';
import Head from 'next/head';
// import { ThemeProvider } from 'styled-components';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='zippy-ziggy' content='width=device-width, initial-scale=1' />
        <title>지피지기</title>
      </Head>
      <GlobalStyle />
      {/* <ThemeProvider theme={''}> */}
      <Component {...pageProps} />
      {/* </ThemeProvider> */}
    </>
  );
}
