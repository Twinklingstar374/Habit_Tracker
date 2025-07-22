// Todo.jsx
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./Todo.css";

const Todo = () => {
  const { currentUser } = useAuth();
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

  useEffect(() => {
    const userTodoRef = collection(db, "todos", currentUser.uid, "userTodos");
    const unsubscribe = onSnapshot(userTodoRef, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(list);
    });

    return () => unsubscribe();
  }, [currentUser]);


  if (!currentUser) return <p>Loading your tasks...</p>;

  
 

  
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    const userTodoRef = collection(db, "todos", currentUser.uid, "userTodos");
    await addDoc(userTodoRef, {
      ...newTask,
      completed: false,
      createdAt: serverTimestamp(),
    });

    setNewTask({ title: "", deadline: "", priority: "Medium" });
  };


  const handleDeleteTask = async (id) => {
    const ref = doc(db, "todos", currentUser.uid, "userTodos", id);
    await deleteDoc(ref);
  };


  const handleToggleComplete = async (task) => {
    const ref = doc(db, "todos", currentUser.uid, "userTodos", task.id);
    await updateDoc(ref, { completed: !task.completed });
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
    const ref = doc(db, "todos", currentUser.uid, "userTodos", editingId);
    await updateDoc(ref, { ...editedTask });
    setEditingId(null);
    setEditedTask({ title: "", deadline: "", priority: "Medium" });
  };

  return (
    <div className="todo-wrapper">
      <h2>📋 To-Do List</h2>

      <div className="add-task-box">
        <label htmlFor="taskTitle">Task Title</label>
        <input
          id="taskTitle"
          type="text"
          placeholder="e.g., Study React Hooks"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="task-input"
        />

        <label htmlFor="deadline">Deadline</label>
        <input
          id="deadline"
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          className="task-input"
        />

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          className="task-select"
        >
          <option value="High">🔥 High</option>
          <option value="Medium">🌤 Medium</option>
          <option value="Low">🍃 Low</option>
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
                    setEditedTask({
                      ...editedTask,
                      deadline: e.target.value,
                    })
                  }
                />
                <select
                  value={editedTask.priority}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="High">🔥 High</option>
                  <option value="Medium">🌤 Medium</option>
                  <option value="Low">🍃 Low</option>
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
                    {task.completed
                      ? "↩️ Mark Incomplete"
                      : "✅ Mark Complete"}
                  </button>
                  <button onClick={() => handleEditTask(task)}>🖊 Edit</button>
                  <button onClick={() => handleDeleteTask(task.id)}>
                    🗑 Delete
                  </button>
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
