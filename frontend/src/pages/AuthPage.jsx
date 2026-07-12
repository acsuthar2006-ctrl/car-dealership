import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginForm } from "../components/Auth/LoginForm";
import { RegisterForm } from "../components/Auth/RegisterForm";
import "./AuthPage.css";

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Sync mode with URL
  useEffect(() => {
    if (location.pathname === "/register") {
      setIsLoginMode(false);
    } else {
      setIsLoginMode(true);
    }
  }, [location.pathname]);

  const toggleMode = (e, mode) => {
    e.preventDefault();
    if (mode === "login") {
      navigate("/login");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left Panel (Marketing) ── */}
      <div className="auth-left-panel">
        <div className="auth-logo">🚗 PREMIUM AUTO DEALERSHIP</div>
        
        <div className="auth-marketing-content" style={{ opacity: isLoginMode ? 1 : 0, position: isLoginMode ? "relative" : "absolute", pointerEvents: isLoginMode ? "auto" : "none" }}>
          <h2 className="auth-heading">Welcome Back!</h2>
          <p className="auth-description">
            Sign in to browse our premium collection of luxury vehicles and manage your purchases.
          </p>
          <div className="auth-trust-badges">
            <p>Trusted by 5000+ Customers</p>
            <p>100% Secure Transactions</p>
          </div>
        </div>

        <div className="auth-marketing-content" style={{ opacity: !isLoginMode ? 1 : 0, position: !isLoginMode ? "relative" : "absolute", pointerEvents: !isLoginMode ? "auto" : "none" }}>
          <h2 className="auth-heading">Join Us Today!</h2>
          <p className="auth-description">
            Create an account to unlock exclusive deals and access our full inventory of amazing cars!
          </p>
          <ul className="auth-features">
            <li>✓ Fast & Easy Registration</li>
            <li>✓ Access to Exclusive Deals</li>
            <li>✓ Personalized Recommendations</li>
            <li>✓ Purchase History Tracking</li>
          </ul>
        </div>
      </div>

      {/* ── Right Panel (Forms) ── */}
      <div className={`auth-right-panel ${isLoginMode ? "login-active" : "register-active"}`}>
        <div className="auth-forms-wrapper">
          {/* Login Slide */}
          <div className="auth-form-slider form-slide-login">
            <h2 className="auth-form-title">Sign In</h2>
            <p className="auth-form-subtitle">Welcome back to your premium auto experience</p>
            <LoginForm />
            <p className="auth-switch-text">
              Don't have an account? <a href="/register" onClick={(e) => toggleMode(e, "register")}>Register here</a>
            </p>
          </div>

          {/* Register Slide */}
          <div className="auth-form-slider form-slide-register">
            <h2 className="auth-form-title">Create Account</h2>
            <p className="auth-form-subtitle">Join the premium auto experience today</p>
            <RegisterForm />
            <p className="auth-switch-text">
              Already have an account? <a href="/login" onClick={(e) => toggleMode(e, "login")}>Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
