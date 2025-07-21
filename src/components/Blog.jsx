import React from 'react';
import "./Blog.css"; 

const Blog = () => {
  return (
    <section id="blog">
        <h2><span className="underline">User Stories</span></h2>
      <div className="stories">
        
        <div className="story">
          <h3>Meet Priya!</h3>
          <p>"TrackX helped me organize my daily tasks and manage my time effectively. With the Todo List and Calendar features, I’ve been able to prioritize better and feel less overwhelmed at the end of the day."</p>
        </div>
        
        <div className="story">
          <h3>Meet Arjun!</h3>
          <p>"As someone who struggles with consistency, TrackX's Habit Tracker has been a game-changer. I’ve stuck to my fitness goals for 3 weeks straight, and the progress I’ve made is incredible. It keeps me accountable every day!"</p>
        </div>
        
        <div className="story">
          <h3>Meet Maya!</h3>
          <p>"Journaling has always been difficult for me, but with TrackX’s Note-Taking feature, I can easily capture my thoughts and ideas. It’s helped me stay focused and motivated on my personal development journey."</p>
        </div>
        
        <div className="story">
          <h3>Meet Raj!</h3>
          <p>"TrackX’s seamless integration of tasks, calendar, and notes in one app has truly transformed how I work. It’s helped me manage both personal and professional commitments in a simple, intuitive way."</p>
        </div>
      </div>
      
      <div className="call">
        <p>Do you have a story to share about how TrackX has helped you? Let us know, and your testimonial could be featured next!</p>
      </div>
    </section>
  );
};

export default Blog;
