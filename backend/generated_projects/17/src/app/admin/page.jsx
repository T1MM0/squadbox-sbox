import React from 'react';
import Dashboard from '../components/Dashboard';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import CustomerManagement from '../components/CustomerManagement';
import Analytics from '../components/Analytics';

export default function Admin() {
  return (
    <div className="page admin">
      <h1>Admin</h1>
      <Dashboard />
      <ProductManagement />
      <OrderManagement />
      <CustomerManagement />
      <Analytics />
    </div>
  );
}
