import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  FaBrain,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSave,
  FaCalendarAlt,
  FaBullseye,
  FaExclamationTriangle,
  FaFire,
  FaSync,
  FaEllipsisV,
  FaMedal
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import "./Habits.css";


const Habits = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({
    name: "",
    startDate: "",
    goal: "",
    frequency: "daily",
    status: "active",
  });

  const [editingId, setEditingId] = useState(null);
  const [editedHabit, setEditedHabit] = useState({
    name: "",
    goal: "",
    frequency: "daily",
  });

  const [showDonePopup, setShowDonePopup] = useState(false);

  // 🟡 1. Real-time fetch habits for logged-in user
  useEffect(() => {
    if (!currentUser) return;

    const userHabitRef = collection(db, "habits", currentUser.uid, "userHabits");

    const unsubscribe = onSnapshot(userHabitRef, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHabits(list);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 🟡 2. Add new habit with initial streak values
  const handleAddHabit = async () => {
    if (!newHabit.name.trim()) return;

    const userHabitRef = collection(db, "habits", currentUser.uid, "userHabits");

    await addDoc(userHabitRef, {
      ...newHabit,
      createdAt: serverTimestamp(),
      streak: 0,
      lastMarkedDate: "", // track when last marked
    });

    setNewHabit({
      name: "",
      startDate: "",
      goal: "",
      frequency: "daily",
      status: "active",
    });
  };

  // 🟡 3. Delete habit
  const handleDeleteHabit = async (id) => {
    if (window.confirm("Delete this habit?")) {
      const ref = doc(db, "habits", currentUser.uid, "userHabits", id);
      await deleteDoc(ref);
    }
  };

  // 🟡 4. Mark habit as failed
  const handleFailHabit = async (id) => {
    const ref = doc(db, "habits", currentUser.uid, "userHabits", id);
    await updateDoc(ref, { status: "inactive" });
  };

  // 🟡 5. Edit habit info
  const handleEditHabit = (habit) => {
    setEditingId(habit.id);
    setEditedHabit({
      name: habit.name,
      goal: habit.goal,
      frequency: habit.frequency,
    });
  };

  // 🟡 6. Save edited habit
  const saveEditedHabit = async () => {
    const ref = doc(db, "habits", currentUser.uid, "userHabits", editingId);
    await updateDoc(ref, {
      ...editedHabit,
    });

    setEditingId(null);
    setEditedHabit({ name: "", goal: "", frequency: "daily" });
  };

  // ✅ 7. Mark as done for today (streak +1 if not done today)
  const handleDoneHabit = async (habitId, currentStreak, lastMarkedDate) => {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    if (today === lastMarkedDate) {
      setShowDonePopup(true); // already done today
      setTimeout(() => setShowDonePopup(false), 2000);
      return;
    }

    const ref = doc(db, "habits", currentUser.uid, "userHabits", habitId);

    await updateDoc(ref, {
      streak: currentStreak + 1,
      lastMarkedDate: today,
    });

    setShowDonePopup(true);
    setTimeout(() => setShowDonePopup(false), 2000);
  };

  if (!currentUser) return <p>Loading your habits...</p>;

  return (
    <div className="habit-container">
      <div className="habit-header">
        <div className="header-left">
          <FaBrain className="header-icon" />
          <h2>Habits</h2>
        </div>
      </div>

      <AnimatePresence>
        {showDonePopup && (
          <motion.div
            className="popup-success"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <FaCheck /> Great job! Habit completed.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="habits-layout">
        {/* Add Habit Side (or Top) */}
        <motion.div
          className="add-habit-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3><FaPlus className="small-icon" /> New Routine</h3>
          <div className="add-habit-form">
            <input
              type="text"
              placeholder="Habit Name"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              className="modern-input"
            />
            <input
              type="text"
              placeholder="Goal (e.g. 30 mins)"
              value={newHabit.goal}
              onChange={(e) => setNewHabit({ ...newHabit, goal: e.target.value })}
              className="modern-input"
            />
            <div className="row-inputs">
              <input
                type="date"
                value={newHabit.startDate}
                onChange={(e) =>
                  setNewHabit({ ...newHabit, startDate: e.target.value })
                }
                className="modern-input"
              />
              <select
                value={newHabit.frequency}
                onChange={(e) =>
                  setNewHabit({ ...newHabit, frequency: e.target.value })
                }
                className="modern-select"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <button className="create-habit-btn" onClick={handleAddHabit}>
              Start Journey
            </button>
          </div>
        </motion.div>

        <div className="habits-list-section">
          <AnimatePresence mode="popLayout">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`modern-habit-card ${habit.status === 'inactive' ? 'inactive' : ''}`}
              >
                {editingId === habit.id ? (
                  <div className="edit-mode-inline">
                    <input
                      value={editedHabit.name}
                      onChange={(e) => setEditedHabit({ ...editedHabit, name: e.target.value })}
                      className="modern-input compact"
                    />
                    <div className="edit-actions">
                      <button onClick={saveEditedHabit} className="save-btn-sm"><FaCheck /></button>
                      <button onClick={() => setEditingId(null)} className="cancel-btn-sm"><FaTimes /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="card-left">
                      <div className="icon-box">
                        <FaMedal />
                      </div>
                      <div className="habit-info">
                        <h3>{habit.name}</h3>
                        <span className="habit-goal">{habit.goal} • {habit.frequency}</span>
                      </div>
                    </div>

                    <div className="card-right">
                      <div className="streak-display">
                        <FaFire className={habit.streak > 0 ? "lit" : ""} />
                        <span>{habit.streak}</span>
                      </div>

                      {habit.status === 'active' && (
                        <button
                          className="check-in-btn"
                          onClick={() => handleDoneHabit(habit.id, habit.streak || 0, habit.lastMarkedDate || "")}
                          title="Mark Done"
                        >
                          <FaCheck />
                        </button>
                      )}

                      <div className="menu-actions">
                        <button className="menu-btn" onClick={() => handleEditHabit(habit)}><FaEdit /></button>
                        <button className="menu-btn delete" onClick={() => handleDeleteHabit(habit.id)}><FaTrash /></button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {habits.length === 0 && (
            <div className="empty-habits">
              <p>No habits yet. Define your goals!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Habits;
