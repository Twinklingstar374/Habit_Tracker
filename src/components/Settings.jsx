import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import {
    FaUser,
    FaCog,
    FaSave,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./Settings.css";

const Settings = () => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState({
        displayName: "",
        email: "",
        bio: "",
        memberSince: "",
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!currentUser) return;

        const loadProfile = async () => {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            if (userDoc.exists()) {
                setProfile({
                    displayName: userDoc.data().displayName || currentUser.displayName || "",
                    email: currentUser.email,
                    bio: userDoc.data().bio || "",
                    memberSince: currentUser.metadata.creationTime,
                });
            } else {
                setProfile({
                    displayName: currentUser.displayName || "",
                    email: currentUser.email,
                    bio: "",
                    memberSince: currentUser.metadata.creationTime,
                });
            }
        };

        loadProfile();
    }, [currentUser]);

    const handleSaveProfile = async () => {
        if (!currentUser) return;

        try {
            await updateProfile(currentUser, {
                displayName: profile.displayName,
            });

            await setDoc(
                doc(db, "users", currentUser.uid),
                {
                    displayName: profile.displayName,
                    bio: profile.bio,
                    updatedAt: new Date(),
                },
                { merge: true }
            );

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile");
        }
    };

    if (!currentUser) return <p>Loading settings...</p>;

    return (
        <div className="settings-container">
            <div className="feature-header">
                <FaCog className="header-icon" />
                <h2>Settings & Profile</h2>
            </div>

            <div className="settings-grid">
                <motion.div
                    className="settings-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3>
                        <FaUser /> Profile Information
                    </h3>
                    <div className="form-group">
                        <label>Display Name</label>
                        <input
                            type="text"
                            value={profile.displayName}
                            onChange={(e) =>
                                setProfile({ ...profile, displayName: e.target.value })
                            }
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={profile.email} disabled />
                    </div>
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            rows={4}
                        />
                    </div>
                    <button className="save-btn" onClick={handleSaveProfile}>
                        <FaSave /> {saved ? "Saved!" : "Save Changes"}
                    </button>
                </motion.div>



                <motion.div
                    className="settings-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3>
                        <FaCog /> Preferences
                    </h3>
                    <div className="preferences-grid">
                        <div className="pref-item">
                            <label>
                                <input type="checkbox" defaultChecked />
                                <span>Email notifications</span>
                            </label>
                        </div>
                        <div className="pref-item">
                            <label>
                                <input type="checkbox" defaultChecked />
                                <span>Daily reminders</span>
                            </label>
                        </div>
                        <div className="pref-item">
                            <label>
                                <input type="checkbox" />
                                <span>Weekly summary emails</span>
                            </label>
                        </div>
                        <div className="pref-item">
                            <label>
                                <input type="checkbox" defaultChecked />
                                <span>Streak notifications</span>
                            </label>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
