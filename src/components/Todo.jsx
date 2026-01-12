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
import {
  FaCalendarAlt,
  FaTasks,
  FaCheck,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFire,
  FaSun,
  FaLeaf,
  FaUndo,
  FaCircle,
  FaRegCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
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
    if (!currentUser) return;
    const userTodoRef = collection(db, "todos", currentUser.uid, "userTodos");
    const unsubscribe = onSnapshot(userTodoRef, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort: Incomplete first, then by priority/deadline? 
      // Simplified sort: Created desc
      setTasks(list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });

    return () => unsubscribe();
  }, [currentUser]);


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
    if (window.confirm("Remove this task?")) {
      const ref = doc(db, "todos", currentUser.uid, "userTodos", id);
      await deleteDoc(ref);
    }
  };


  const handleToggleComplete = async (task) => {
    const ref = doc(db, "todos", currentUser.uid, "userTodos", task.id);
    await updateDoc(ref, {
      completed: !task.completed,
      completedAt: !task.completed ? serverTimestamp() : null
    });
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

  const getPriorityColor = (p) => {
    if (p === 'High') return 'var(--accent-secondary)'; // Pink
    if (p === 'Medium') return 'var(--accent-orange)'; // Orange
    return 'var(--accent-teal)'; // Teal
  };

  if (!currentUser) return <p>Loading your tasks...</p>;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <div className="header-title">
          <FaTasks className="header-icon" />
          <h2>Master List</h2>
        </div>
      </div>

      <div className="todo-main-layout">
        {/* Input Section */}
        <motion.div
          className="todo-input-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="input-row-main">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="task-input-modern"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <button className="add-btn-modern" onClick={handleAddTask}>
              <FaPlus />
            </button>
          </div>
          <div className="input-options">
            <div className="option-pill">
              <FaCalendarAlt />
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                className="date-input-hidden"
              />
            </div>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="priority-select"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </motion.div>

        {/* Task List */}
        <div className="todo-list-scroll">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`modern-task-item ${task.completed ? 'completed' : ''}`}
                style={{ borderLeftColor: getPriorityColor(task.priority) }}
              >
                {editingId === task.id ? (
                  <div className="task-edit-inline">
                    <input
                      className="edit-input"
                      value={editedTask.title}
                      onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    />
                    <div className="edit-actions">
                      <button onClick={saveEditedTask} className="save-btn-xs">Save</button>
                      <button onClick={() => setEditingId(null)} className="cancel-btn-xs">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      className={`check-circle ${task.completed ? 'checked' : ''}`}
                      onClick={() => handleToggleComplete(task)}
                    >
                      {task.completed ? <FaCheck /> : <div className="circle-outline" />}
                    </button>

                    <div className="task-content-main">
                      <span className="task-text">{task.title}</span>
                      <div className="task-meta-info">
                        {task.deadline && (
                          <span className="meta-tag date">
                            <FaCalendarAlt size={10} /> {task.deadline}
                          </span>
                        )}
                        <span className={`meta-tag priority ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <div className="task-h-actions">
                      <button className="icon-btn-sm" onClick={() => handleEditTask(task)}><FaEdit /></button>
                      <button className="icon-btn-sm danger" onClick={() => handleDeleteTask(task.id)}><FaTrash /></button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {tasks.length === 0 && (
            <div className="empty-todo">
              <p>All clear! Relax or add more tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
