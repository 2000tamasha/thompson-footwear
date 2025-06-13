// SignedInCheckout.js – Enhanced Confirmation with Debug Logging

import React, { useState } from 'react';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import { loadStripe } from '@stripe/stripe-js';

const SignedInCheckout = () => {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // FIXED: Added proper API URL configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://thompson-footwear-production.up.railway.app'
      : 'http://localhost:5000');

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
    // Clear error when user starts typing
    if (error) setError('');
  };

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const validateStep1 = () => {
    if (!form.name.trim()) return 'Please enter your full name';
    if (!form.email.trim()) return 'Please enter your email';
    if (!form.phone.trim()) return 'Please enter your phone number';
    if (!form.address.trim()) return 'Please enter your address';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return 'Please enter a valid email address';
    
    return null;
  };

  const validateStep2 = () => {
    if (form.paymentMethod === 'card' || form.paymentMethod === 'afterpay') {
      if (!form.cardName.trim()) return 'Please enter the name on card';
      if (!form.cardNumber.trim()) return 'Please enter card number';
      if (!form.cardExpiry.trim()) return 'Please enter card expiry';
      if (!form.cardCvc.trim()) return 'Please enter CVC';
      
      if (form.cardNumber.replace(/\s/g, '').length < 13) return 'Please enter a valid card number';
      if (form.cardCvc.length < 3) return 'Please enter a valid CVC';
    }
    
    if (form.paymentMethod === 'paypal') {
      if (!form.paypalEmail.trim()) return 'Please enter PayPal email';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.paypalEmail)) return 'Please enter a valid PayPal email';
    }
    
    return null;
  };

  const nextStep = () => {
    setError('');
    
    if (step === 1) {
      const error = validateStep1();
      if (error) {
        setError(error);
        return;
      }
    }
    
    if (step === 2) {
      const error = validateStep2();
      if (error) {
        setError(error);
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // DEBUG LOGGING - Check cart item structure
    console.log('=== CHECKOUT DEBUG START ===');
    console.log('Raw cartItems:', cartItems);
    console.log('Number of items:', cartItems.length);
    
    // Check each item structure
    cartItems.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        name: item.name,
        price: item.price,
        priceType: typeof item.price,
        quantity: item.quantity,
        quantityType: typeof item.quantity,
        allProperties: Object.keys(item)
      });
    });

    // Format items for order API
    const orderItems = cartItems.map(item => ({
      name: item.name || 'Unknown Product',
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity) || 1,
      id: item.id,
      selectedSize: item.selectedSize
    }));

    // Format items for Stripe
    const stripeItems = cartItems.map(item => ({
      name: item.name || 'Unknown Product',
      quantity: parseInt(item.quantity) || 1,
      price: Math.round(parseFloat(item.price) * 100), // Convert to cents
    }));

    console.log('Formatted items for order API:', orderItems);
    console.log('Formatted items for Stripe:', stripeItems);
    console.log('Total amount:', total);
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('=== CHECKOUT DEBUG END ===');

    setIsLoading(true);
    setShowMessage(true);
    setError('');

    try {
      // FIXED: Save order to database using correct API endpoint
      console.log('Attempting to save order...');
      const orderResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: form.email,
          full_name: form.name,
          address: form.address,
          phone: form.phone,
          items: orderItems, // Use formatted items
          total_amount: total,
          payment_method: form.paymentMethod
        })
      });

      console.log('Order response status:', orderResponse.status);
      
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Order save failed:', errorText);
        throw new Error(`Failed to save order: ${orderResponse.status}`);
      }

      const orderResult = await orderResponse.json();
      console.log('Order saved successfully:', orderResult);

      // FIXED: Create Stripe checkout session using correct API endpoint
      console.log('Creating Stripe session...');
      const stripe = await loadStripe('pk_test_51RDfRhQmyo6fDX1pbbkVAIPWdD4V2680GmmKGYGnBaA6oM8YwwR5VmbVAXbXG4K0BIiHFp6kqIXjixtFQQOW9CHb00UKW7YphX');
      
      const sessionResponse = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: stripeItems // Use formatted Stripe items
        })
      });

      console.log('Stripe session response status:', sessionResponse.status);

      if (!sessionResponse.ok) {
        const errorText = await sessionResponse.text();
        console.error('Stripe session creation failed:', errorText);
        throw new Error(`Failed to create payment session: ${sessionResponse.status}`);
      }

      const session = await sessionResponse.json();
      console.log('Stripe session created:', session);

      if (!session.id) {
        throw new Error('No session ID returned from Stripe');
      }

      // Delay to show success message
      setTimeout(() => {
        console.log('Redirecting to Stripe with session ID:', session.id);
        stripe.redirectToCheckout({ sessionId: session.id });
      }, 2500);

    } catch (err) {
      console.error('Checkout error:', err);
      setError(`Error placing order: ${err.message}`);
      setShowMessage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Poppins', marginTop: '100px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before checking out.</p>
        <button 
          onClick={() => window.location.href = '/products'} 
          style={btn}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

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

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          ❌ {error}
        </div>
      )}

      <div style={stepIndicator}>
        <strong style={step === 1 ? active : inactive}>1. Delivery</strong>
        <strong style={step === 2 ? active : inactive}>2. Payment</strong>
        <strong style={step === 3 ? active : inactive}>3. Review</strong>
      </div>

      {step === 1 && (
        <>
          <h3>Delivery Information</h3>
          <label>Full Name *</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleInput} 
            style={input}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
          
          <label>Email *</label>
          <input 
            name="email" 
            type="email"
            value={form.email} 
            onChange={handleInput} 
            style={input}
            placeholder="your@email.com"
            disabled={isLoading}
          />
          
          <label>Phone *</label>
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleInput} 
            style={input}
            placeholder="Enter your phone number"
            disabled={isLoading}
          />
          
          <label>Address *</label>
          <input 
            name="address" 
            value={form.address} 
            onChange={handleInput} 
            style={input}
            placeholder="Enter your full address"
            disabled={isLoading}
          />
          
          <button 
            onClick={nextStep} 
            style={btn}
            disabled={isLoading}
          >
            Continue to Payment
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h3>Select Payment Method</h3>
          <div style={paymentOptions}>
            <div onClick={() => !isLoading && setForm({ ...form, paymentMethod: 'card' })} style={optionBox(form.paymentMethod === 'card')}>💳 Card</div>
            <div onClick={() => !isLoading && setForm({ ...form, paymentMethod: 'paypal' })} style={optionBox(form.paymentMethod === 'paypal')}>🅿️ PayPal</div>
            <div onClick={() => !isLoading && setForm({ ...form, paymentMethod: 'afterpay' })} style={optionBox(form.paymentMethod === 'afterpay')}>🅰️ Afterpay</div>
          </div>

          {(form.paymentMethod === 'card' || form.paymentMethod === 'afterpay') && (
            <>
              <label>Name on Card *</label>
              <input 
                name="cardName" 
                value={form.cardName} 
                onChange={handleInput} 
                style={input}
                placeholder="Enter name as on card"
                disabled={isLoading}
              />
              
              <label>Card Number *</label>
              <input 
                name="cardNumber" 
                value={form.cardNumber} 
                onChange={(e) => handleInput({ target: { name: 'cardNumber', value: formatCardNumber(e.target.value) } })}
                style={input}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                disabled={isLoading}
              />
              
              <label>Expiry (MM/YY) *</label>
              <input 
                name="cardExpiry" 
                value={form.cardExpiry} 
                onChange={(e) => handleInput({ target: { name: 'cardExpiry', value: formatExpiry(e.target.value) } })}
                style={input}
                placeholder="MM/YY"
                maxLength="5"
                disabled={isLoading}
              />
              
              <label>CVC *</label>
              <input 
                name="cardCvc" 
                value={form.cardCvc} 
                onChange={handleInput} 
                style={input}
                placeholder="123"
                maxLength="4"
                disabled={isLoading}
              />
            </>
          )}

          {form.paymentMethod === 'paypal' && (
            <>
              <label>PayPal Email *</label>
              <input 
                name="paypalEmail" 
                type="email"
                value={form.paypalEmail} 
                onChange={handleInput} 
                style={input}
                placeholder="your@paypal.com"
                disabled={isLoading}
              />
            </>
          )}
          
          <button 
            onClick={prevStep} 
            style={backBtn}
            disabled={isLoading}
          >
            Back
          </button>
          <button 
            onClick={nextStep} 
            style={btn}
            disabled={isLoading}
          >
            Continue to Review
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h3>Review Order</h3>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Email:</strong> {form.email}</p>
            <p><strong>Phone:</strong> {form.phone}</p>
            <p><strong>Address:</strong> {form.address}</p>
            <p><strong>Payment:</strong> {form.paymentMethod.toUpperCase()}</p>
          </div>
          
          <hr />
          <h4>Cart Summary</h4>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{item.name} {item.selectedSize ? `(${item.selectedSize})` : ''}</span>
                <span>${parseFloat(item.price).toFixed(2)}</span>
              </div>
            ))}
            <hr style={{ margin: '15px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={prevStep} 
            style={backBtn}
            disabled={isLoading}
          >
            Back
          </button>
          <button 
            onClick={handleCheckout} 
            style={{ ...btn, opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Place Order & Pay'}
          </button>
        </>
      )}
    </div>
  );
};

// Styles
const input = { 
  width: '100%', 
  padding: '12px', 
  marginBottom: '15px', 
  borderRadius: '5px', 
  border: '1px solid #ccc',
  fontSize: '16px',
  fontFamily: 'Poppins'
};

const btn = { 
  padding: '12px 20px', 
  backgroundColor: 'black', 
  color: 'white', 
  border: 'none', 
  borderRadius: '5px', 
  cursor: 'pointer', 
  marginTop: '10px',
  fontSize: '16px',
  fontWeight: 'bold',
  fontFamily: 'Poppins',
  transition: 'opacity 0.2s'
};

const backBtn = { 
  ...btn, 
  backgroundColor: 'gray', 
  marginRight: '10px' 
};

const stepIndicator = { 
  display: 'flex', 
  gap: '20px', 
  marginBottom: '30px',
  paddingBottom: '15px',
  borderBottom: '1px solid #eee'
};

const active = { 
  color: 'black', 
  fontWeight: 'bold' 
};

const inactive = { 
  color: '#aaa' 
};

const paymentOptions = { 
  display: 'flex', 
  gap: '20px', 
  marginTop: '10px', 
  marginBottom: '20px',
  flexWrap: 'wrap'
};

const optionBox = (selected) => ({
  padding: '15px 20px',
  borderRadius: '8px',
  border: selected ? '2px solid black' : '1px solid #ccc',
  cursor: 'pointer',
  backgroundColor: selected ? '#f0f0f0' : '#fff',
  fontWeight: selected ? 'bold' : 'normal',
  transition: 'all 0.2s',
  minWidth: '120px',
  textAlign: 'center'
});

export default SignedInCheckout;