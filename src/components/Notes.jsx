import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import {
  FaStickyNote,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaFolderOpen,
  FaSearch,
  FaQuoteLeft,
  FaExpand,
  FaBold,
  FaItalic,
  FaEllipsisH
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import "./Notes.css";

const Notes = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer/Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);

  // Editor State
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState("General");
  const [isEditing, setIsEditing] = useState(false);

  // ContentEditable Ref
  const contentRef = useRef(null);

  // 🔄 Real-time fetch (Scoped to User ID)
  useEffect(() => {
    if (!currentUser) return;

    const notesRef = collection(db, "notes", currentUser.uid, "userNotes");

    const unsubscribe = onSnapshot(notesRef, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Open Drawer for New Note
  const openNewNote = () => {
    setViewingNote(null);
    setNoteTitle("");
    setNoteContent("");
    setNoteCategory("General");
    setIsEditing(true); // Default to edit mode for new notes
    setIsDrawerOpen(true);
  };

  // Open Drawer to View Note
  const openNote = (note) => {
    setViewingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setIsEditing(false); // Default to view mode
    setIsDrawerOpen(true);
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim() && !noteContent.trim()) return;

    const notesRef = collection(db, "notes", currentUser.uid, "userNotes");

    if (viewingNote?.id) {
      // Update existing
      const noteRef = doc(db, "notes", currentUser.uid, "userNotes", viewingNote.id);
      await updateDoc(noteRef, {
        title: noteTitle,
        content: noteContent, // Store HTML/Rich content
        category: noteCategory,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new
      await addDoc(notesRef, {
        title: noteTitle,
        content: noteContent,
        category: noteCategory,
        createdAt: serverTimestamp(),
      });
    }

    setIsDrawerOpen(false);
    setViewingNote(null);
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteDoc(doc(db, "notes", currentUser.uid, "userNotes", id));
      if (viewingNote?.id === id) setIsDrawerOpen(false);
    }
  };

  // Minimal Rich Text Handlers
  const execCommand = (command) => {
    document.execCommand(command, false, null);
    if (contentRef.current) {
      setNoteContent(contentRef.current.innerHTML);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="notes-container">
      <div className="notes-header">
        <div className="header-left">
          <FaStickyNote className="header-icon" />
          <h2>Library</h2>
        </div>
        <div className="header-actions">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="new-note-btn" onClick={openNewNote}>
            <FaPlus /> New Note
          </button>
        </div>
      </div>

      <div className="notes-grid">
        <AnimatePresence mode="popLayout">
          {filteredNotes.length === 0 ? (
            <motion.div
              className="no-notes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FaQuoteLeft style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.3 }} />
              <p>No notes found. Create one to get started.</p>
            </motion.div>
          ) : (
            filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`note-preview-card category-${note.category.toLowerCase()}`}
                onClick={() => openNote(note)}
              >
                <div className="card-top">
                  <span className="category-tag">{note.category}</span>
                  <span className="note-date">
                    {note.createdAt?.toDate ? note.createdAt.toDate().toLocaleDateString() : "Just now"}
                  </span>
                </div>
                <h3>{note.title || "Untitled"}</h3>
                <div
                  className="note-preview-content"
                  dangerouslySetInnerHTML={{ __html: note.content }} // Render basic HTML
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* DRAWER / SLIDE-OVER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              className="note-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="drawer-header">
                <div className="drawer-actions-left">
                  <button className="icon-btn" onClick={() => setIsDrawerOpen(false)}><FaTimes /></button>
                  <span className="last-edited">
                    {viewingNote?.updatedAt ? `Edited ${viewingNote.updatedAt.toDate().toLocaleDateString()}` : "Unsaved changes"}
                  </span>
                </div>
                <div className="drawer-actions-right">
                  {!isEditing ? (
                    <>
                      <button className="icon-btn" onClick={() => setIsEditing(true)} title="Edit"><FaEdit /></button>
                      <button className="icon-btn delete-btn" onClick={() => handleDeleteNote(viewingNote.id)} title="Delete"><FaTrash /></button>
                    </>
                  ) : (
                    <button className="save-btn-primary" onClick={handleSaveNote}>Done</button>
                  )}
                </div>
              </div>

              <div className="drawer-content">
                {/* Meta Inputs */}
                <div className="drawer-meta-row">
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value)}
                    disabled={!isEditing}
                    className="category-select-minimal"
                  >
                    <option value="General">General</option>
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Ideas">Ideas</option>
                  </select>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  className="drawer-title-input"
                  placeholder="Untitled"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  readOnly={!isEditing}
                />

                {/* Rich Text Toolbar (Only in Edit Mode) */}
                {isEditing && (
                  <div className="rich-text-toolbar">
                    <button onClick={() => execCommand('bold')} title="Bold"><FaBold /></button>
                    <button onClick={() => execCommand('italic')} title="Italic"><FaItalic /></button>
                  </div>
                )}

                {/* Rich Text Editor / Viewer */}
                {isEditing ? (
                  <div
                    className="rich-editor"
                    contentEditable
                    ref={contentRef}
                    onInput={(e) => setNoteContent(e.currentTarget.innerHTML)}
                    placeholder="Start typing..."
                    dangerouslySetInnerHTML={{ __html: noteContent }} // Init content
                  />
                ) : (
                  <div
                    className="rich-viewer"
                    dangerouslySetInnerHTML={{ __html: noteContent }}
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notes;
