import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";
import Bgvideo from "./assets/106076-671593547.mp4";
import SecondVideo from "./assets/27770-365891067.mp4";
import todo from "./assets/to.png"
import calender from "./assets/cal (1).mp4"
import Blog from "./Blog"
import Contact from "./Contact"
import habit from "./assets/habit.png"
import notes from "./assets/notes.png"
import { motion } from 'framer-motion';
import {
  FaCheckDouble,
  FaCalendarAlt,
  FaStickyNote,
  FaWalking,
  FaArrowRight,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaRocket
} from 'react-icons/fa';


const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } }
  };

  return (

    <>
      <div className="landing">

        <video autoPlay loop muted className="bgvideo">
          <source src={Bgvideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="overlay">


          {/* {navbar} */}
          <nav className="navbar">
            <div className="logo">
              <FaRocket className="logo-icon" />
              <span>TrackX</span>
            </div>

            {/* Hamburger icon */}
            <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className={`bar ${isMenuOpen ? "open" : ""}`} />
              <div className={`bar ${isMenuOpen ? "open" : ""}`} />
              <div className={`bar ${isMenuOpen ? "open" : ""}`} />
            </div>

            {/* Links */}
            <div className={`links ${isMenuOpen ? "show" : ""}`}>
              <a href="#about" className="link" onClick={() => setIsMenuOpen(false)}>About</a>
              <a href="#features" className="link" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#blog" className="link" onClick={() => setIsMenuOpen(false)}>Blog</a>
              <a href="#contact" className="link" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </div>

            {/* Buttons */}
            <div className="buttons">
              <button className="btn" onClick={() => navigate("/login")}>Login</button>
              <button className="btn" onClick={() => navigate("/signup")}>Signup</button>
            </div>
          </nav>


          {/* hero content */}
          <div className="hero">
            <h1>Track Your Life</h1>
            <p>Habits. Notes. Reflections — All in one place.</p>
            <button className='btn' onClick={() => navigate("/signup")}>Get Started</button>
          </div>
        </div>
      </div>


      <section id="features">
        <h2>Smart Features</h2>

        <div className="features-grid">
          {/* Todo List Card */}
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={todo} alt="Todo List" />
              </div>
              <div className="flip-card-back">
                <h2>Task Management</h2>
                <h1>Elevate Your Productivity</h1>
                <p>Conquer your goals with an intuitive task system. Organize, prioritize, and execute your daily workflow with absolute clarity and focus.</p>
              </div>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="flip-card calendar-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <video autoPlay loop muted playsInline>
                  <source src={calender} type="video/mp4" />
                </video>
              </div>
              <div className="flip-card-back">
                <h2>Interactive Calendar</h2>
                <h1>Visualize Your Journey</h1>
                <p>Move beyond static scheduling. Interact with a dynamic timeline designed to track your evolution and master your personal routine.</p>
              </div>
            </div>
          </div>

          {/* Note-Taking Card */}
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={notes} alt="Note-Taking" />
              </div>
              <div className="flip-card-back">
                <h2>Smart Notes</h2>
                <h1>Capture Every Insight</h1>
                <p>Transform fleeting thoughts into organized knowledge. Store your brainstorms in a centralized, distractions-free workspace built for creativity.</p>
              </div>
            </div>
          </div>

          {/* Habit Tracker Card */}
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={habit} alt="Habit Tracker" />
              </div>
              <div className="flip-card-back">
                <h2>Habit Mastery</h2>
                <h1>Architect Your Future</h1>
                <p>Turn small daily actions into massive long-term results. Our behavioral tracking system helps you architect the discipline required for success.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* {abou section} */}
      <section id="about" className="second-video1">
        <video autoPlay loop muted className="second-video">
          <source src={SecondVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="about-overlay">
          <h1 className="underline">Why choose TrackX?</h1>
          <p>
            TrackX is your all-in-one productivity companion, crafted to simplify your daily life. Whether you're managing tasks, building habits, journaling thoughts, or organizing events — TrackX brings it all together in a single sleek dashboard.
            Designed for the modern mind, it combines functionality with minimal design to help you focus, reflect, and grow every day.
          </p>
          <p className='acc'>
            Already have an account?
            <button className="login-btn" onClick={() => navigate("/login")}>Log in</button>
          </p>
        </div>
      </section>

      {/* {blog section} */}
      <section id="blog"><Blog /></section>

      {/* {contact section} */}
      <section id="contact"><Contact /></section>

      {/* { footer section} */}
      <footer className="footer">
        <div className="footerin">
          <div className="footer-section newsletter">
            <h3>Newsletter</h3>
            <p>Get productivity tips and updates delivered straight to your inbox.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">Subscribe</button>
            </form>
          </div>

          <div className="footer-section contact-info-footer">
            <h3>Contact Us</h3>
            <div className="footer-contact-item">
              <FaEnvelope className="footer-icon" />
              <a href="mailto:support@TrackX.com">support@TrackX.com</a>
            </div>
            <div className="footer-contact-item">
              <FaPhoneAlt className="footer-icon" />
              <a href="tel:+918638033030">+91 8638033030</a>
            </div>
            <div className="footer-contact-item">
              <FaMapMarkerAlt className="footer-icon" />
              <span>Delhi, India</span>
            </div>
          </div>

          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links-footer">
              <a href="https://twitter.com/yourproject">Twitter</a>
              <a href="https://facebook.com/yourproject">Facebook</a>
              <a href="https://instagram.com/yourproject">Instagram</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 TrackX. Developed with Passion.</p>
        </div>
      </footer>

    </>
  );
};

export default LandingPage;
