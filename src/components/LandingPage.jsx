import React,{ useState } from 'react';
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


const LandingPage = () => {
const navigate = useNavigate();
const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="logo">TrackX</div>

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


      {/* Features section*/}

      <section id="features">
        
      <div className="spacer-section">
        <div className="content-left">
          <div className="glow-box">
            <h2>Todo List</h2>
            <h1>Organize everything in your life</h1>
            <p>Whether it's work projects, personal tasks, or study plans, TrackX helps you organize and confidently tackle everything in your life.</p>
          </div>
        </div>
        <div className="myimage">
          <img src={todo} alt="imag" className="todo" />
        </div>
      </div>


      <div className="spacer-section">
      <div className="myimage">
      <video autoPlay loop muted className="calender">
                <source src={calender} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
      </div>
      <div className="content-right">
        <div className="glow-box">
          <h2>Calender</h2>
          <h1>Master Your Routine, Transform Your Life</h1>
          <p>Interact with your calendar seamlessly—click, tap, or hover to instantly track, update, and visualize your habit progress in an engaging, dynamic way!</p>
        </div>
      </div>
      </div>
      </section>


    <div className="spacer-section">
      <div className="content-left">
        <div className="glow-box">
          <h2>Note-Taking</h2>
          <h1>Capture Your Thoughts, Organize Your Ideas</h1>
          <p>Never lose track of your brilliant ideas again! Whether it’s for work, study, or personal projects, our note-taking feature helps you stay organized, focused, and efficient.</p>
        </div>
      </div>
      {<div className="myimage">
        <img src={notes} alt="imag" className="todo" />
      </div> }
    </div>

     
    <div className="spacer-section">
    {<div className="myimage">
        <img src={habit} alt="imag" className="todo" />
      </div> }
      <div className="content-right">
        <div className="glow-box">
          <h2>Habit Tracker</h2>
          <h1>Build Better Habits, One Day at a Time</h1>
          <p>Take control of your daily routines with our intuitive habit tracker. Whether you’re working towards fitness goals, personal development, or simply building a more productive day, this tool helps you stay on track and accountable.</p>
        </div>
      </div>
    </div>
    

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
  <section id="blog"><Blog/></section>

  {/* {contact section} */}
  <section id="contact"><Contact/></section>

  {/* { footer section} */}
  <footer className="footer">
  <div className="footerin">

    <div className="footer-section newsletter">
      <h3>Subscribe to our Newsletter</h3>
      <p>Get productivity tips and updates delivered straight to your inbox.</p>
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Enter your email"
          className="input"
          required
        />
        <button type="submit" className="newsletter-button">Subscribe</button>
      </form>
    </div>

    <div className="footer-section contact">
      <h3>Contact Us</h3>
      <p>Email: <a href="mailto:support@yourproject.com" className="footer-link">support@TrackX.com</a></p>
      <p>Phone: <a href="tel:+1234567890" className="footer-link">+91 8638033030</a></p>
      <p>Address: Newton School Of Technology, Delhi</p>
    </div>

    <div className="footer-section">
      <h3>Follow Us</h3>
      <div className="social">
        <a href="https://twitter.com/yourproject" >Twitter</a>
        <a href="https://facebook.com/yourproject" >Facebook</a>
        <a href="https://instagram.com/yourproject" >Instagram</a>
      </div>
    </div>

  </div>

  <div className="bottom">
    <p>© 2025 TrackX. All rights reserved.</p>
  </div>
</footer>

    </>
  );
};

export default LandingPage;
