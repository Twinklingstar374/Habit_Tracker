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
    const ref = doc(db, "habits", currentUser.uid, "userHabits", id);
    await deleteDoc(ref);
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
    <div className="habit-wrapper">
      <h2 className="hel">🧠 Habit Tracker</h2>

      {showDonePopup && (
        <div className="popup-success">✅ Habit marked as done for today!</div>
      )}

      <div className="add-habit-box">
        <h3>➕ Add a New Habit</h3>

        <input
          type="text"
          placeholder="e.g., Study"
          value={newHabit.name}
          onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
          className="habit-input"
        />

        <input
          type="date"
          value={newHabit.startDate}
          onChange={(e) =>
            setNewHabit({ ...newHabit, startDate: e.target.value })
          }
          className="habit-input"
        />

        <input
          type="text"
          placeholder="e.g., Study 5 hours daily"
          value={newHabit.goal}
          onChange={(e) => setNewHabit({ ...newHabit, goal: e.target.value })}
          className="habit-input"
        />

        <select
          value={newHabit.frequency}
          onChange={(e) =>
            setNewHabit({ ...newHabit, frequency: e.target.value })
          }
          className="habit-select"
        >
          <option value="daily">Daily</option>
          <option value="custom">Custom (Coming soon)</option>
        </select>

        <button className="submit-habit-btn" onClick={handleAddHabit}>
          Add Habit
        </button>
      </div>

      <div className="habit-cards">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`habit-card ${
              habit.status === "inactive" ? "inactive" : ""
            }`}
          >
            {editingId === habit.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editedHabit.name}
                  onChange={(e) =>
                    setEditedHabit({ ...editedHabit, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editedHabit.goal}
                  onChange={(e) =>
                    setEditedHabit({ ...editedHabit, goal: e.target.value })
                  }
                />
                <select
                  value={editedHabit.frequency}
                  onChange={(e) =>
                    setEditedHabit({
                      ...editedHabit,
                      frequency: e.target.value,
                    })
                  }
                >
                  <option value="daily">Daily</option>
                  <option value="custom">Custom</option>
                </select>
                <button onClick={saveEditedHabit}>💾 Save</button>
                <button onClick={() => setEditingId(null)}>❌ Cancel</button>
              </div>
            ) : (
              <>
                <h3>{habit.name}</h3>
                <p>🎯 {habit.goal}</p>
                <p>📅 Start: {habit.startDate}</p>
                <p>🔁 Frequency: {habit.frequency}</p>
                <p>🔥 Streak: {habit.streak || 0} day(s)</p>

                {habit.status === "active" && (
                  <div className="card-buttons">
                    <button
                      className="done-btn"
                      onClick={() =>
                        handleDoneHabit(
                          habit.id,
                          habit.streak || 0,
                          habit.lastMarkedDate || ""
                        )
                      }
                    >
                      ✅ Done for Today
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditHabit(habit)}
                    >
                      🖊 Edit
                    </button>
                    <button
                      className="fail-btn"
                      onClick={() => handleFailHabit(habit.id)}
                    >
                      ⚠️ Fail to Continue
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteHabit(habit.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                )}

                {habit.status === "inactive" && (
                  <div>
                    <p className="inactive-text">❌ Marked as Inactive</p>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteHabit(habit.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Habits;
