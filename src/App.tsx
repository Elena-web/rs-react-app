import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Home from './pages/Home/Home';
import ItemDetail from './components/ItemDetail/ItemDetail';
import About from './pages/About/About';
import NotFound from './pages/NotFound/NotFound';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { useTheme } from './context/ThemeContext';

const App: React.FC = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);
  return (
    <Router basename="/rs-react-app/">
      <Navigation />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="details/:id" element={<ItemDetail />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
