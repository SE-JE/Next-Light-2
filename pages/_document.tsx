import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title>{process.env.NEXT_PUBLIC_APP_NAME || ''}</title>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
