import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import '../css/AuthForm.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation basique
    if (!email.trim() || !password.trim()) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);

      if (success?.message) {
        toast.success(success.message);
        navigate('/dashboard');
      } else {
        toast.error(success?.error || 'Login failed. Invalid credentials.');
      }
    } catch (err) {
      // Afficher message backend si existe
      toast.error(err?.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Visual et features */}
      <div className="auth-visual">
        <h1>Welcome Back!</h1>
        <p>
          Sign in to your account and continue managing your tasks efficiently. 
          Your productivity journey continues here.
        </p>
        <div className="features">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>Lightning fast task management</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <span>Secure and private workspace</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Track your productivity</span>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="auth-form-container">
        <div className="auth-form">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>Don't have an account?</p>
            <Link to="/register">Create one here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
