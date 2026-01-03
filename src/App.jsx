import { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import HabitManager from './components/HabitManager';
import DailyTracker from './components/DailyTracker';
import Analytics from './components/Analytics';
import { themes, applyTheme } from './themes';

function App() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits);
      // Migrate old habits to ensure they have the 'active' property
      return parsedHabits.map(habit => ({
        ...habit,
        active: habit.active !== undefined ? habit.active : true
      }));
    }
    return [];
  });
  
  const [habitEntries, setHabitEntries] = useState(() => {
    const savedEntries = localStorage.getItem('habitEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  
  const [view, setView] = useState('tracker');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'floral';
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('habitEntries', JSON.stringify(habitEntries));
  }, [habitEntries]);
  
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const addHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
      active: true,
      createdAt: new Date().toISOString()
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabit = (id, updatedHabit) => {
    setHabits(habits.map(h => h.id === id ? { ...h, ...updatedHabit } : h));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
    setHabitEntries(habitEntries.filter(e => e.habitId !== id));
  };

  const toggleHabitEntry = (habitId, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const existingEntry = habitEntries.find(
      e => e.habitId === habitId && e.date === dateStr
    );

    if (existingEntry) {
      setHabitEntries(habitEntries.filter(e => e !== existingEntry));
    } else {
      setHabitEntries([...habitEntries, {
        id: Date.now().toString(),
        habitId,
        date: dateStr,
        completed: true
      }]);
    }
  };

  const isHabitCompleted = (habitId, date) => {
    const dateStr = date.toISOString().split('T')[0];
    return habitEntries.some(e => e.habitId === habitId && e.date === dateStr);
  };

  return (
    <div className="app">
      <header className="app-header">
        <img src="/Habit_Heading.png" alt="Habit Tracker" className="heading-image" />
        <div className="header-controls">
          <nav className="nav-tabs">
            <button 
              className={view === 'tracker' ? 'active' : ''} 
              onClick={() => setView('tracker')}
            >
              Daily Tracker
            </button>
            <button 
              className={view === 'analytics' ? 'active' : ''} 
            onClick={() => setView('analytics')}
          >
            Analytics
          </button>
          <button 
            className={view === 'habits' ? 'active' : ''} 
            onClick={() => setView('habits')}
          >
            Manage Habits
          </button>
        </nav>
        
        <div className="theme-selector">
          <select 
            value={currentTheme} 
            onChange={(e) => setCurrentTheme(e.target.value)}
            className="theme-dropdown"
          >
            {Object.entries(themes).map(([key, theme]) => (
              <option key={key} value={key}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
        </div>
      </header>

      <main className="app-main">
        {view === 'tracker' && (
          <>
            <Dashboard 
              habits={habits}
              habitEntries={habitEntries}
              compact={true}
            />
            <DailyTracker
              habits={habits.filter(h => h.active)}
              habitEntries={habitEntries}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              toggleHabitEntry={toggleHabitEntry}
              isHabitCompleted={isHabitCompleted}
            />
          </>
        )}
        
        {view === 'analytics' && (
          <Analytics
            habits={habits}
            habitEntries={habitEntries}
          />
        )}
        
        {view === 'habits' && (
          <HabitManager
            habits={habits}
            addHabit={addHabit}
            updateHabit={updateHabit}
            deleteHabit={deleteHabit}
          />
        )}
      </main>
    </div>
  );
}

export default App;
