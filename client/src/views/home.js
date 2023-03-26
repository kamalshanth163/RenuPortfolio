import React from 'react';

import AppHero from '../components/home/hero';
import ImageSlider from '../components/custom/ImageSlider';
import ImageGallery from '../components/custom/ImageGallery';

function AppHome() {
  return (
    <div className="main">
      <AppHero/>
      {/* <ImageSlider /> */}
      {/* <ImageUploadForm />
      <ImageList /> */}
      <ImageGallery />
      {/* <ImageManager /> */}
      {/* <AppAbout/> */}
      {/* <AppFeature/> */}
      {/* <AppWorks/> */}
      {/* <AppFaq/> */}
      {/* <AppPricing/> */}
      {/* <AppContact/> */}
    </div>
  );
}

export default AppHome;