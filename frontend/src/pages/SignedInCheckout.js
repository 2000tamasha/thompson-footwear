// SignedInCheckout.js – Enhanced Confirmation 

import React, { useState } from 'react';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import { loadStripe } from '@stripe/stripe-js';

const SignedInCheckout = () => {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showMessage, setShowMessage] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    paymentMethod: 'card',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    paypalEmail: ''
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const nextStep = () => {
    if (step === 1 && (!form.name || !form.email || !form.phone || !form.address)) {
      alert('Please fill all delivery fields');
      return;
    }
    if (step === 2) {
      if ((form.paymentMethod === 'card' || form.paymentMethod === 'afterpay') &&
        (!form.cardName || !form.cardNumber || !form.cardExpiry || !form.cardCvc)) {
        alert('Please fill all card details');
        return;
      }
      if (form.paymentMethod === 'paypal' && !form.paypalEmail) {
        alert('Please enter PayPal email');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleCheckout = async () => {
    setShowMessage(true);

    try {
      await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: form.email,
          full_name: form.name,
          address: form.address,
          phone: form.phone,
          items: cartItems,
          total_amount: total,
          payment_method: form.paymentMethod
        })
      });

      const stripe = await loadStripe('pk_test_51RDfRhQmyo6fDX1pbbkVAIPWdD4V2680GmmKGYGnBaA6oM8YwwR5VmbVAXbXG4K0BIiHFp6kqIXjixtFQQOW9CHb00UKW7YphX');
      const res = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            name: item.name,
            quantity: 1,
            price: Math.round(parseFloat(item.price) * 100),
          }))
        })
      });

      const session = await res.json();

      // Delay to show message
      setTimeout(() => {
        stripe.redirectToCheckout({ sessionId: session.id });
      }, 2500);
    } catch (err) {
      alert('Error placing order. Please try again.');
      setShowMessage(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Poppins', marginTop: '100px' }}>
      <h2>Checkout</h2>

      {showMessage && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          ✅ Order placed successfully! Redirecting to payment...
        </div>
      )}

      <div style={stepIndicator}>
        <strong style={step === 1 ? active : inactive}>1. Delivery</strong>
        <strong style={step === 2 ? active : inactive}>2. Payment</strong>
        <strong style={step === 3 ? active : inactive}>3. Review</strong>
      </div>

      {step === 1 && (
        <>
          <label>Full Name</label>
          <input name="name" value={form.name} onChange={handleInput} style={input} />
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleInput} style={input} />
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleInput} style={input} />
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleInput} style={input} />
          <button onClick={nextStep} style={btn}>Continue to Payment</button>
        </>
      )}

      {step === 2 && (
        <>
          <h3>Select Payment Method</h3>
          <div style={paymentOptions}>
            <div onClick={() => setForm({ ...form, paymentMethod: 'card' })} style={optionBox(form.paymentMethod === 'card')}>💳 Card</div>
            <div onClick={() => setForm({ ...form, paymentMethod: 'paypal' })} style={optionBox(form.paymentMethod === 'paypal')}>🅿️ PayPal</div>
            <div onClick={() => setForm({ ...form, paymentMethod: 'afterpay' })} style={optionBox(form.paymentMethod === 'afterpay')}>🅰️ Afterpay</div>
          </div>

          {(form.paymentMethod === 'card' || form.paymentMethod === 'afterpay') && (
            <>
              <label>Name on Card</label>
              <input name="cardName" value={form.cardName} onChange={handleInput} style={input} />
              <label>Card Number</label>
              <input name="cardNumber" value={form.cardNumber} onChange={handleInput} style={input} maxLength="16" />
              <label>Expiry (MM/YY)</label>
              <input name="cardExpiry" value={form.cardExpiry} onChange={handleInput} style={input} />
              <label>CVC</label>
              <input name="cardCvc" value={form.cardCvc} onChange={handleInput} style={input} maxLength="4" />
            </>
          )}

          {form.paymentMethod === 'paypal' && (
            <>
              <label>PayPal Email</label>
              <input name="paypalEmail" value={form.paypalEmail} onChange={handleInput} style={input} />
            </>
          )}
          <button onClick={prevStep} style={backBtn}>Back</button>
          <button onClick={nextStep} style={btn}>Continue to Review</button>
        </>
      )}

      {step === 3 && (
        <>
          <h3>Review Order</h3>
          <p><strong>Name:</strong> {form.name}</p>
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Phone:</strong> {form.phone}</p>
          <p><strong>Address:</strong> {form.address}</p>
          <p><strong>Payment:</strong> {form.paymentMethod.toUpperCase()}</p>
          <hr />
          <h4>Cart Summary</h4>
          {cartItems.map((item, idx) => (
            <p key={idx}>{item.name} - ${parseFloat(item.price).toFixed(2)}</p>
          ))}
          <p><strong>Total:</strong> ${total.toFixed(2)}</p>
          <button onClick={prevStep} style={backBtn}>Back</button>
          <button onClick={handleCheckout} style={btn}>Place Order & Pay</button>
        </>
      )}
    </div>
  );
};

// Styles
const input = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' };
const btn = { padding: '12px 20px', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' };
const backBtn = { ...btn, backgroundColor: 'gray', marginRight: '10px' };
const stepIndicator = { display: 'flex', gap: '20px', marginBottom: '20px' };
const active = { color: 'black', fontWeight: 'bold' };
const inactive = { color: '#aaa' };
const paymentOptions = { display: 'flex', gap: '20px', marginTop: '10px', marginBottom: '20px' };
const optionBox = (selected) => ({
  padding: '10px 20px',
  borderRadius: '6px',
  border: selected ? '2px solid black' : '1px solid #ccc',
  cursor: 'pointer',
  backgroundColor: selected ? '#f0f0f0' : '#fff'
});

export default SignedInCheckout;
