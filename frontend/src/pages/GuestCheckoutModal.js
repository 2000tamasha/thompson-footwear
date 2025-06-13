// GuestCheckoutModal.js – Enhanced Confirmation by sharan adhikari

import React, { useState } from 'react';
import { useCart } from '../context/cartContext';
import { loadStripe } from '@stripe/stripe-js';

const GuestCheckoutModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const { cartItems } = useCart();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    paypalEmail: '',
    paymentMethod: 'card'
  });

  // Use environment variable for API URL, fallback to production URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://thompson-footwear-production.up.railway.app';

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1 && (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address)) {
      alert('Please fill in all delivery fields.');
      return;
    }
    if (step === 2) {
      if ((form.paymentMethod === 'card' || form.paymentMethod === 'afterpay') &&
        (!form.cardName || !form.cardNumber || !form.expiry || !form.cvv)) {
        alert('Please complete all card details.');
        return;
      }
      if (form.paymentMethod === 'paypal' && !form.paypalEmail) {
        alert('Please enter your PayPal ID.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleStripeCheckout = async () => {
    setShowMessage(true);
    try {
      await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: form.email,
          full_name: `${form.firstName} ${form.lastName}`,
          address: form.address,
          phone: form.phone,
          items: cartItems,
          total_amount: total,
          payment_method: form.paymentMethod
        })
      });

      const stripe = await loadStripe('pk_test_51RDfRhQmyo6fDX1pbbkVAIPWdD4V2680GmmKGYGnBaA6oM8YwwR5VmbVAXbXG4K0BIiHFp6kqIXjixtFQQOW9CHb00UKW7YphX');
      const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
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
      const session = await response.json();

      setTimeout(() => {
        stripe.redirectToCheckout({ sessionId: session.id });
      }, 2500);

    } catch (err) {
      console.error('Order placement failed:', err);
      alert('Order placement failed.');
      setShowMessage(false);
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <button onClick={onClose} style={closeBtn}>❌</button>

        <div style={{ flex: 2, padding: '30px' }}>
          <h2>Checkout as Guest</h2>

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
            <strong style={step === 1 ? activeStep : inactiveStep}>1. Delivery</strong>
            <strong style={step === 2 ? activeStep : inactiveStep}>2. Payment</strong>
            <strong style={step === 3 ? activeStep : inactiveStep}>3. Review</strong>
          </div>

          {step === 1 && (
            <>
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleInput} style={input} />
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleInput} style={input} />
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleInput} style={input} />
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleInput} style={input} />
              <label>Address</label>
              <input name="address" value={form.address} onChange={handleInput} style={input} />
              <button onClick={nextStep} style={blackBtn}>Save & Continue to Payment</button>
            </>
          )}

          {step === 2 && (
            <>
              <h3>Select Payment Method</h3>
              <div style={paymentGrid}>
                <div onClick={() => setForm({ ...form, paymentMethod: 'card' })} style={paymentOptionBox(form.paymentMethod === 'card')}>
                  <p>💳 Card</p>
                </div>
                <div onClick={() => setForm({ ...form, paymentMethod: 'paypal' })} style={paymentOptionBox(form.paymentMethod === 'paypal')}>
                  <p>🅿️ PayPal</p>
                </div>
                <div onClick={() => setForm({ ...form, paymentMethod: 'afterpay' })} style={paymentOptionBox(form.paymentMethod === 'afterpay')}>
                  <p>🅰️ Afterpay</p>
                </div>
              </div>

              {(form.paymentMethod === 'card' || form.paymentMethod === 'afterpay') && (
                <>
                  <label>Name on Card</label>
                  <input name="cardName" value={form.cardName} onChange={handleInput} style={input} />
                  <label>Card Number</label>
                  <input name="cardNumber" maxLength="16" value={form.cardNumber} onChange={handleInput} style={input} />
                  <label>Expiry (MM/YY)</label>
                  <input name="expiry" value={form.expiry} onChange={handleInput} style={input} />
                  <label>CVV</label>
                  <input name="cvv" maxLength="3" value={form.cvv} onChange={handleInput} style={input} />
                </>
              )}

              {form.paymentMethod === 'paypal' && (
                <>
                  <label>PayPal Email</label>
                  <input name="paypalEmail" value={form.paypalEmail} onChange={handleInput} style={input} />
                </>
              )}
              <button onClick={nextStep} style={blackBtn}>Continue to Review</button>
            </>
          )}

          {step === 3 && (
            <>
              <h3>Review & Confirm</h3>
              <p><strong>Name:</strong> {form.firstName} {form.lastName}</p>
              <p><strong>Email:</strong> {form.email}</p>
              <p><strong>Address:</strong> {form.address}</p>
              <p><strong>Payment:</strong> {form.paymentMethod.toUpperCase()}</p>
              {cartItems.map((item, idx) => (
                <div key={idx}><p>{item.name} - ${parseFloat(item.price).toFixed(2)}</p></div>
              ))}
              <p><strong>Total:</strong> ${total.toFixed(2)}</p>
              <button onClick={handleStripeCheckout} style={blackBtn}>Place Order & Pay</button>
            </>
          )}
        </div>

        <div style={{ flex: 1, backgroundColor: '#f7f7f7', padding: '30px', borderLeft: '1px solid #ddd' }}>
          <h3>Cart Summary</h3>
          <p>Subtotal: ${total.toFixed(2)}</p>
          {cartItems.map((item, idx) => (
            <div key={idx}>
              <p>{item.name}</p>
              <p>Qty: 1 @ ${parseFloat(item.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 };
const modalBox = { position: 'relative', width: '90%', maxWidth: '1000px', background: '#fff', borderRadius: '10px', display: 'flex' };
const closeBtn = { position: 'absolute', top: '10px', right: '20px', fontSize: '18px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' };
const stepIndicator = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const activeStep = { color: 'black' };
const inactiveStep = { color: '#aaa' };
const input = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', fontFamily: 'Poppins', border: '1px solid #ccc' };
const blackBtn = { background: 'black', color: 'white', padding: '12px 20px', fontFamily: 'Poppins', border: 'none', borderRadius: '4px', marginTop: '15px', cursor: 'pointer' };
const paymentOptionBox = (selected) => ({ flex: 1, border: selected ? '2px solid black' : '1px solid #ccc', padding: '10px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', backgroundColor: selected ? '#f0f0f0' : '#fff' });
const paymentGrid = { display: 'flex', gap: '15px', marginBottom: '15px' };

export default GuestCheckoutModal;