import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import MainBlock from '../../components/MainBlock/MainBlock';

const Home: React.FC = () => {
  return (
    <ErrorBoundary>
      <MainBlock />
    </ErrorBoundary>
  );
};

export default Home;
