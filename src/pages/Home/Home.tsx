import React from 'react';
import ErrorBoundary from '../../app/components/ErrorBoundary/ErrorBoundary';
import MainBlock from '../../app/components/MainBlock/MainBlock';

const Home: React.FC = () => {
  return (
    <ErrorBoundary>
      <MainBlock />
    </ErrorBoundary>
  );
};

export default Home;
