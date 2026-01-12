import React from 'react';
import './Contact.css';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Let’s Connect</h2>
          <p className="contact-desc">
            Have a suggestion, idea, or just want to say hello? We’d love to hear from you.
          </p>

          <div className="info-items">
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <span>support@TrackX.com</span>
            </div>
            <div className="info-item">
              <FaPhoneAlt className="info-icon" />
              <span>+91 8638033030</span>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <span>Newton School Of Technology, Delhi</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="contact-form-wrapper"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <input type="text" name="name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message <FaPaperPlane className="btn-icon" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;
