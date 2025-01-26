import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutUsSection from "./components/AboutUsSection";
import FeaturesSection from "./components/FeaturesSection";
import FAQSection from "./components/FAQSection";
import ContactUsSection from "./components/ContactUsSection";

import "./styles/global.css";

const App = () => {
  // Scroll event listener to add/remove the 'scrolled' class on HeroSection
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".hero-section");
      if (window.scrollY > 100) {
        heroSection.classList.add("scrolled"); // Add class when scrolled past 100px
      } else {
        heroSection.classList.remove("scrolled"); // Remove class when back to top
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
  }, []);

  return (
    <div>
      <Navbar /> {/* Add Navbar here, so it sits above the HeroSection */}
      <section id="home">
        <HeroSection />
      </section>
      <section id="about-us">
        <AboutUsSection />
      </section>
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="faq">
        <FAQSection />
      </section>
      <section id="contact-us">
        <ContactUsSection />
      </section>
    </div>
  );
};

export default App;
