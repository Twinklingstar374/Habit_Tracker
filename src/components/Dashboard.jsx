import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Habits from "./Habits";
import Notes from "./Notes";
import Todo from "./Todo";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tab, onTabChange] = useState("home");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">TrackX</h2>
        <ul className="sidebar-links">
          <li onClick={() => onTabChange("home")}>🏠 Home</li>
          <li onClick={() => onTabChange("habits")}>✅ Habits</li>
          <li onClick={() => onTabChange("notes")}>📝 Notes</li>
          <li onClick={() => onTabChange("todo")}>📋 To-Do</li>
          <li onClick={() => onTabChange("music")}>🎧 Focus Music</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {tab === "home" && (
          <div className="dashboard">
            <h1>✨ Welcome back!</h1>
            <p className="motivation">“Small steps every day lead to big results.” 💪</p>

            <div className="dashboard-grid">
              <div className="card streaks-card">
                <h3>🔥 Current Streak</h3>
                <p>3 Days Continuous</p>
              </div>

              <div className="card todo-card">
                <h3>📋 To-Do Summary</h3>
                <p>5 Tasks Total</p>
                <p>2 Completed</p>
                <p>3 Pending</p>
              </div>

              <div className="card notes-card">
                <h3>📝 Notes</h3>
                <p>Latest: “Focus Goals for July”</p>
              </div>

              <div className="card habits-card">
                <h3>✅ Recent Habit</h3>
                <p>Meditation — 2 Day Streak</p>
              </div>

              <div className="card music-card">
                <h3>🎧 Focus Music</h3>
                <p>Lo-fi Chill Beats</p>
                <button className="music-btn">▶️ Play</button>
              </div>
            </div>
          </div>
        )}

        {tab === "habits" && <Habits />}
        {tab === "notes" && <Notes />}
        {tab === "todo" && <Todo />}
        {tab === "music" && (
          <div className="music-section">
            <h2>🎶 Focus Music</h2>
            <p>This is where your music player will go.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
