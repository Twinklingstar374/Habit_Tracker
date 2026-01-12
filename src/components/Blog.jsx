import React from 'react';
import "./Blog.css";
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaUserCircle } from 'react-icons/fa';

const Blog = () => {
  const stories = [
    {
      name: "Priya",
      text: "TrackX helped me organize my daily tasks and manage my time effectively. With the Todo List and Calendar features, I’ve been able to prioritize better and feel less overwhelmed at the end of the day."
    },
    {
      name: "Arjun",
      text: "As someone who struggles with consistency, TrackX's Habit Tracker has been a game-changer. I’ve stuck to my fitness goals for 3 weeks straight, and the progress I’ve made is incredible. It keeps me accountable every day!"
    },
    {
      name: "Maya",
      text: "Journaling has always been difficult for me, but with TrackX’s Note-Taking feature, I can easily capture my thoughts and ideas. It’s helped me stay focused and motivated on my personal development journey."
    },
    {
      name: "Raj",
      text: "TrackX’s seamless integration of tasks, calendar, and notes in one app has truly transformed how I work. It’s helped me manage both personal and professional commitments in a simple, intuitive way."
    }
  ];

  return (
    <section id="blog" className="blog-section">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title"
      >
        <span className="underline">User Stories</span>
      </motion.h2>

      <div className="stories-container">
        <motion.div
          className="stories-track"
          animate={{
            x: [0, -1760], /* Approx (400px card + 40px gap) * 4 cards */
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {/* Duplicate stories to create infinite loop effect */}
          {[...stories, ...stories].map((story, index) => (
            <div key={index} className="story-card">
              <div className="quote-icon"><FaQuoteLeft /></div>
              <p className="story-text">"{story.text}"</p>
              <div className="story-user">
                <FaUserCircle className="user-icon" />
                <h3 className="user-name">Meet {story.name}!</h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="call-to-action"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>Do you have a story to share about how TrackX has helped you? Let us know, and your testimonial could be featured next!</p>
      </motion.div>
    </section>
  );
};

export default Blog;
