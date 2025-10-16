import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../css/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleToggle = () => setDark((prev) => !prev);

  return (
    <nav>
      <Link to="/" aria-label="Accueil">
        <h1>Task Manager</h1>
      </Link>
      <div className="nav-content">
        {user ? (
          <div className="nav-menu authenticated">
            <div className="user-info">
              <span
                style={{
                  background: '#667eea',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  marginRight: 8,
                }}
                aria-label="Avatar utilisateur"
              >
                {user.username?.charAt(0).toUpperCase()}
              </span>
              <span>Bienvenue, {user.username}</span>
            </div>
            <div className="nav-links">
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                Dashboard
              </NavLink>
              <button onClick={logout} aria-label="Déconnexion">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="nav-links">
            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>
              Register
            </NavLink>
          </div>
        )}
        {/* Bouton mode sombre / clair */}
        <button
          onClick={handleToggle}
          className="theme-toggle-btn"
          aria-label="Changer le mode d'affichage"
        >
          {dark ? '☀️ Mode clair' : '🌙 Mode sombre'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;