import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DailyTracker.css';

function DailyTracker({ habits, habitEntries, currentMonth, setCurrentMonth, toggleHabitEntry, isHabitCompleted }) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };
  
  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setCurrentMonth(new Date(parseInt(year), parseInt(month) - 1, 1));
  };

  // Generate weeks for the month
  const generateWeeks = () => {
    const weeks = [];
    let currentDate = startOfMonth(currentMonth);
    
    while (currentDate <= monthEnd) {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start week on Monday
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
        .filter(day => isSameMonth(day, currentMonth)); // Only include days in current month
      
      if (weekDays.length > 0) {
        weeks.push(weekDays);
      }
      
      // Move to next week
      currentDate = new Date(weekEnd);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return weeks;
  };

  const weeks = generateWeeks();
  const allDays = weeks.flat(); // Flatten all weeks into one array

  return (
    <div className="daily-tracker">
      <div className="tracker-header">
        <h2>Daily Habit Tracker</h2>
        <div className="month-navigation">
          <button onClick={goToPreviousMonth} className="btn btn-secondary">
            <ChevronLeft size={20} />
          </button>
          <select 
            value={format(currentMonth, 'yyyy-MM')} 
            onChange={handleMonthChange}
            className="month-selector"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date(2026, i, 1);
              return (
                <option key={i} value={format(date, 'yyyy-MM')}>
                  {format(date, 'MMMM yyyy')}
                </option>
              );
            })}
          </select>
          <button onClick={goToNextMonth} className="btn btn-secondary">
            <ChevronRight size={20} />
          </button>
          <button onClick={goToToday} className="btn btn-primary">
            Today
          </button>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <p>No active habits. Go to "Manage Habits" to add some!</p>
        </div>
      ) : (
        <div className="tracker-scroll-container">
          <table className="tracker-grid-table">
            <thead>
              {/* Week Headers */}
              <tr>
                <th className="habits-header-cell" rowSpan="2">
                  <div>DAILY HABITS</div>
                </th>
                {weeks.map((weekDays, weekIndex) => (
                  <th key={weekIndex} colSpan={weekDays.length} className="week-header-cell">
                    WEEK {weekIndex + 1}
                  </th>
                ))}
              </tr>
              {/* Day Headers */}
              <tr>
                {weeks.map((weekDays, weekIndex) => (
                  weekDays.map(day => (
                    <th key={day.toISOString()} className="day-header-cell">
                      <div className="day-name">{format(day, 'EEE').toUpperCase()}</div>
                      <div className="day-date">{format(day, 'd')}</div>
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map(habit => (
                <tr key={habit.id} className="habit-row">
                  <td className="habit-name-cell">
                    <span className="habit-icon">{habit.icon}</span>
                    <span className="habit-name">{habit.name}</span>
                  </td>
                  {allDays.map(day => {
                    const completed = isHabitCompleted(habit.id, day);
                    const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    const isFuture = day > new Date();
                    const isPast = day < new Date() && !isToday;
                    const isMissed = isPast && !completed;
                    
                    return (
                      <td 
                        key={`${habit.id}-${day.toISOString()}`}
                        className={`checkbox-cell ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''} ${completed ? 'completed' : ''} ${isMissed ? 'missed' : ''}`}
                      >
                        <label className="checkbox-wrapper">
                          <input
                            type="checkbox"
                            checked={completed}
                            onChange={() => toggleHabitEntry(habit.id, day)}
                            disabled={isFuture}
                          />
                          <span className={`custom-checkbox ${completed ? 'checked' : ''}`}></span>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Weekly Summary */}
      {habits.length > 0 && weeks.length > 0 && (
        <div className="weekly-summary">
          <h3>Weekly Summary</h3>
          <div className="weeks-container">
            {weeks.map((week, weekIndex) => {
              const weekStart = week[0];
              const weekEnd = week[week.length - 1];
              
              const totalPossible = habits.length * week.length;
              const totalCompleted = week.reduce((sum, day) => {
                return sum + habits.filter(h => isHabitCompleted(h.id, day)).length;
              }, 0);
              
              const percentage = totalPossible > 0 ? ((totalCompleted / totalPossible) * 100).toFixed(1) : 0;
              
              return (
                <div key={weekIndex} className="week-summary-card">
                  <div className="week-label">
                    Week {weekIndex + 1}
                  </div>
                  <div className="week-dates">
                    {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
                  </div>
                  <div className="week-progress">
                    <div className="week-percentage" style={{ 
                      color: percentage > 70 ? '#4CAF50' : percentage > 40 ? '#FFC107' : '#f44336'
                    }}>
                      {percentage}%
                    </div>
                    <div className="week-count">
                      {totalCompleted} / {totalPossible}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyTracker;
