import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResponsiveAppBar from './ResponsiveAppBar';
import EspCameraFeed from './EspCameraFeed';
import EspCameraControl from './EspCameraControl';
import PhotoGallery from './PhotoGallery';
import LocalGallery from './LocalGallery';
import FacesGallery from './FacesGallery';

function App() {
  return (
    <Router>
      <div className="App">
        <ResponsiveAppBar />
        <Routes>
          <Route path="/camera-feed" element={<EspCameraFeed />} />
          <Route path="/camera-control" element={<EspCameraControl />} />
          <Route path="/gallery" element={<PhotoGallery />} />
          <Route path="/local-gallery" element={<LocalGallery />} />
          <Route path="/faces-gallery" element={<FacesGallery />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
