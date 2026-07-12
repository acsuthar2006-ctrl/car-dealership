import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthForms.css';

export const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password);
      toast.success('Registration successful! Please login.');
      navigate('/login'); // Redirect to login on success
    } catch (err) {
      console.error("Register error:", err);
      const status = err.response?.status;
      const responseData = err.response?.data;
      const backendError = responseData?.error || responseData?.message;

      let message = 'Registration failed. Please try again.';
      
      if (status === 409) {
        message = 'Username or email already exists';
      } else if (status === 400 && responseData) {
        // Backend sends { fieldName: errorMessage } for validation errors
        const validationErrors = Object.values(responseData);
        if (validationErrors.length > 0) {
          message = validationErrors.join(', ');
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
      <h2>Register Account</h2>
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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            minLength={6}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="auth-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};
