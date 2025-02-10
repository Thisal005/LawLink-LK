import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import "../styles/Navbar.css";
import logo from "../assets/logo1.png"; // Ensure the path to logo is correct

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Handle scroll event to shrink navbar and highlight active section
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true); // Shrink the navbar when scrolling past 50px
    } else {
      setIsScrolled(false); // Reset the navbar when scrolling back to the top
    }

    // Check which section is currently in view
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 0 && rect.bottom >= 0) {
        setActiveSection(section.id); // Set active section based on scroll position
      }
    });
  };

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <img src={logo} alt="LawLink Logo" />
      </div>
      <ul className="nav-links">
        <li>
          <Link
            to="home"
            smooth={true}
            duration={500}
            onClick={() => setActiveSection("home")}
            className={activeSection === "home" ? "active" : ""}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="about-us"
            smooth={true}
            duration={500}
            onClick={() => setActiveSection("about-us")}
            className={activeSection === "about-us" ? "active" : ""}
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            to="features"
            smooth={true}
            duration={500}
            onClick={() => setActiveSection("features")}
            className={activeSection === "features" ? "active" : ""}
          >
            Features
          </Link>
        </li>
        <li>
          <Link
            to="faq"
            smooth={true}
            duration={500}
            onClick={() => setActiveSection("faq")}
            className={activeSection === "faq" ? "active" : ""}
          >
            FAQ
          </Link>
        </li>
        <li>
          <Link
            to="contact-us"
            smooth={true}
            duration={500}
            onClick={() => setActiveSection("contact-us")}
            className={activeSection === "contact-us" ? "active" : ""}
          >
            Contact Us
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
