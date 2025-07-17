import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./Habits.css";

const Habits = () => {
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

  const fetchHabits = async () => {
    const snapshot = await getDocs(collection(db, "habits"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setHabits(list);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleAddHabit = async () => {
    if (!newHabit.name.trim()) return;

    await addDoc(collection(db, "habits"), {
      ...newHabit,
      createdAt: new Date().toISOString(),
    });

    setNewHabit({
      name: "",
      startDate: "",
      goal: "",
      frequency: "daily",
      status: "active",
    });

    fetchHabits();
  };

  const handleDeleteHabit = async (id) => {
    await deleteDoc(doc(db, "habits", id));
    fetchHabits();
  };

  const handleFailHabit = async (id) => {
    const ref = doc(db, "habits", id);
    await updateDoc(ref, { status: "inactive" });
    fetchHabits();
  };

  const handleEditHabit = (habit) => {
    setEditingId(habit.id);
    setEditedHabit({
      name: habit.name,
      goal: habit.goal,
      frequency: habit.frequency,
    });
  };

  const saveEditedHabit = async () => {
    const ref = doc(db, "habits", editingId);
    await updateDoc(ref, {
      name: editedHabit.name,
      goal: editedHabit.goal,
      frequency: editedHabit.frequency,
    });

    setEditingId(null);
    setEditedHabit({ name: "", goal: "", frequency: "daily" });
    fetchHabits();
  };

  const handleDoneHabit = () => {
    setShowDonePopup(true);
    setTimeout(() => setShowDonePopup(false), 2000);
  };

  return (
    <div className="habit-wrapper">
      <h2>🧠 Habit Tracker</h2>

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

                {habit.status === "active" && (
                  <div className="card-buttons">
                    <button className="done-btn" onClick={handleDoneHabit}>
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
