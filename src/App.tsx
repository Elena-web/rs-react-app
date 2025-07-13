import React from 'react';
import MainBlock from './components/MainBlock/MainBlock';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <MainBlock />
    </ErrorBoundary>
  );
};

export default App;
