import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from 'emotion-server';

export default class MyDocument extends Document {
  /* Resolution order
   *
   * On the server:
   * 1. app.getInitialProps
   * 2. page.getInitialProps
   * 3. document.getInitialProps
   * 4. app.render
   * 5. page.render
   * 6. document.render
   *
   * On the server with error:
   * 1. document.getInitialProps
   * 2. app.render
   * 3. page.render
   * 4. document.render
   *
   * On the client
   * 1. app.getInitialProps
   * 2. page.getInitialProps
   * 3. app.render
   * 4. page.render
   */

  static getInitialProps({ renderPage }) {
    const page = renderPage();
    const styles = extractCritical(page.html);
    return { ...page, ...styles };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <style
            data-emotion-css={this.props.ids.join(' ')}
            dangerouslySetInnerHTML={{ __html: this.props.css }}
          />

          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-16x16.png"
            sizes="16x16"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-32x32.png"
            sizes="32x32"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-96x96.png"
            sizes="96x96"
          />

          {/* Import CSS for nprogress */}
          <link rel="stylesheet" type="text/css" href="/css/nprogress.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
