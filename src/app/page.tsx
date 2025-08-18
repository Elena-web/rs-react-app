'use client';

import React from 'react';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import MainBlock from './components/MainBlock/MainBlock';

const HomePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <MainBlock />
    </ErrorBoundary>
  );
};

export default HomePage;
