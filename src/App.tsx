import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from '@components/Navigation/Navigation';
import Home from '@pages/Home/Home';
import ItemDetail from '@components/ItemDetail/ItemDetail';
import About from '@pages/About/About';
import NotFound from '@pages/NotFound/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="details/:id" element={<ItemDetail />} />
        </Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
