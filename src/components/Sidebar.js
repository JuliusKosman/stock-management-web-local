import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBoxes,
  FaHome,
  FaSignInAlt,
  FaSignOutAlt,
  FaCog,
  FaClipboardList,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: "/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/stock-in", icon: <FaSignInAlt />, label: "Stock In" },
    { path: "/stock-out", icon: <FaSignOutAlt />, label: "Stock Out" },
    { path: "/activity-logs", icon: <FaClipboardList />, label: "Activity Logs" },
    // { path: "/account-settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <div
      style={{
        width: collapsed ? "60px" : "220px",
        background: "#e6f0ff",
        padding: "10px",
        height: "100vh",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        transition: "width 0.3s",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header + Toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          marginBottom: "30px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaBoxes size={20} />
          {!collapsed && (
            <span style={{ marginLeft: "10px", fontSize: "18px", fontWeight: "bold" }}>
              JCStock
            </span>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#333",
          }}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              textDecoration: "none",
              color: pathname === item.path ? "#000" : "#333",
              background: pathname === item.path ? "#d0e6ff" : "transparent",
              borderRadius: "6px",
              marginBottom: "8px",
              transition: "background 0.2s",
            }}
          >
            {item.icon}
            {!collapsed && <span style={{ marginLeft: "10px" }}>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
