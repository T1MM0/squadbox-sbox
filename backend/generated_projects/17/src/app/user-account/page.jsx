import React from 'react';
import Profile from '../components/Profile';
import Orders from '../components/Orders';
import Wishlist from '../components/Wishlist';
import Addresses from '../components/Addresses';
import PaymentMethods from '../components/PaymentMethods';

export default function User account() {
  return (
    <div className="page user account">
      <h1>User Account</h1>
      <Profile />
      <Orders />
      <Wishlist />
      <Addresses />
      <PaymentMethods />
    </div>
  );
}
