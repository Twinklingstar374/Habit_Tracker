import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [userId, setUserId] = useState(null);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "General",
  });

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedNote, setEditedNote] = useState({
    title: "",
    content: "",
    category: "General",
  });

  // 🔐 Check user login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔄 Real-time fetch
  useEffect(() => {
    if (!userId) return;

    const notesRef = collection(db, "notes");
    const q = query(notesRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(list);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    await addDoc(collection(db, "notes"), {
      ...newNote,
      userId: userId,
      createdAt: serverTimestamp(),
    });

    setNewNote({ title: "", content: "", category: "General" });
  };

  const handleDeleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setEditedNote({
      title: note.title,
      content: note.content,
      category: note.category,
    });
  };

  const saveEditedNote = async () => {
    await updateDoc(doc(db, "notes", editingNoteId), {
      ...editedNote,
    });
    setEditingNoteId(null);
    setEditedNote({ title: "", content: "", category: "General" });
  };

  return (
    <div className="notes-wrapper">
      <h2>📝 Notes</h2>

      {/* Add Note */}
      <div className="add-note-box">
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="note-input"
        />
        <textarea
          placeholder="Write your note here..."
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          className="note-textarea"
        />
        <select
          value={newNote.category}
          onChange={(e) =>
            setNewNote({ ...newNote, category: e.target.value })
          }
          className="note-select"
        >
          <option value="General">General</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Ideas">Ideas</option>
        </select>
        <button className="submit-note-btn" onClick={handleAddNote}>
          Add Note
        </button>
      </div>

      {/* Display Notes */}
      <div className="note-cards">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            {editingNoteId === note.id ? (
              <>
                <input
                  type="text"
                  value={editedNote.title}
                  onChange={(e) =>
                    setEditedNote({ ...editedNote, title: e.target.value })
                  }
                />
                <textarea
                  value={editedNote.content}
                  onChange={(e) =>
                    setEditedNote({ ...editedNote, content: e.target.value })
                  }
                />
                <select
                  value={editedNote.category}
                  onChange={(e) =>
                    setEditedNote({ ...editedNote, category: e.target.value })
                  }
                >
                  <option value="General">General</option>
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Ideas">Ideas</option>
                </select>
                <button onClick={saveEditedNote}>💾 Save</button>
                <button onClick={() => setEditingNoteId(null)}>❌ Cancel</button>
              </>
            ) : (
              <>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <p className="category">📁 {note.category}</p>
                <button
                  className="edit-btn"
                  onClick={() => handleEditNote(note)}
                >
                  🖊 Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  🗑 Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
