import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <section className="contact">
      <div className="container">
        <h2>Let’s Connect</h2>
        <p>
          Have a suggestion, idea, or just want to say hello? We’d love to hear from you.
        </p>

        <form
          className="contact-form"
        >
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
