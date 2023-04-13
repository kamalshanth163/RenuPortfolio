import React from 'react';
import ImageGallery from './components/ImageGallery';
import 'bootstrap/dist/css/bootstrap.css';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="main">
      <Routes>
        <Route exact path="/" element={<ImageGallery/>}/>
      </Routes>
    </div>
  );
}

export default App;