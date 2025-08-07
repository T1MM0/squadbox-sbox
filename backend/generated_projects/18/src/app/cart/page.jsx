import React from 'react';
import CartItems from '../components/CartItems';
import CartSummary from '../components/CartSummary';
import ShippingOptions from '../components/ShippingOptions';

export default function Cart() {
  return (
    <div className="page cart">
      <h1>Cart</h1>
      <CartItems />
      <CartSummary />
      <ShippingOptions />
    </div>
  );
}
