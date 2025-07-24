import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner'; 

const HeroSection = React.lazy(() => import(
  /* webpackPrefetch: true */ './HeroSection'
));
const AboutClinic = React.lazy(() => import('./AboutClinic'));
const DoctorServices = React.lazy(() => import('./DoctorServices'));
const Testimonials = React.lazy(() => import('./Testimonials'));
const ContactUs = React.lazy(() => import('./ContactUs'));
const WhyChooseUs = React.lazy(() => import('./WhyChooseUs'));
const AppDownloadSection = React.lazy(() => import('./AppDownloadSection'));

function Home() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
        <AboutClinic />
        <DoctorServices />
        <Testimonials />
        <ContactUs />
        <WhyChooseUs />
        <AppDownloadSection />
      </Suspense>
    </>
  );
}

export default Home;