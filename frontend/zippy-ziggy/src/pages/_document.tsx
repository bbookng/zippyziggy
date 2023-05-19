import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            (function(j,ennifer) {
              j['dmndata']=[];j['jenniferFront']=function(args){window.dmndata.push(args)};
              j['dmnaid']=ennifer;j['dmnatime']=new Date();j['dmnanocookie']=false;j['dmnajennifer']='JENNIFER_FRONT@INTG';
            }(window, '8c18481d'));
            jenniferFront({
              set: {
                  filter: {
                      localhost: true
                  }
              }
          });
          `,
            }}
          />
          <script async src="https://d-collect.jennifersoft.com/8c18481d/demian.js" />
        </Head>
        <body>
          <Main />
          <div id="portal-root" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
