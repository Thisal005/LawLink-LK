import React from "react";
import "../styles/about.css";

const AboutUsSection = () => {
  return (
    <section id="about">
      <div className="about-box">
        <div className="about-details">
          <h2>About Us</h2>
          <p>
            LawLinkLK is a platform that connects clients with trusted legal
            experts. Whether you need legal advice or representation, we have
            the right experts for you.
          </p>
        </div>
        <div className="about-image">
          <img src="/assets/images/feature1.jpg" alt="About Us" />
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
