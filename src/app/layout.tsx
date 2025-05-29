import '../_shared/styles/global.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import ClientToastContainerProvider from '@/_shared/providers/client-toast-container.prov';
import ReactQueryProvider from '@/_shared/providers/ReactQueryProv';

config.autoAddCss = false;

const roboto = localFont({
  src: [
    {
      path: '../_shared/fonts/Roboto/Roboto-Variable.ttf',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../_shared/fonts/Roboto/Roboto-Italic-Variable.ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Life manager',
  description: 'Life manager app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <ReactQueryProvider>
        <body className={`${roboto.className} h-full antialiased`}>
          <ClientToastContainerProvider />
          {children}
        </body>
      </ReactQueryProvider>
    </html>
  );
}
