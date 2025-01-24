import React, { Suspense, lazy } from 'react';
import Footer from '@/components/Footer';

// Lazy load the components
const HeroSection = lazy(() => import('@/components/HeroSection'));
const DatePicker = lazy(() => import('@/components/DatePicker'));
const PopularCar = lazy(() => import('@/components/PopularCar'));
const CarRecommendationPage = lazy(() => import('@/components/CarRecommendationPage'));
const Page = () => {
  return (
    <div>

      {/* Suspense for lazy-loaded components with a fallback */}
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<div>Loading Date Picker...</div>}>
        <DatePicker />
      </Suspense>

      {/* Render the PopularCar component, with example props */}
      <Suspense fallback={<div>Loading Popular Cars...</div>}>
        <PopularCar />
      </Suspense>

      {/* Render the car recommendations */}
      <Suspense fallback={<div>Loading Recommendations...</div>}>
        <CarRecommendationPage />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Page;
