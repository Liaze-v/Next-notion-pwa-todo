import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png"></link>
          <meta name="theme-color" content="#fff" /> */}
          <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/assets/256.png" />
            <meta name="apple-mobile-web-app-status-bar" content="white" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <meta name="theme-color" content="white" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;