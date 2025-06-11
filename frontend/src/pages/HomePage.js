// HomePage.js – Final Update (with handleContactChange fix)

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

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (location.state?.welcomeName) {
      alert(`Welcome, ${location.state.welcomeName}!`);
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

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setContactError('Server error. Please try again later.');
    }
  };

  return (
    <div className="homepage">
      <div className="hero-slideshow">
        <img
          src={imageSources[currentImageIndex]}
          alt="Slideshow Banner"
          className="slideshow-image"
        />
        <div className="hero-text-overlay" >
          <h1>Welcome to Thompson Footwear 👟</h1>
          <p>Your one-stop shop for quality shoes for Men, Women, and Kids.</p>
          <Link to="/products">
            <button className="shop-now" style={{ fontFamily: 'Poppins' }}>Shop Now</button>
          </Link>
        </div>
      </div>

      <div className="promo-banner">
        <TypeAnimation
          sequence={[
            '🔥 End of Season Sale – Up to 40% Off!'
          ]}
          wrapper="p"
          cursor={true}
          speed={50}
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            fontFamily: 'Poppins'
          }}
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
          <div className="category-card men" onClick={() => navigate('/products?category=men')} style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),url(/images/maleCat.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>Men</div>
          <div className="category-card women" onClick={() => navigate('/products?category=women')} style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/images/womenCat.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>Women</div>
          <div className="category-card kids" onClick={() => navigate('/products?category=children')} style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)) ,url(/images/kidCat.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>Kids</div>
        </div>
      </div>

      <Newsletter />

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
          ></textarea>
        </div>

        {contactSuccess && <p style={{ color: 'green' }}>{contactSuccess}</p>}
        {contactError && <p style={{ color: 'red' }}>{contactError}</p>}

        <button type="submit" style={{ fontFamily: 'Poppins' }}>Send Message</button>

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
