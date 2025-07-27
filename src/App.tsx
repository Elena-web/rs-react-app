import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainBlock from './components/MainBlock/MainBlock';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Navigation from './components/Navigation/Navigation';

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Navigation />
        <MainBlock />
      </ErrorBoundary>
    </Router>
  );
};

export default App;
