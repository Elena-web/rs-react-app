'use client';

import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import MainBlock from '../components/MainBlock/MainBlock';

export default function Home() {
  return (
    <ErrorBoundary>
      <MainBlock />
    </ErrorBoundary>
  );
}
