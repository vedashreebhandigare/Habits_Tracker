import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard({ habits, habitEntries, compact = false }) {
  const activeHabits = habits.filter(h => h.active);
  
  // Calculate overall progress for current month
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const monthStartStr = monthStart.toISOString().split('T')[0];
  const monthEndStr = monthEnd.toISOString().split('T')[0];
  
  const totalPossible = activeHabits.length * daysInMonth.length;
  const activeHabitIds = activeHabits.map(h => h.id);
  const totalCompleted = habitEntries.filter(entry => {
    return activeHabitIds.includes(entry.habitId) && entry.date >= monthStartStr && entry.date <= monthEndStr;
  }).length;
  
  const overallProgress = totalPossible > 0 ? ((totalCompleted / totalPossible) * 100).toFixed(2) : 0;
  
  // Calculate weekly progress
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyData = daysInWeek.map(day => {
    const dateStr = day.toISOString().split('T')[0];
    const completedCount = habitEntries.filter(e => 
      activeHabitIds.includes(e.habitId) && e.date === dateStr
    ).length;
    const percentage = activeHabits.length > 0 ? (completedCount / activeHabits.length) * 100 : 0;
    
    return {
      day: format(day, 'EEE'),
      percentage: parseFloat(percentage.toFixed(1)),
      completed: completedCount,
      total: activeHabits.length
    };
  });
  
  // Calculate habit-level progress
  const habitProgress = activeHabits.map(habit => {
    const completedDays = habitEntries.filter(entry => {
      return entry.habitId === habit.id && entry.date >= monthStartStr && entry.date <= monthEndStr;
    }).length;
    
    const progress = (completedDays / daysInMonth.length) * 100;
    
    return {
      ...habit,
      completedDays,
      totalDays: daysInMonth.length,
      progress: progress.toFixed(1)
    };
  }).sort((a, b) => b.progress - a.progress);
  
  // Calculate streaks
  const getStreakForHabit = (habitId) => {
    let currentStreak = 0;
    let checkDate = new Date();
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasEntry = habitEntries.some(e => e.habitId === habitId && e.date === dateStr);
      
      if (!hasEntry) break;
      
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
      
      if (currentStreak > 365) break; // Safety limit
    }
    
    return currentStreak;
  };

  return (
    <div className={`dashboard ${compact ? 'compact' : ''}`}>
      {/* Overall Progress */}
      <div className="progress-bar-container">
        <div className="progress-header">
          <h2>This Month Progress</h2>
          <div className="progress-percentage">{overallProgress}%</div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${overallProgress}%`,
              background: overallProgress > 70 ? '#4CAF50' : overallProgress > 40 ? '#FFC107' : '#f44336'
            }}
          >
            {overallProgress > 5 && `${overallProgress}%`}
          </div>
        </div>
        <div className="progress-details">
          {totalCompleted} / {totalPossible} completed
        </div>
      </div>

      {!compact && (
        <div className="grid-2">
          {/* Weekly Chart */}
          <div className="card">
          <h3>📅 Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="custom-tooltip">
                        <p className="label">{payload[0].payload.day}</p>
                        <p className="value">{payload[0].value}%</p>
                        <p className="detail">
                          {payload[0].payload.completed} / {payload[0].payload.total} habits
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="percentage" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h3>📈 Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{activeHabits.length}</div>
              <div className="stat-label">Active Habits</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{totalCompleted}</div>
              <div className="stat-label">Completed This Month</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{daysInMonth.length - new Date().getDate() + 1}</div>
              <div className="stat-label">Days Remaining</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{format(now, 'MMM yyyy')}</div>
              <div className="stat-label">Current Period</div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Habit Progress List */}
      <div className="card">
        <h3>🎯 Habit Progress (This Month)</h3>
        <div className="habit-progress-list">
          {habitProgress.map(habit => {
            const streak = getStreakForHabit(habit.id);
            return (
              <div key={habit.id} className="habit-progress-item">
                <div className="habit-info">
                  <span className="habit-icon">{habit.icon}</span>
                  <div>
                    <div className="habit-name">{habit.name}</div>
                    <div className="habit-category">{habit.category}</div>
                  </div>
                </div>
                <div className="habit-stats">
                  <div className="habit-count">
                    Goal: {habit.totalDays} | Done: {habit.completedDays}
                  </div>
                  {streak > 0 && (
                    <div className="habit-streak">
                      🔥 {streak} day{streak > 1 ? 's' : ''} streak
                    </div>
                  )}
                </div>
                <div className="habit-progress-bar">
                  <div 
                    className="habit-progress-fill"
                    style={{ 
                      width: `${habit.progress}%`,
                      background: habit.progress > 70 ? '#4CAF50' : habit.progress > 40 ? '#FFC107' : '#f44336'
                    }}
                  ></div>
                  <div className="habit-progress-text">{habit.progress}%</div>
                </div>
              </div>
            );
          })}
          
          {habitProgress.length === 0 && (
            <div className="empty-state">
              <p>No active habits. Add some habits to start tracking!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
