import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./AuthForms.css";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password);
      toast.success("Successfully logged in!");
      navigate("/"); // Redirect to dashboard
    } catch (err) {
      console.error("Login error:", err);
      const status = err.response?.status;
      const responseData = err.response?.data;
      const backendError = responseData?.error;

      let message = "An error occurred during login.";
      if (status === 401 || status === 403) {
        message = backendError || "Invalid username or password";
      } else if (status === 400 && responseData) {
        // Backend sends { fieldName: errorMessage } for validation errors
        const validationErrors = Object.values(responseData);
        if (validationErrors.length > 0) {
          message = validationErrors.join(", ");
        } else {
          message = "Invalid input data";
        }
      } else if (backendError) {
        message = backendError;
      } else if (err.message) {
        message = err.message;
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login to Dealership</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="auth-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};
