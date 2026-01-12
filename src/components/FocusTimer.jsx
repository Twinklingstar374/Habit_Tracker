import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaRedo, FaExpand, FaTimes, FaCoffee, FaBrain, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./FocusTimer.css";

const FocusTimer = () => {
    const [secondsLeft, setSecondsLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState("focus"); // 'focus' or 'break'
    const [isMinimized, setIsMinimized] = useState(true);

    useEffect(() => {
        let interval = null;
        if (isActive && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft((seconds) => seconds - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
            // Timer finished
            setIsActive(false);
            const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
            audio.play().catch(e => console.log("Audio play failed", e));

            // Auto-switch mode suggestion
            if (mode === "focus") {
                setMode("break");
                setSecondsLeft(5 * 60);
                setIsMinimized(false); // pop up when done
            } else {
                setMode("focus");
                setSecondsLeft(25 * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, secondsLeft, mode]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setSecondsLeft(mode === "focus" ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setSecondsLeft(newMode === "focus" ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const adjustTime = (minutes) => {
        if (!isActive) {
            setSecondsLeft((prev) => Math.max(0, prev + minutes * 60));
        }
    };

    const progress = mode === "focus"
        ? ((25 * 60 - secondsLeft) / (25 * 60)) * 100
        : ((5 * 60 - secondsLeft) / (5 * 60)) * 100;

    return (
        <motion.div
            className={`focus-timer-container ${isMinimized ? "minimized" : "expanded"} ${mode}`}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            drag={!isMinimized}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.05}
        >
            {!isMinimized && (
                <div className="timer-header">
                    <div className="mode-indicator">
                        {mode === "focus" ? <FaBrain /> : <FaCoffee />}
                        <span>{mode === "focus" ? "Focus" : "Break"}</span>
                    </div>
                    <button className="minimize-btn" onClick={() => setIsMinimized(true)}>
                        <FaTimes />
                    </button>
                </div>
            )}

            {!isMinimized ? (
                <div className="timer-body">
                    <div className="circular-timer">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" className="timer-bg" />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="timer-progress"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * progress) / 100}
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <div className="time-display">
                            {formatTime(secondsLeft)}
                        </div>

                        {/* Time Adjustment Controls */}
                        {!isActive && (
                            <div className="time-adjust-overlay">
                                <button onClick={() => adjustTime(-5)} className="adjust-btn">-5</button>
                                <button onClick={() => adjustTime(5)} className="adjust-btn">+5</button>
                            </div>
                        )}
                    </div>

                    <div className="timer-controls">
                        <button className="control-btn main" onClick={toggleTimer}>
                            {isActive ? <FaPause /> : <FaPlay />}
                        </button>
                        <button className="control-btn secondary" onClick={resetTimer}>
                            <FaRedo />
                        </button>
                    </div>

                    <div className="mode-switcher">
                        <button
                            className={mode === "focus" ? "active" : ""}
                            onClick={() => switchMode("focus")}
                        >
                            Focus
                        </button>
                        <button
                            className={mode === "break" ? "active" : ""}
                            onClick={() => switchMode("break")}
                        >
                            Break
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mini-fab" onClick={() => setIsMinimized(false)}>
                    {mode === "focus" ? <FaClock className="fab-icon" /> : <FaCoffee className="fab-icon" />}
                    {isActive && <div className="fab-pulse"></div>}
                </div>
            )}
        </motion.div>
    );
};

export default FocusTimer;
