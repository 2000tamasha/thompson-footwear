//  GuestCheckoutModal.js 
import React, { useState } from 'react';
import { useCart } from '../context/cartContext';
import { loadStripe } from '@stripe/stripe-js';

const GuestCheckoutModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
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
    cvv: ''
  });

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address) {
        alert('Please fill in all delivery fields.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        alert('Please enter a valid email address.');
        return;
      }
      if (!/^[0-9]{10}$/.test(form.phone)) {
        alert('Phone number must be 10 digits.');
        return;
      }
    }

    if (step === 2) {
      if (!form.cardName || !form.cardNumber || !form.expiry || !form.cvv) {
        alert('Please complete all payment fields.');
        return;
      }
      if (!/^[0-9]{16}$/.test(form.cardNumber)) {
        alert('Card number must be 16 digits.');
        return;
      }
      if (!/^[0-9]{3}$/.test(form.cvv)) {
        alert('CVV must be 3 digits.');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handleStripeCheckout = async () => {
    const stripe = await loadStripe('pk_test_51RDfRhQmyo6fDX1pbbkVAIPWdD4V2680GmmKGYGnBaA6oM8YwwR5VmbVAXbXG4K0BIiHFp6kqIXjixtFQQOW9CHb00UKW7YphX');

    //  Save order to backend first
    await fetch('http://localhost:5000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_email: form.email,
        full_name: `${form.firstName} ${form.lastName}`,
        address: form.address,
        phone: form.phone,
        items: cartItems,
        total_amount: total
      })
    });

    //  Then initiate Stripe session
    const response = await fetch('http://localhost:5000/create-checkout-session', {
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
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
      <div style={{ position: 'relative', width: '90%', maxWidth: '1000px', background: '#fff', borderRadius: '10px', display: 'flex', overflow: 'hidden' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '18px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>❌</button>

        {/* Left - Steps */}
        <div style={{ flex: 2, padding: '30px' }}>
          <h2>Checkout as Guest</h2>
          {step === 1 && (<>
            <input name="firstName" placeholder="First Name" onChange={handleInput} value={form.firstName} style={input} />
            <input name="lastName" placeholder="Last Name" onChange={handleInput} value={form.lastName} style={input} />
            <input name="address" placeholder="Start typing your address" onChange={handleInput} value={form.address} style={input} />
            <input name="email" placeholder="Email" onChange={handleInput} value={form.email} style={input} />
            <input name="phone" placeholder="Phone" onChange={handleInput} value={form.phone} style={input} />
            <button onClick={nextStep} style={blackBtn}>Save & Continue</button>
          </>)}

          {step === 2 && (<>
            <input name="cardName" placeholder="Cardholder Name" onChange={handleInput} value={form.cardName} style={input} />
            <input name="cardNumber" placeholder="Card Number" maxLength="16" onChange={handleInput} value={form.cardNumber} style={input} />
            <input name="expiry" placeholder="Expiry Date (MM/YY)" onChange={handleInput} value={form.expiry} style={input} />
            <input name="cvv" placeholder="CVV" maxLength="3" onChange={handleInput} value={form.cvv} style={input} />
            <button onClick={nextStep} style={blackBtn}>Continue to Review</button>
          </>)}

          {step === 3 && (<>
            <h4>Review Order</h4>
            <p><strong>Name:</strong> {form.firstName} {form.lastName}</p>
            <p><strong>Address:</strong> {form.address}</p>
            <p><strong>Email:</strong> {form.email}</p>
            <p><strong>Phone:</strong> {form.phone}</p>
            <button onClick={handleStripeCheckout} style={blackBtn}>Place Order & Pay</button>
          </>)}
        </div>

        {/* Right - Cart Summary */}
        <div style={{ flex: 1, backgroundColor: '#f7f7f7', padding: '30px', borderLeft: '1px solid #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3>In Your Bag</h3>
            <p>Subtotal: ${total.toFixed(2)}</p>
            <p>Delivery: $0.00</p>
            <p><strong>Total: ${total.toFixed(2)}</strong></p>
          </div>
          <div>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ borderTop: '1px solid #ccc', paddingTop: '10px', marginTop: '10px' }}>
                <p>{item.name}</p>
                <p>Qty: 1 @ ${parseFloat(item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const input = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const blackBtn = {
  background: 'black',
  color: 'white',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '4px',
  marginTop: '15px',
  cursor: 'pointer'
};

export default GuestCheckoutModal;
