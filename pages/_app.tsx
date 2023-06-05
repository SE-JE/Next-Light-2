import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/general.css';
import type { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import { Poppins } from '@next/font/google';
config.autoAddCss = false;

const font = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <>
      <main className={font.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
