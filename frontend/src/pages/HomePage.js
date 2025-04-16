// HomePage.js – Created by Sharan Adhikari 24071844 & Improved by Thamasha Kodithuwakku 24351177

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const trimmed = searchTerm.trim().toLowerCase();

    if (['men', 'women', 'children'].includes(trimmed)) {
      navigate(`/products?category=${trimmed}`);
    } else if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };


  const imageSources = [
    "/images/slide1.png",
    "/images/slide2.png",
    "/images/slide3.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % imageSources.length
      );
    }, 5000); // change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (

    <div className="homepage">
      <div className="hero-slideshow">
        <img
          src={imageSources[currentImageIndex]}
          alt="Slideshow Banner"
          className="slideshow-image"
        />
        <div className="hero-text-overlay">
          <h1>Welcome to Thompson Footwear 👟</h1>
          <p>Your one-stop shop for quality shoes for Men, Women, and Kids.</p>
          <Link to="/products">
            <button className="shop-now" style={{ fontFamily:'Poppins' }}>Shop Now</button>
          </Link>
        </div>
      </div>


      {/* 🔍 Search Bar */}
      <div className="search-bar" style={{ textAlign: 'center', margin: '30px' }}>
        <input
          type="text"
          placeholder="Search or type 'Men', 'Women', 'Children'..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontFamily:'Poppins'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 15px',
            marginLeft: '10px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            fontFamily:'Poppins',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      <div className="tagline">
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

      <div className="category-section">
        <h2>Shop by Category</h2>
        <div className="category-cards">
          <div className="category-card men" onClick={() => navigate('/products?category=men')} style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),url(/images/maleCat.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',

          }}>Men</div>
          <div className="category-card women" onClick={() => navigate('/products?category=women')} style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/images/womenCat.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>Women</div>
          <div className="category-card kids" onClick={() => navigate('/products?category=children')} style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)) ,url(/images/kidCat.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>Kids</div>
        </div>
      </div>

      <div className="about-section">
        <h2>About Us</h2>
        <div className="about-row">
          <div className="about-image-box">
            <img
              src="/images/about.png"
              alt="About Thompson Footwear"
              className="about-image"
            />
          </div>
          <div className="about-text">
            <p>
              Thompson Footwear has been serving the local community for over a decade.
              Our commitment to comfort, style, and value sets us apart from the rest.
            </p>
            <p>
              Whether you're looking for trendy sneakers, durable boots, or classy formal shoes,
              we have something for everyone. Now online and ready to serve all across Australia!
            </p>
          </div>
        </div>
      </div>


      <div className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-list">
          <div className="testimonial-card">
            <img src="/images/cus1.png" alt="Amanda T." className="testimonial-img" />
            <blockquote>"Super comfy and stylish. I wear them every day!"</blockquote>
            <p>– Amanda T.</p>
          </div>

          <div className="testimonial-card">
            <img src="/images/cus2.png" alt="Jason M." className="testimonial-img" />
            <blockquote>"My kids love their new shoes. Great prices too!"</blockquote>
            <p>– Jason M.</p>
          </div>

          <div className="testimonial-card">
            <img src="/images/cus3.png" alt="Priya S." className="testimonial-img" />
            <blockquote>"Fast delivery and amazing customer service."</blockquote>
            <p>– Priya S.</p>
          </div>
        </div>
      </div>


      <div className="why-us">
        <h2>Why Shop With Us?</h2>
        <ul>
          <li>✔️ Free Shipping over $50</li>
          <li>✔️ 10+ Years of Trust</li>
          <li>✔️ Quality Guaranteed</li>
          <li>✔️ 24/7 Customer Support</li>
        </ul>
      </div>

      <div className="newsletter">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get exclusive deals and 10% off your first order!</p>
        <input type="email" placeholder="Your email address" style={{ fontFamily:'Poppins' }} />
        <button style={{ fontFamily:'Poppins' }} >Subscribe</button>
      </div>

      <div className="contact-map">
        <h2>Visit Our Store</h2>
        <p>25 King Street, Morley, WA 6062</p>
        <p>Email: michael.thompson@thompsonfootwear.com | Phone: (02) 1234 5678</p>
        <iframe
          title="store-location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3363.557330230218!2d115.90452337555458!3d-31.89910337403406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32b0f3b9ea2573%3A0x9e305a00e8e49155!2s25%20King%20St%2C%20Morley%20WA%206062%2C%20Australia!5e0!3m2!1sen!2sau!4v1719908721156!5m2!1sen!2sau"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="contact-form-section">
        <h2>Get in Touch</h2>
        <p>Have a question, feedback, or just want to say hi? Drop us a message!</p>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Your name" style={{ fontFamily:'Poppins' }} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Your email" style={{ fontFamily:'Poppins' }} required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="4" style={{ fontFamily:'Poppins' }} placeholder="Your message" required></textarea>
          </div>

          <button type="submit" style={{ fontFamily:'Poppins' }}>Send Message</button>
        </form>
      </div>

    </div>
  );
};

export default HomePage;
