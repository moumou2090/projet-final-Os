import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConnectionStatus = ({ className = '' }) => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'connected' | 'disconnected'
  const [lastChecked, setLastChecked] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const checkConnection = async () => {
    try {
      setStatus('checking');
      setErrorMsg('');
      const response = await axios.get('/api/auth/profile', { timeout: 5000 });
      setStatus('connected');
      setLastChecked(new Date());
    } catch (error) {
      try {
        await axios.get('/api/health', { timeout: 5000 });
        setStatus('connected');
      } catch (err) {
        setStatus('disconnected');
        setErrorMsg(err?.message || 'No response from backend');
      }
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return (
          <>
            <span role="status" aria-live="polite">
              <span className="loading-spinner" style={{ marginRight: 8 }} /> Vérification de la connexion...
            </span>
          </>
        );
      case 'connected':
        return '✅ Backend connecté';
      case 'disconnected':
        return '❌ Backend déconnecté';
      default:
        return 'Statut inconnu';
    }
  };

  const getStatusClass = () => {
    return `connection-status ${status} ${className}`;
  };

  const formatLastChecked = () => {
    if (!lastChecked) return null;
    const now = new Date();
    const diff = (now - lastChecked) / 1000;
    if (diff < 3600) {
      return lastChecked.toLocaleTimeString();
    }
    return lastChecked.toLocaleString();
  };

  return (
    <div className={getStatusClass()} role="status" aria-live="polite">
      <button
        type="button"
        onClick={checkConnection}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          font: 'inherit',
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label="Rafraîchir la connexion"
      >
        {getStatusText()}
      </button>
      {lastChecked && (
        <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.2rem' }}>
          Dernière vérification : {formatLastChecked()}
        </div>
      )}
      {errorMsg && status === 'disconnected' && (
        <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.2rem' }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;