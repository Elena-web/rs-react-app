import React from 'react';
import { Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import MainBlockWrapper from './components/MainBlockWrapper/MainBlockWrapper';

export default function HomePage() {
  return (
	<Suspense fallback={<div>Loading...</div>}>
    <ErrorBoundary>
      <MainBlockWrapper />
    </ErrorBoundary>
	</Suspense>
  );
}
