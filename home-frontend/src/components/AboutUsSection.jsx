import React from "react";
import "../styles/about.css";

const AboutUsSection = () => {
  return (
    <section id="about">
      {/* About Us Title (Aligned to Right) */}
      <h2 className="about-title">ABOUT US</h2>

      {/* About Us Content (Centered Below Title) */}
      <div className="about-box">
        <div className="about-details">
          <h2>At LawLink LK,</h2>
          <p>
            We believe <span className="highlight">justice should be simple and accessible</span> to everyone.
          </p>
          <p>
            LawLink LK is Sri Lanka's first online platform connecting clients with trusted lawyers while empowering legal professionals. Whether you're seeking legal advice, posting a case anonymously, or managing your workload, we've got you covered.
          </p>
          <p className="closing-line">LawLink LK – your link to justice, made easy.</p>
        </div>
        <div className="about-image">
          <img src="../src/assets/image01.png" alt="About Us" />
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
