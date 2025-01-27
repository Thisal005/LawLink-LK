import React, { useState, useEffect } from 'react';
import '../styles/hero.css';
import homeImage from '../assets/home.jpg';

const HeroSection = () => {
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 300; // Adjust to control how quickly the fade happens
      const scrollTop = window.scrollY;
      const opacity = Math.max(1 - scrollTop / maxScroll, 0); // Decrease opacity based on scroll
      setScrollOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
  className="hero-section"
  style={{
    // backgroundImage: `url(${homeImage})`, // Imported image path
    opacity: scrollOpacity,
  }}
    >
      {/* Background Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          LawLink<span className="highlight">LK</span>
        </h1>
        <p className="hero-subtitle-large">
          Connecting you to the right legal expertise!
        </p>
        <p className="hero-subtitle-small">
          Access trusted lawyers for all your legal needs at your fingertips.
        </p>
        <p className="join-now">Join Now</p>
        <div className="hero-buttons">
          <button className="client-btn">Client</button>
          <button className="lawyer-btn">Lawyer</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
