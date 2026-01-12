import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from "recharts";
import {
    FaChartLine,
    FaTrophy,
    FaFire,
    FaCheckCircle,
    FaCalendarCheck,
    FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./Analytics.css";

const Analytics = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        totalTodos: 0,
        completedTodos: 0,
        totalHabits: 0,
        activeHabits: 0,
        totalNotes: 0,
        completionRate: 0,
        currentStreak: 0,
        longestStreak: 0,
    });
    const [weeklyData, setWeeklyData] = useState([]);
    const [habitSuccessRates, setHabitSuccessRates] = useState([]);
    const [priorityDistribution, setPriorityDistribution] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        // Fetch Todos
        const todosRef = collection(db, "todos", currentUser.uid, "userTodos");
        const unsubTodos = onSnapshot(todosRef, (snapshot) => {
            const todos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const completed = todos.filter((t) => t.completed).length;
            const total = todos.length;

            // Priority distribution
            const priorities = { High: 0, Medium: 0, Low: 0 };
            todos.forEach((t) => {
                if (t.priority) priorities[t.priority]++;
            });

            setPriorityDistribution([
                { name: "High", value: priorities.High, color: "#ff5e5e" },
                { name: "Medium", value: priorities.Medium, color: "#ffb347" },
                { name: "Low", value: priorities.Low, color: "#4ade80" },
            ]);

            // Weekly completion trend (last 7 days)
            const weekData = Array(7).fill(0);
            const today = new Date();
            todos.forEach((todo) => {
                if (todo.completedAt?.toDate) {
                    const completedDate = todo.completedAt.toDate();
                    const daysDiff = Math.floor(
                        (today - completedDate) / (1000 * 60 * 60 * 24)
                    );
                    if (daysDiff < 7) {
                        weekData[6 - daysDiff]++;
                    }
                }
            });

            const weekLabels = ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "Yesterday", "Today"];
            setWeeklyData(
                weekLabels.map((label, i) => ({ day: label, completed: weekData[i] }))
            );

            setStats((prev) => ({
                ...prev,
                totalTodos: total,
                completedTodos: completed,
                completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            }));
        });

        // Fetch Habits
        const habitsRef = collection(db, "habits", currentUser.uid, "userHabits");
        const unsubHabits = onSnapshot(habitsRef, (snapshot) => {
            const habits = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const active = habits.filter((h) => h.status === "active");

            // Calculate success rates
            const successRates = active.slice(0, 5).map((habit) => ({
                name: habit.name.substring(0, 15),
                streak: habit.streak || 0,
                goal: parseInt(habit.goal) || 30,
            }));

            setHabitSuccessRates(successRates);

            // Calculate streaks
            const streaks = active.map((h) => h.streak || 0);
            const currentStreak = Math.max(...streaks, 0);
            const longestStreak = currentStreak; // Simplified

            setStats((prev) => ({
                ...prev,
                totalHabits: habits.length,
                activeHabits: active.length,
                currentStreak,
                longestStreak,
            }));
        });

        // Fetch Notes
        const notesRef = collection(db, "notes", currentUser.uid, "userNotes");
        const unsubNotes = onSnapshot(notesRef, (snapshot) => {
            setStats((prev) => ({ ...prev, totalNotes: snapshot.size }));
        });

        return () => {
            unsubTodos();
            unsubHabits();
            unsubNotes();
        };
    }, [currentUser]);

    if (!currentUser) return <p>Loading analytics...</p>;

    return (
        <div className="analytics-container">
            <div className="feature-header">
                <FaChartLine className="header-icon" />
                <h2>Analytics & Insights</h2>
            </div>

            {/* Stats Overview */}
            <div className="stats-overview">
                <motion.div
                    className="stat-box"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="stat-icon-wrapper blue">
                        <FaCheckCircle />
                    </div>
                    <div className="stat-content">
                        <h3>Completion Rate</h3>
                        <p className="stat-value">{stats.completionRate}%</p>
                        <span className="stat-label">{stats.completedTodos}/{stats.totalTodos} tasks</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-box"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="stat-icon-wrapper orange">
                        <FaFire />
                    </div>
                    <div className="stat-content">
                        <h3>Current Streak</h3>
                        <p className="stat-value">{stats.currentStreak}</p>
                        <span className="stat-label">days in a row</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-box"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="stat-icon-wrapper purple">
                        <FaTrophy />
                    </div>
                    <div className="stat-content">
                        <h3>Active Habits</h3>
                        <p className="stat-value">{stats.activeHabits}</p>
                        <span className="stat-label">out of {stats.totalHabits} total</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-box"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="stat-icon-wrapper teal">
                        <FaCalendarCheck />
                    </div>
                    <div className="stat-content">
                        <h3>Total Notes</h3>
                        <p className="stat-value">{stats.totalNotes}</p>
                        <span className="stat-label">saved notes</span>
                    </div>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* Weekly Completion Trend */}
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3>📈 Weekly Completion Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="day" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(13, 20, 30, 0.95)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="completed"
                                stroke="#2a89dc"
                                strokeWidth={3}
                                dot={{ fill: "#2a89dc", r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Priority Distribution */}
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3>🎯 Task Priority Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={priorityDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                label={(entry) => `${entry.name}: ${entry.value}`}
                            >
                                {priorityDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(13, 20, 30, 0.95)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Habit Success Rates */}
                <motion.div
                    className="chart-card full-width"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <h3>🏆 Top Habit Streaks</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={habitSuccessRates} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis type="number" stroke="#a0aec0" />
                            <YAxis dataKey="name" type="category" stroke="#a0aec0" width={120} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(13, 20, 30, 0.95)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                }}
                            />
                            <Bar dataKey="streak" fill="#2a89dc" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;
