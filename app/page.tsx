import React from 'react';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import DatePicker from '@/components/DatePicker';
import PopularCar from '@/components/PopularCar';
import CarRecommendationPage from '@/components/CarRecommendationPage';

const Page = () => {
  return (
    <div>
      {/* Directly render components without lazy loading or suspense */}
      <HeroSection />
      <DatePicker />
      <PopularCar />
      <CarRecommendationPage />
      <Footer />
    </div>
  );
};

export default Page;
