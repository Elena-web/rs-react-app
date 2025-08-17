'use client';

import './styles.css';
import { store } from '../store/store';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Cats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Cats" />
      </Head>
      <body>
        <ErrorBoundary>
          <ThemeProvider>
            <Provider store={store}>{children}</Provider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
