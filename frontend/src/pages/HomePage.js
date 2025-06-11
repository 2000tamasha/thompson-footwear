// HomePage.js – Fixed version for production deployment

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './HomePage.css';
import Newsletter from '../components/Newsletter';
import { TypeAnimation } from 'react-type-animation';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contact, setContact] = useState({
    full_name: '',
    email: '',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get API base URL for production
  const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin.replace(':3000', ':5000');

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (location.state?.welcomeName) {
      // Use a better notification instead of alert
      setContactSuccess(`Welcome, ${location.state.welcomeName}!`);
      setTimeout(() => setContactSuccess(''), 3000);
    }
  }, [location.state]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSearch = () => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (['men', 'women', 'children'].includes(trimmed)) {
      navigate(`/products?category=${trimmed}`);
    } else if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const imageSources = [
    "/images/slide1.png",
    "/images/slide2.png",
    "/images/slide3.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % imageSources.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [imageSources.length]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSuccess('');
    setContactError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(contact)
      });

      const data = await response.json();

      if (response.ok) {
        setContact({ full_name: '', email: '', message: '' });
        setShowContactModal(true);
      } else {
        setContactError(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setContactError('Unable to send message. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="homepage">
      {/* Success/Welcome notification banner */}
      {contactSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#28a745',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000,
          fontFamily: 'Poppins'
        }}>
          {contactSuccess}
        </div>
      )}

      <div className="hero-slideshow">
        <img
          src={imageSources[currentImageIndex]}
          alt="Slideshow Banner"
          className="slideshow-image"
          style={{
            width: '100%',
            height: '500px',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        <div className="hero-text-overlay">
          <h1>Welcome to Thompson Footwear 👟</h1>
          <p>Your one-stop shop for quality shoes for Men, Women, and Kids.</p>
          <Link to="/products">
            <button className="shop-now" style={{ fontFamily: 'Poppins' }}>Shop Now</button>
          </Link>
          <button onClick={() => navigate('/login')} style={{ marginLeft: '15px', fontFamily: 'Poppins' }}>Login</button>
        </div>
      </div>

      <div className="promo-banner">
        <TypeAnimation
          sequence={[ '🔥 End of Season Sale – Up to 40% Off!' ]}
          wrapper="p"
          cursor={true}
          speed={50}
          style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', textAlign: 'center', fontFamily: 'Poppins' }}
          repeat={0}
        />
      </div>

      <div className="tagline" data-aos="fade-up">
        <h2>👟 Style That Moves With You</h2>
        <p>
          At Thompson Footwear, we believe the right pair of shoes can take you places.
          Whether you're heading to work, the gym, or a weekend adventure, our styles are designed
          for every step of your journey.
        </p>
        <p>
          Discover our wide collection of comfortable, stylish footwear for Men, Women, and Kids —
          because looking good should feel good too.
        </p>
      </div>

      <div className="category-section" data-aos="fade-up">
        <h2>Shop by Category</h2>
        <div className="category-cards">
          <div 
            className="category-card men" 
            onClick={() => navigate('/products?category=men')} 
            style={{ 
              backgroundImage: 'url(/images/maleCat.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              height: '300px',
              width: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              padding: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              cursor: 'pointer',
              borderRadius: '10px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Men
          </div>
          <div 
            className="category-card women" 
            onClick={() => navigate('/products?category=women')} 
            style={{ 
              backgroundImage: 'url(/images/womenCat.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              height: '300px',
              width: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              padding: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              cursor: 'pointer',
              borderRadius: '10px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Women
          </div>
          <div 
            className="category-card kids" 
            onClick={() => navigate('/products?category=children')} 
            style={{ 
              backgroundImage: 'url(/images/kidCat.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              height: '300px',
              width: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              padding: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              cursor: 'pointer',
              borderRadius: '10px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Kids
          </div>
        </div>
      </div>

      <Newsletter />

      <div className="contact-map">
        <h2>Visit Our Store</h2>
        <p>25 King Street, Morley, WA 6062</p>
        <p>Email: michael.thompson@thompsonfootwear.com | Phone: (02) 1234 5678</p>
        <iframe
          title="store-location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3363.557330230218!2d115.90452337555458!3d-31.89910337403406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32b0f3b9ea2573%3A0x9e305a00e8e49155!2s25%20King%20St%2C%20Morley%20WA%206062%2C%20Australia!5e0!3m2!1sen!2sau!4v1719908721156!5m2!1sen!2sau"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: '10px' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <form className="contact-form" onSubmit={handleContactSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="full_name"
            value={contact.full_name}
            onChange={handleContactChange}
            placeholder="Your name"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={contact.email}
            onChange={handleContactChange}
            placeholder="Your email"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={contact.message}
            onChange={handleContactChange}
            placeholder="Your message"
            required
            disabled={isSubmitting}
          ></textarea>
        </div>

        {contactError && (
          <div style={{ 
            color: '#e74c3c', 
            background: '#fee', 
            padding: '10px', 
            borderRadius: '5px',
            marginBottom: '15px',
            border: '1px solid #fcc'
          }}>
            {contactError}
          </div>
        )}

        <button 
          type="submit" 
          style={{ 
            fontFamily: 'Poppins',
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>

        {showContactModal && (
          <div className="newsletter-modal">
            <div className="newsletter-modal-content">
              <h3>Message Sent Successfully!</h3>
              <p>
                Your message has been sent successfully.<br />
                Our team will get back to you as soon as possible.<br />
                Thank you — have a good one!
              </p>
              <button onClick={() => setShowContactModal(false)}>
                OK
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default HomePage;