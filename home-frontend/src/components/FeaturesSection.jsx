import React from 'react';
import "../styles/features.css"; 

const FeaturesSection = () => {
  return (
    <section id="features">
      <div className="for-clients">
        <h2>For Clients</h2>
        <div className="features-cards">
          <div className="feature-card">
            <img src="/assets/images/feature1.jpg" alt="Feature 1" />
            <p>Feature 1 Description</p>
          </div>
          <div className="feature-card">
            <img src="/assets/images/feature2.jpg" alt="Feature 2" />
            <p>Feature 2 Description</p>
          </div>
        </div>
      </div>
      <div className="for-lawyers">
        <h2>For Lawyers</h2>
        <div className="features-cards">
          <div className="feature-card">
            <img src="/assets/images/feature3.jpg" alt="Feature 3" />
            <p>Feature 3 Description</p>
          </div>
          <div className="feature-card">
            <img src="/assets/images/feature4.jpg" alt="Feature 4" />
            <p>Feature 4 Description</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
