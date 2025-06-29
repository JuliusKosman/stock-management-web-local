import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaSave, FaKey } from "react-icons/fa";

export default function AccountSettingsPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleSaveInfo = async () => {
    try {
      await axios.put(
        "http://localhost:3000/api/auth/update-info",
        { username },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Profile information updated successfully!");
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
      alert("Password updated successfully!");
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
    </div>
  );
}
