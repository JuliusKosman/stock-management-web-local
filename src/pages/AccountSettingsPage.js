import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaSave, FaKey } from "react-icons/fa";

export default function AccountSettingsPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsername(res.data.username || "");
      setEmail(res.data.email || "");
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  const triggerPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 500);
  };

  const handleSaveInfo = async () => {
    try {
      await axios.put(
        "http://localhost:3000/api/auth/update-info",
        { username },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      triggerPopup("Profile information updated successfully!");
    } catch (err) {
      console.error("Failed to update info:", err);
      alert("Failed to update profile information.");
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Password confirmation does not match!");
      return;
    }

    try {
      await axios.put(
        "http://localhost:3000/api/auth/change-password",
        { password: newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      triggerPopup("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to change password:", err);
      alert("Failed to update password.");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 d-flex align-items-center gap-2">
        <FaUser /> Account Settings
      </h3>

      {/* Profile Information */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">Profile Information</h5>
          <div className="mb-3">
            <label className="form-label fw-bold">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Email</label>
            <input type="email" className="form-control" value={email} disabled />
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSaveInfo}>
            <FaSave /> Save Information
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Change Password</h5>
          <div className="mb-3">
            <label className="form-label fw-bold">New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleSavePassword}>
            <FaKey /> Save Password
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1050
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            textAlign: "center",
            maxWidth: "400px",
            width: "90%"
          }}>
            <h5 className="text-success">Success</h5>
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
