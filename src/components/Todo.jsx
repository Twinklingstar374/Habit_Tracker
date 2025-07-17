// Todo.jsx
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import "./Todo.css";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
    priority: "Medium",
  });

  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState({
    title: "",
    deadline: "",
    priority: "Medium",
  });

  const fetchTasks = async () => {
    const snapshot = await getDocs(collection(db, "todos"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTasks(list);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    await addDoc(collection(db, "todos"), {
      ...newTask,
      completed: false,
      createdAt: serverTimestamp(),
    });

    setNewTask({ title: "", deadline: "", priority: "Medium" });
    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    fetchTasks();
  };

  const handleToggleComplete = async (task) => {
    const ref = doc(db, "todos", task.id);
    await updateDoc(ref, { completed: !task.completed });
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditingId(task.id);
    setEditedTask({
      title: task.title,
      deadline: task.deadline,
      priority: task.priority,
    });
  };

  const saveEditedTask = async () => {
    const ref = doc(db, "todos", editingId);
    await updateDoc(ref, { ...editedTask });
    setEditingId(null);
    setEditedTask({ title: "", deadline: "", priority: "Medium" });
    fetchTasks();
  };

  return (
    <div className="todo-wrapper">
      <h2>📋 To-Do List</h2>

      <div className="add-task-box">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="task-input"
        />
        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          className="task-input"
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          className="task-select"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button className="submit-task-btn" onClick={handleAddTask}>
          ➕ Add Task
        </button>
      </div>

      <div className="task-cards">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${task.completed ? "completed" : ""}`}
          >
            {editingId === task.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, title: e.target.value })
                  }
                />
                <input
                  type="date"
                  value={editedTask.deadline}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, deadline: e.target.value })
                  }
                />
                <select
                  value={editedTask.priority}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, priority: e.target.value })
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <div className="card-buttons">
                  <button onClick={saveEditedTask}>💾 Save</button>
                  <button onClick={() => setEditingId(null)}>❌ Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>📅 Deadline: {task.deadline}</p>
                  <p>⚡ Priority: {task.priority}</p>
                </div>
                <div className="card-buttons">
                  <button onClick={() => handleToggleComplete(task)}>
                    {task.completed ? "✅ Mark Incomplete" : "✅ Mark Complete"}
                  </button>
                  <button onClick={() => handleEditTask(task)}>🖊 Edit</button>
                  <button onClick={() => handleDeleteTask(task.id)}>🗑 Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
