import React from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import Categories from '../components/Categories';
import Promotions from '../components/Promotions';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <div className="page home">
      <h1>Home</h1>
      <FeaturedProducts />
      <Categories />
      <Promotions />
      <Testimonials />
    </div>
  );
}
