import React from 'react';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import Sorting from '../components/Sorting';
import Pagination from '../components/Pagination';

export default function Products() {
  return (
    <div className="page products">
      <h1>Products</h1>
      <ProductGrid />
      <Filters />
      <Sorting />
      <Pagination />
    </div>
  );
}
