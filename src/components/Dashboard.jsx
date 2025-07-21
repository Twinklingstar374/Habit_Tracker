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
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tab, onTabChange] = useState("home");
  const [userId, setUserId] = useState(null);
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0 });
  const [latestNote, setLatestNote] = useState("");
  const [habitList, setHabitList] = useState([]);

  // ✅ Auth check
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

  // ✅ Main data fetch
  useEffect(() => {
    if (!userId) return;

    // --- Realtime To-Do stats ---
    const todosRef = collection(db, "todos", userId, "userTodos");
    const unsubscribeTodos = onSnapshot(todosRef, (snapshot) => {
      let total = 0;
      let completed = 0;
      snapshot.forEach((doc) => {
        total++;
        if (doc.data().completed) completed++;
      });
      setTodoStats({ total, completed });
    });

    // --- Realtime Habits ---
    const unsubscribeHabit = listenToAllHabits(userId);

    // --- Realtime Notes ---
    const unsubscribeNote = listenToLatestNote(userId);

    return () => {
      unsubscribeTodos();
      unsubscribeHabit?.();
      unsubscribeNote?.();
    };
  }, [userId]);

  // ✅ Real-time Notes fetch
  const listenToLatestNote = (uid) => {
    const notesRef = collection(db, "notes");
    const q = query(notesRef, where("userId", "==", uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setLatestNote("");
        return;
      }

      const sorted = snapshot.docs.sort(
        (a, b) =>
          (b.data().createdAt?.seconds || 0) -
          (a.data().createdAt?.seconds || 0)
      );

      setLatestNote(sorted[0].data().title || "Untitled Note");
    });

    return unsubscribe;
  };

  // ✅ Real-time Habit Streak fetch (all habits)
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
            <p className="motivation">
              “Small steps every day lead to big results.” 💪
            </p>

            <div className="dashboard-grid">
              {/* 🔥 Streak Card */}
              <div className="card streaks-card">
                <h3>🔥 Habit Streaks</h3>
                {habitList.length === 0 ? (
                  <p>No active habits yet</p>
                ) : (
                  habitList.map((habit) => (
                    <p key={habit.id}>
                      <strong>{habit.name}</strong> — {habit.streak || 0} Day Streak
                    </p>
                  ))
                )}
              </div>

              {/* 📋 To-Do Card */}
              <div className="card todo-card">
                <h3>📋 To-Do Summary</h3>
                <p>{todoStats.total} Tasks Total</p>
                <p>{todoStats.completed} Completed</p>
                <p>{todoStats.total - todoStats.completed} Pending</p>
              </div>

              {/* 📝 Notes Card */}
              <div className="card notes-card">
                <h3>📝 Notes</h3>
                <p>Latest: “{latestNote || "No notes yet"}”</p>
              </div>

              {/* 🎧 Focus Music */}
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
