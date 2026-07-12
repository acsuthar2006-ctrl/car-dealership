import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./NavBar.css";

export const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin;

  if (!user) {
    return null; 
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-left">
        <h2 className="navbar-brand">Car Dealership</h2>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Storefront
          </Link>
          {isAdmin && (
            <Link to="/admin" className="nav-link">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">
          Welcome, <strong>{user.username}</strong>
        </span>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>
          Logout
        </button>
      </div>
    </nav>
  );
};
