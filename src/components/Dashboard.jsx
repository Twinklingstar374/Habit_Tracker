import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Habits from "./Habits";
import Notes from "./Notes";
import Todo from "./Todo";
import CalendarView from "./Calendar";
import Analytics from "./Analytics";
import Settings from "./Settings";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaCheckCircle,
  FaStickyNote,
  FaListUl,
  FaFire,
  FaSignOutAlt,
  FaRocket,
  FaQuoteLeft,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
  FaSmile,
  FaMeh,
  FaFrown,
  FaCloudSun,
  FaBolt,
  FaLightbulb
} from 'react-icons/fa';
import FocusTimer from "./FocusTimer";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tab, onTabChange] = useState("home");
  const [userId, setUserId] = useState(null);
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0 });
  const [habitList, setHabitList] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activityData, setActivityData] = useState([
    { name: 'Mon', val: 0 },
    { name: 'Tue', val: 0 },
    { name: 'Wed', val: 0 },
    { name: 'Thu', val: 0 },
    { name: 'Fri', val: 0 },
    { name: 'Sat', val: 0 },
    { name: 'Sun', val: 0 },
  ]);

  // Mood Tracker State
  const [currentMood, setCurrentMood] = useState(null);
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, [navigate]);


  useEffect(() => {
    if (!userId) return;

    // --- Realtime To-Do stats ---
    const todosRef = collection(db, "todos", userId, "userTodos");
    const unsubscribeTodos = onSnapshot(todosRef, (snapshot) => {
      let total = 0;
      let completed = 0;
      const weekActivity = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat

      snapshot.forEach((doc) => {
        total++;
        const data = doc.data();
        if (data.completed) {
          completed++;
          // Track completion by day of week
          if (data.completedAt?.toDate) {
            const completedDate = data.completedAt.toDate();
            const dayOfWeek = completedDate.getDay(); // 0=Sun, 6=Sat
            weekActivity[dayOfWeek]++;
          }
        }
      });
      setTodoStats({ total, completed });

      // Update activity chart (reorder to Mon-Sun)
      setActivityData([
        { name: 'Mon', val: weekActivity[1] },
        { name: 'Tue', val: weekActivity[2] },
        { name: 'Wed', val: weekActivity[3] },
        { name: 'Thu', val: weekActivity[4] },
        { name: 'Fri', val: weekActivity[5] },
        { name: 'Sat', val: weekActivity[6] },
        { name: 'Sun', val: weekActivity[0] },
      ]);
    });

    const unsubscribeHabit = listenToAllHabits(userId);

    return () => {
      unsubscribeTodos();
      unsubscribeHabit?.();
    };
  }, [userId]);




  const listenToAllHabits = (uid) => {
    const habitsRef = collection(db, "habits", uid, "userHabits");

    const unsubscribe = onSnapshot(habitsRef, (snapshot) => {
      const activeHabits = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((habit) => habit.status === "active");

      setHabitList(activeHabits);
    });

    return unsubscribe;
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    // Simple suggestion logic (could be AI based later)
    let text = "";
    switch (mood) {
      case 'happy':
        text = "Great to hear! Keep the momentum going. Maybe tackle that big project while your energy is high? 🚀";
        break;
      case 'neutral':
        text = "Feeling balanced is good. Why not try a quick journaling session to clarify your thoughts? 📝";
        break;
      case 'stressed':
        text = "Take a deep breath. A 5-minute walk or meditation might be exactly what you need right now. 🌿";
        break;
      case 'tired':
        text = "Listen to your body. Rest is productive too. Maybe just do one small task and call it a win? ☕";
        break;
      default:
        text = "Stay consistent!";
    }
    setSuggestion(text);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <>
              <FaRocket className="sidebar-logo-icon" />
              <h2 className="sidebar-logo-text">TrackX</h2>
            </>
          )}
        </div>

        {/* User Profile Section */}
        <div className={`sidebar-profile ${sidebarCollapsed ? 'collapsed' : ''}`}>
          {auth.currentUser?.photoURL ? (
            <img src={auth.currentUser.photoURL} alt="Profile" className="profile-img" />
          ) : (
            <div className="profile-placeholder">{auth.currentUser?.displayName?.charAt(0) || "U"}</div>
          )}
          {!sidebarCollapsed && (
            <div className="profile-info">
              <p className="profile-name">{auth.currentUser?.displayName || "User"}</p>
              <p className="profile-email">{auth.currentUser?.email}</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${tab === "home" ? "active" : ""}`}
            onClick={() => onTabChange("home")}
            title="Home"
          >
            <FaHome /> {!sidebarCollapsed && <span>Home</span>}
          </button>
          <button
            className={`nav-item ${tab === "habits" ? "active" : ""}`}
            onClick={() => onTabChange("habits")}
            title="Habits"
          >
            <FaCheckCircle /> {!sidebarCollapsed && <span>Habits</span>}
          </button>
          <button
            className={`nav-item ${tab === "notes" ? "active" : ""}`}
            onClick={() => onTabChange("notes")}
            title="Notes"
          >
            <FaStickyNote /> {!sidebarCollapsed && <span>Notes</span>}
          </button>
          <button
            className={`nav-item ${tab === "todo" ? "active" : ""}`}
            onClick={() => onTabChange("todo")}
            title="To-Do"
          >
            <FaListUl /> {!sidebarCollapsed && <span>To-Do</span>}
          </button>
          <button
            className={`nav-item ${tab === "calendar" ? "active" : ""}`}
            onClick={() => onTabChange("calendar")}
            title="Calendar"
          >
            <FaCalendarAlt /> {!sidebarCollapsed && <span>Calendar</span>}
          </button>
          <button
            className={`nav-item ${tab === "analytics" ? "active" : ""}`}
            onClick={() => onTabChange("analytics")}
            title="Analytics"
          >
            <FaChartLine /> {!sidebarCollapsed && <span>Analytics</span>}
          </button>
          <button
            className={`nav-item ${tab === "settings" ? "active" : ""}`}
            onClick={() => onTabChange("settings")}
            title="Settings"
          >
            <FaCog /> {!sidebarCollapsed && <span>Settings</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <FaSignOutAlt /> {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {tab === "home" && (
          <div className="home-content">
            <header className="home-header glass-header">
              <div className="welcome-section">
                <h1>Hello, {auth.currentUser?.displayName?.split(" ")[0] || "Friend"}! 👋</h1>
                <p className="welcome-subtitle">Here is your daily overview.</p>
              </div>
              <div className="quote-box">
                <FaQuoteLeft className="quote-icon" />
                <p>“Small steps every day lead to big results.”</p>
              </div>
            </header>

            {/* MOOD TRACKER SECTION */}
            <motion.div
              className="mood-tracker-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3>How are you feeling today?</h3>
              <div className="mood-buttons">
                <button
                  className={`mood-btn ${currentMood === 'happy' ? 'active happy' : ''}`}
                  onClick={() => handleMoodSelect('happy')}
                >
                  <FaSmile /> <span>Great</span>
                </button>
                <button
                  className={`mood-btn ${currentMood === 'neutral' ? 'active neutral' : ''}`}
                  onClick={() => handleMoodSelect('neutral')}
                >
                  <FaMeh /> <span>Okay</span>
                </button>
                <button
                  className={`mood-btn ${currentMood === 'stressed' ? 'active stressed' : ''}`}
                  onClick={() => handleMoodSelect('stressed')}
                >
                  <FaBolt /> <span>Stressed</span>
                </button>
                <button
                  className={`mood-btn ${currentMood === 'tired' ? 'active tired' : ''}`}
                  onClick={() => handleMoodSelect('tired')}
                >
                  <FaCloudSun /> <span>Tired</span>
                </button>
              </div>

              <AnimatePresence>
                {suggestion && (
                  <motion.div
                    className="smart-suggestion-card"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="suggestion-icon"><FaLightbulb /></div>
                    <div className="suggestion-text">
                      <h4>Suggestion for you</h4>
                      <p>{suggestion}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="stats-grid">
              {/* Progress Chart */}
              <div className="stat-card chart-stat">
                <h3>Task Progress</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Done", value: todoStats.completed },
                          { name: "Pending", value: todoStats.total - todoStats.completed || 1 },
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="var(--accent-primary)" />
                        <Cell fill="rgba(255, 255, 255, 0.05)" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="chart-center-label">
                    <span className="percentage">
                      {todoStats.total > 0
                        ? Math.round((todoStats.completed / todoStats.total) * 100)
                        : 0}%
                    </span>
                    <span className="label">Tasks</span>
                  </div>
                </div>
              </div>

              {/* Streak Stat */}
              <div className="stat-card streak-stat">
                <div className="card-header-with-icon">
                  <div className="card-icon-wrapper">
                    <FaFire className="card-icon" />
                  </div>
                  <h3>Habit Streaks</h3>
                </div>
                {habitList.length === 0 ? (
                  <p className="no-data">No active habits</p>
                ) : (
                  <div className="streak-list">
                    {habitList.slice(0, 3).map((habit) => (
                      <div key={habit.id} className="streak-item-detailed">
                        <div className="streak-info">
                          <span>{habit.name}</span>
                          <span className="count">{habit.streak || 0}d</span>
                        </div>
                        <div className="progress-bar-bg">
                          <motion.div
                            className="progress-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((habit.streak / 30) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity Stat */}
              <div className="stat-card activity-stat">
                <div className="card-header-with-icon">
                  <div className="card-icon-wrapper">
                    <FaChartLine className="card-icon" />
                  </div>
                  <h3>Weekly Activity</h3>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={activityData}>
                      <Bar dataKey="val" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                      <XAxis dataKey="name" hide />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>


          </div>
        )}

        {tab === "habits" && <Habits />}
        {tab === "notes" && <Notes />}
        {tab === "todo" && <Todo />}
        {tab === "calendar" && <CalendarView />}
        {tab === "analytics" && <Analytics />}
        {tab === "settings" && <Settings />}
      </main>
      <FocusTimer />
    </div>
  );
};

export default Dashboard;
