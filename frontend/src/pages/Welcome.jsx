import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="welcome-container">
      {/* Content principal */}
      <div className="welcome-content">
        <h1>Welcome to Task Manager</h1>
        <p>
          Take control of your day with Task Manager! Easily create, organize, and track all your tasks in one place. 
          Boost your productivity, meet your deadlines, and focus on what really matters.
        </p>
        <div className="cta-buttons">
          <Link 
            to="/register" 
            className="cta-button primary"
            aria-label="Get started with Task Manager"
          >
            Get Started
          </Link>
          <Link 
            to="/login" 
            className="cta-button secondary"
            aria-label="Sign in to your Task Manager account"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Visual / Feature showcase */}
      <div className="welcome-visual">
        <div className="feature-showcase">
          <div className="showcase-item">
            <div className="showcase-icon" aria-hidden="true">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Gain insights on your progress and track productivity trends effortlessly.</p>
          </div>
          <div className="showcase-item">
            <div className="showcase-icon" aria-hidden="true">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Navigate through tasks and features quickly, without any delay.</p>
          </div>
          <div className="showcase-item">
            <div className="showcase-icon" aria-hidden="true">🎯</div>
            <h3>Goal Oriented</h3>
            <p>Focus on what truly matters and achieve your daily objectives.</p>
          </div>
        </div>
      </div>

      {/* Features cards */}
      <div className="welcome-features">
        <div className="feature-card">
          <span className="feature-icon" aria-hidden="true">📝</span>
          <div>
            <h4>Quick Task Creation</h4>
            <p>Create tasks in seconds with detailed titles and descriptions.</p>
          </div>
        </div>
        <div className="feature-card">
          <span className="feature-icon" aria-hidden="true">✅</span>
          <div>
            <h4>Track Your Progress</h4>
            <p>Mark tasks as complete and see your productivity grow daily.</p>
          </div>
        </div>
        <div className="feature-card">
          <span className="feature-icon" aria-hidden="true">🔒</span>
          <div>
            <h4>Secure & Private</h4>
            <p>Your tasks are safely stored and kept private at all times.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
