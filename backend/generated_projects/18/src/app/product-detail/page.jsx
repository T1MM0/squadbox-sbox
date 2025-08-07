import React from 'react';
import ProductImages from '../components/ProductImages';
import ProductInfo from '../components/ProductInfo';
import Specifications from '../components/Specifications';
import Reviews from '../components/Reviews';
import RelatedProducts from '../components/RelatedProducts';

export default function Product detail() {
  return (
    <div className="page product detail">
      <h1>Product Detail</h1>
      <ProductImages />
      <ProductInfo />
      <Specifications />
      <Reviews />
      <RelatedProducts />
    </div>
  );
}
