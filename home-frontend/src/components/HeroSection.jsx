import React from 'react';
import '../styles/hero.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
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
