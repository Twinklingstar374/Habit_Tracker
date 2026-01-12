import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
    FaCalendarAlt,
    FaPlus,
    FaTrash,
    FaEdit,
    FaTimes,
    FaSave,
    FaClock,
    FaMapMarkerAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { format, isSameDay } from "date-fns";
import "./Calendar.css";

const CalendarView = () => {
    const { currentUser } = useAuth();
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: "",
        time: "12:00",
        location: "",
        description: "",
    });

    useEffect(() => {
        if (!currentUser) return;

        const eventsRef = collection(db, "events", currentUser.uid, "userEvents");
        const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate() || new Date(),
            }));
            setEvents(list);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleAddEvent = async () => {
        if (!newEvent.title.trim()) return;

        const eventsRef = collection(db, "events", currentUser.uid, "userEvents");
        await addDoc(eventsRef, {
            ...newEvent,
            date: date,
            createdAt: serverTimestamp(),
        });

        setShowModal(false);
        setNewEvent({ title: "", time: "12:00", location: "", description: "" });
    };

    const handleUpdateEvent = async () => {
        if (!newEvent.title.trim() || !editingEvent) return;

        const eventRef = doc(db, "events", currentUser.uid, "userEvents", editingEvent.id);
        await updateDoc(eventRef, {
            ...newEvent,
        });

        setEditingEvent(null);
        setShowModal(false);
        setNewEvent({ title: "", time: "12:00", location: "", description: "" });
    };

    const handleDeleteEvent = async (id) => {
        const eventRef = doc(db, "events", currentUser.uid, "userEvents", id);
        await deleteDoc(eventRef);
    };

    const openEditModal = (event) => {
        setEditingEvent(event);
        setNewEvent({
            title: event.title,
            time: event.time,
            location: event.location,
            description: event.description,
        });
        setShowModal(true);
    };

    const selectedDateEvents = events.filter((event) =>
        isSameDay(event.date, date)
    );

    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const hasEvent = events.some((event) => isSameDay(event.date, date));
            return hasEvent ? "has-event" : null;
        }
    };

    const onDateClick = (clickedDate) => {
        // Prepare new event for the clicked date
        setDate(clickedDate);
        setEditingEvent(null);
        setNewEvent({
            title: "",
            time: "09:00",
            location: "",
            description: ""
        });
        setShowModal(true);
    };

    const getTileContent = ({ date, view }) => {
        if (view === "month") {
            const dayEvents = events.filter((event) => isSameDay(event.date, date));

            if (dayEvents.length > 0) {
                return (
                    <div className="tile-events-container">
                        {dayEvents.slice(0, 3).map((event) => (
                            <div key={event.id} className="tile-event-bar">
                                {event.title}
                            </div>
                        ))}
                        {dayEvents.length > 3 && (
                            <div className="tile-more-events">+{dayEvents.length - 3} more</div>
                        )}
                    </div>
                );
            }
        }
        return null;
    };

    if (!currentUser) return <p>Loading calendar...</p>;

    return (
        <div className="calendar-container">
            <div className="feature-header">
                <FaCalendarAlt className="header-icon" />
                <h2>Professional Calendar</h2>
            </div>

            <div className="calendar-layout">
                <motion.div
                    className="calendar-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Calendar
                        onChange={setDate}
                        value={date}
                        onClickDay={onDateClick}
                        tileClassName={tileClassName}
                        tileContent={getTileContent}
                        className="styled-calendar"
                    />
                </motion.div>

                <div className="events-panel">
                    <div className="panel-header">
                        <h3>Events for {format(date, "MMMM do, yyyy")}</h3>
                        <button className="add-event-btn" onClick={() => {
                            setEditingEvent(null);
                            setNewEvent({ title: "", time: "12:00", location: "", description: "" });
                            setShowModal(true);
                        }}>
                            <FaPlus />
                        </button>
                    </div>

                    <div className="events-list">
                        <AnimatePresence mode="popLayout">
                            {selectedDateEvents.length === 0 ? (
                                <motion.div
                                    className="no-events"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <p>No events scheduled for this day.</p>
                                </motion.div>
                            ) : (
                                selectedDateEvents.map((event) => (
                                    <motion.div
                                        key={event.id}
                                        className="event-item"
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <div className="event-info">
                                            <h4>{event.title}</h4>
                                            <div className="event-details">
                                                <span><FaClock /> {event.time}</span>
                                                {event.location && <span><FaMapMarkerAlt /> {event.location}</span>}
                                            </div>
                                            {event.description && <p className="event-desc">{event.description}</p>}
                                        </div>
                                        <div className="event-actions">
                                            <button onClick={() => openEditModal(event)} className="edit-icon"><FaEdit /></button>
                                            <button onClick={() => handleDeleteEvent(event.id)} className="delete-icon"><FaTrash /></button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="modal-overlay">
                        <motion.div
                            className="event-modal"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className="modal-header">
                                <h3>{editingEvent ? "Edit Event" : "Add New Event"}</h3>
                                <button className="close-btn" onClick={() => setShowModal(false)}>
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        placeholder="Event Title"
                                    />
                                </div>
                                <div className="input-pair">
                                    <div className="input-group">
                                        <label>Time</label>
                                        <input
                                            type="time"
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            value={newEvent.location}
                                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Description</label>
                                    <textarea
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        placeholder="Add more details..."
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="save-event-btn" onClick={editingEvent ? handleUpdateEvent : handleAddEvent}>
                                    <FaSave /> {editingEvent ? "Update Event" : "Save Event"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CalendarView;
