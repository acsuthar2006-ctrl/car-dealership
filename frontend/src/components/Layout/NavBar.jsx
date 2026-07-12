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
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-brand">
          <svg className="brand-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
          PREMIUM AUTO DEALERSHIP
        </h2>
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
        <button onClick={handleLogout} className="btn-nav-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};
