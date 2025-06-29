import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaCog, FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";

export default function Topbar() {
  const [dropdown, setDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setUsername(res.data.username || "Unknown");
      } catch (err) {
        console.error("Gagal ambil username:", err);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      background: "#f8f9fa",
      padding: "10px 20px",
      borderBottom: "1px solid #ccc",
      position: "relative"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#333" }}>
        <FaUserCircle size={24} />
        <span>{username}</span>

        <button
          onClick={() => setDropdown(!dropdown)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            color: "#333"
          }}
          title="Open menu"
        >
          {dropdown ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {dropdown && (
        <div style={{
          position: "absolute",
          top: "50px",
          right: "20px",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "6px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          minWidth: "160px",
          zIndex: 100
        }}>
          <div
            onClick={() => {
              navigate("/account-settings");
              setDropdown(false);
            }}
            style={{
              padding: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#333"
            }}
          >
            <FaCog /> Account Settings
          </div>
          <div
            onClick={handleLogout}
            style={{
              padding: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#333"
            }}
          >
            <FaSignOutAlt /> Logout
          </div>
        </div>
      )}
    </div>
  );
}
