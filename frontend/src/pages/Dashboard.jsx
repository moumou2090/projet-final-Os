import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import '../css/DashBoard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // ─────────────── États ───────────────
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]);
  const [creating, setCreating] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarNote, setCalendarNote] = useState('');
  const [importantDates, setImportantDates] = useState(
    JSON.parse(localStorage.getItem('importantDates')) || []
  );

  const [notebookOpen, setNotebookOpen] = useState(false);
  const [notebook, setNotebook] = useState(localStorage.getItem('notebook') || '');

  // ─────────────── Récupération des tâches ───────────────
  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const { data } = await axios.get('/api/tasks');
      setTasks(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Impossible de récupérer les tâches.');
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  // ─────────────── CRUD Tâches ───────────────
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || newTaskTitle.trim().length < 3) {
      toast.error('Le titre doit contenir au moins 3 caractères.');
      return;
    }
    setCreating(true);
    try {
      const { data } = await axios.post('/api/tasks', {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
      });
      setTasks(prev => [...prev, data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      toast.success('Tâche créée avec succès !');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la création de la tâche.');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateTask = async (id, completed) => {
    setLoadingIds(prev => [...prev, id]);
    try {
      await axios.put(`/api/tasks/${id}`, { completed });
      setTasks(prev => prev.map(t => (t._id === id ? { ...t, completed } : t)));
      toast.success('Tâche mise à jour !');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setLoadingIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Confirmer la suppression de cette tâche ?')) return;
    setLoadingIds(prev => [...prev, id]);
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Tâche supprimée !');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setLoadingIds(prev => prev.filter(x => x !== id));
    }
  };

  // ─────────────── Statistiques ───────────────
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  // ─────────────── Gestion calendrier ───────────────
  const handleAddCalendarNote = (e) => {
    e.preventDefault();
    if (!calendarNote.trim()) return;
    const newDates = [...importantDates, { date: selectedDate, note: calendarNote }];
    setImportantDates(newDates);
    localStorage.setItem('importantDates', JSON.stringify(newDates));
    setCalendarNote('');
    toast.success('Note ajoutée au calendrier !');
  };

  // ─────────────── Sauvegarde Notebook ───────────────
  const handleSaveNotebook = () => {
    localStorage.setItem('notebook', notebook);
    toast.success('Notes sauvegardées !');
  };

  return (
    <div className="dashboard-container">
      {/* ─────────── Sidebar stats ─────────── */}
      <aside className="dashboard-sidebar">
        <h3>Vue d'ensemble</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{totalTasks}</span>
            <span className="stat-label">Tâches totales</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{completedTasks}</span>
            <span className="stat-label">Terminées</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{totalTasks - completedTasks}</span>
            <span className="stat-label">Restantes</span>
          </div>
        </div>
      </aside>

      {/* ─────────── Main ─────────── */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Bienvenue, {user?.username || 'Invité'} !</h2>
          <p>Gérez vos tâches efficacement et restez productif.</p>
        </header>

        {/* ─────────── Form création tâche ─────────── */}
        <section className="task-form">
          <h4>Créer une nouvelle tâche</h4>
          <form onSubmit={handleCreateTask}>
            <div className="task-form-grid">
              <div className="form-field">
                <label htmlFor="task-title">Titre</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="Titre de la tâche"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="form-field">
                <label htmlFor="task-desc">Description (optionnel)</label>
                <input
                  id="task-desc"
                  type="text"
                  placeholder="Ajouter une description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <button type="submit" disabled={creating}>
                {creating ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </form>
        </section>

        {/* ─────────── Liste des tâches ─────────── */}
        <section className="tasks-section">
          <h3>Vos tâches</h3>
          {loadingTasks ? (
            <div className="loading-container">
              <div className="loading-spinner" aria-label="Chargement des tâches"></div>
              <p>Chargement...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <h4>Aucune tâche !</h4>
              <p>Créez votre première tâche ci-dessus pour commencer à organiser votre travail.</p>
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    {task.description && <div className="task-description">{task.description}</div>}
                  </div>
                  <div className="task-actions">
                    <button
                      className={task.completed ? 'incomplete-btn' : 'complete-btn'}
                      onClick={() => handleUpdateTask(task._id, !task.completed)}
                      disabled={loadingIds.includes(task._id)}
                    >
                      {loadingIds.includes(task._id) ? '...' : task.completed ? 'Incomplète' : 'Terminer'}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTask(task._id)}
                      disabled={loadingIds.includes(task._id)}
                    >
                      {loadingIds.includes(task._id) ? '...' : 'Supprimer'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ─────────── Extras: Calendrier + Notebook ─────────── */}
        <section className="extras-section">
          {/* ─── Calendrier ─── */}
          <div className="calendar-box">
            <h3>Calendrier des dates importantes</h3>
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              tileClassName={({ date, view }) => {
                if (view === 'month') {
                  const isImportant = importantDates.some(
                    (d) => new Date(d.date).toDateString() === date.toDateString()
                  );
                  return isImportant ? 'important-date' : null;
                }
              }}
            />
            <form onSubmit={handleAddCalendarNote}>
              <input
                type="text"
                placeholder="Note pour cette date"
                value={calendarNote}
                onChange={(e) => setCalendarNote(e.target.value)}
              />
              <button type="submit">Enregistrer</button>
            </form>
            <ul className="calendar-list">
              {importantDates.map((item, i) => (
                <li key={i}>
                  <strong>{new Date(item.date).toLocaleDateString()} :</strong> {item.note}
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Notebook interactif ─── */}
          <div className="notebook-box">
            <button
              className="notebook-toggle"
              onClick={() => setNotebookOpen(!notebookOpen)}
            >
              {notebookOpen ? 'Fermer Notebook 📖' : 'Ouvrir Notebook 📖'}
            </button>

            {notebookOpen && (
              <div className="notebook-modal">
                <textarea
                  value={notebook}
                  onChange={(e) => setNotebook(e.target.value)}
                  placeholder="Écris tes notes ici..."
                />
                <div className="notebook-actions">
                  <button onClick={handleSaveNotebook}>Sauvegarder</button>
                  <button onClick={() => setNotebookOpen(false)}>Fermer</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
