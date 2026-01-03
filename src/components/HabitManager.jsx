import { useState } from 'react';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import './HabitManager.css';

function HabitManager({ habits, addHabit, updateHabit, deleteHabit }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Health',
    icon: '✅'
  });

  const categories = ['Health', 'Learning', 'Finance', 'Social', 'Work', 'Fitness', 'Mindfulness', 'Hobby', 'Other'];
  
  const commonIcons = [
    '💪', '📚', '🧘', '🏃', '💰', '🎨', '🎸', '✍️',
    '🍎', '💻', '🎯', '📝', '🌱', '🧠', '⚡', '🔥',
    '✨', '🎭', '🎮', '📷', '🎵', '🏋️', '🚴', '🏊'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    if (editingId) {
      updateHabit(editingId, formData);
      setEditingId(null);
    } else {
      addHabit(formData);
    }

    setFormData({ name: '', category: 'Health', icon: '✅' });
    setIsAdding(false);
  };

  const startEdit = (habit) => {
    setEditingId(habit.id);
    setFormData({
      name: habit.name,
      category: habit.category,
      icon: habit.icon
    });
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Health', icon: '✅' });
    setIsAdding(false);
  };

  const toggleActive = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    updateHabit(habitId, { active: !habit.active });
  };

  return (
    <div className="habit-manager">
      <div className="manager-header">
        <h2>Manage Habits</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add New Habit
          </button>
        )}
      </div>

      {isAdding && (
        <div className="card habit-form-card">
          <div className="form-header">
            <h3>{editingId ? 'Edit Habit' : 'Add New Habit'}</h3>
            <button onClick={cancelEdit} className="btn-icon">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Habit Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Exercise"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Icon</label>
              <div className="icon-input-group">
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Type your own emoji or select below"
                  maxLength="2"
                  className="icon-text-input"
                />
                <span className="icon-preview">{formData.icon}</span>
              </div>
              <div className="icon-picker">
                {commonIcons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, icon })}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Habit' : 'Create Habit'}
              </button>
              <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="habits-list">
        <h3>Your Habits ({habits.length})</h3>
        
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits yet. Click "Add New Habit" to get started!</p>
          </div>
        ) : (
          <div className="habits-grid">
            {habits.map(habit => (
              <div 
                key={habit.id} 
                className={`habit-card ${!habit.active ? 'inactive' : ''}`}
              >
                <div className="habit-card-header">
                  <span className="habit-card-icon">{habit.icon}</span>
                  <div className="habit-card-info">
                    <h4>{habit.name}</h4>
                    <span className="habit-card-category">{habit.category}</span>
                  </div>
                </div>
                
                <div className="habit-card-actions">
                  <button
                    onClick={() => toggleActive(habit.id)}
                    className={`btn ${habit.active ? 'btn-active' : 'btn-secondary'}`}
                    title={habit.active ? 'Archive' : 'Activate'}
                  >
                    {habit.active ? 'Active' : 'Archived'}
                  </button>
                  <button
                    onClick={() => startEdit(habit)}
                    className="btn btn-icon"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${habit.name}"? This will remove all tracking data.`)) {
                        deleteHabit(habit.id);
                      }
                    }}
                    className="btn btn-icon btn-danger-icon"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HabitManager;
