import React from 'react';
import ShippingInfo from '../components/ShippingInfo';
import Payment from '../components/Payment';
import OrderReview from '../components/OrderReview';
import Confirmation from '../components/Confirmation';

export default function Checkout() {
  return (
    <div className="page checkout">
      <h1>Checkout</h1>
      <ShippingInfo />
      <Payment />
      <OrderReview />
      <Confirmation />
    </div>
  );
}
