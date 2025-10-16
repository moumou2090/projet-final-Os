import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import '../css/AuthForm.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation basique
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const success = await register(username.trim(), email.trim(), password.trim());

      if (success?.message) {
        toast.success(success.message);
        navigate('/dashboard');
      } else {
        toast.error(success?.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Visual et features */}
      <div className="auth-visual">
        <h1>Join Task Manager</h1>
        <p>
          Create your account and start organizing your tasks like never before. 
          Join thousands of users who trust us with their productivity.
        </p>
        <div className="features">
          <div className="feature">
            <span className="feature-icon">🚀</span>
            <span>Get started in seconds</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💼</span>
            <span>Professional task management</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <span>Achieve your goals faster</span>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="auth-form-container">
        <div className="auth-form">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                id="username"
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                disabled={loading}
                placeholder="Choose a username"
                aria-label="Username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
                placeholder="Enter your email"
                aria-label="Email address"
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
                disabled={loading}
                placeholder="Create a password"
                aria-label="Password"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner" aria-hidden="true"></span>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>Already have an account?</p>
            <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
