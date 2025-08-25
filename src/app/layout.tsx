'use client';

import React, { useEffect } from 'react';
import Navigation from './components/Navigation/Navigation';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { Provider } from 'react-redux';
import { store } from '../store/store';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <Navigation />
      <ErrorBoundary>{children}</ErrorBoundary>
    </>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider>
            <LayoutContent>{children}</LayoutContent>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
