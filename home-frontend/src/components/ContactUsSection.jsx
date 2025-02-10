import React, { useState } from "react";
import "../styles/contact.css";

const ContactUsSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <section id="contact">
      <h2>Contact Us</h2>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isFormValid}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isFormValid}
          />
        </label>
        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            disabled={!isFormValid}
          />
        </label>
        <button type="submit" disabled={!isFormValid}>
          Submit
        </button>
      </form>
    </section>
  );
};

export default ContactUsSection;
