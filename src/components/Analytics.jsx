import { startOfYear, endOfYear, startOfMonth, endOfMonth, eachMonthOfInterval, format, eachDayOfInterval } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './Analytics.css';

function Analytics({ habits, habitEntries }) {
  const now = new Date();
  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);
  
  // Force re-calculation when habitEntries changes
  const totalEntries = habitEntries.length;
  
  // Debug: Log entries to console
  console.log('Analytics - Total entries:', totalEntries);
  console.log('Analytics - Entries:', habitEntries);
  console.log('Analytics - Year range:', yearStart, 'to', yearEnd);
  
  // Monthly analytics for current year
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
  
  const monthlyData = months.map(month => {
    const monthStartDate = startOfMonth(month);
    const monthEndDate = endOfMonth(month);
    const daysInMonth = eachDayOfInterval({ start: monthStartDate, end: monthEndDate });
    
    const activeHabitsForMonth = habits.filter(h => {
      const habitCreated = new Date(h.createdAt);
      return habitCreated <= monthEndDate;
    });
    
    const totalPossible = activeHabitsForMonth.length * daysInMonth.length;
    const completedInMonth = habitEntries.filter(entry => {
      const entryDate = new Date(entry.date + 'T00:00:00');
      return entryDate >= monthStartDate && entryDate <= monthEndDate;
    }).length;
    
    const percentage = totalPossible > 0 ? ((completedInMonth / totalPossible) * 100) : 0;
    
    return {
      month: format(month, 'MMM'),
      fullMonth: format(month, 'MMMM yyyy'),
      percentage: parseFloat(percentage.toFixed(2)),
      completed: completedInMonth,
      total: totalPossible,
      habits: activeHabitsForMonth.length
    };
  });

  // Current month detailed stats
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const currentMonthDays = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });
  
  const currentMonthHabits = habits.filter(h => h.active);
  const currentMonthTotal = currentMonthHabits.length * currentMonthDays.length;
  const currentMonthCompleted = habitEntries.filter(entry => {
    const entryDate = new Date(entry.date + 'T00:00:00');
    return entryDate >= currentMonthStart && entryDate <= currentMonthEnd;
  }).length;
  const currentMonthNotCompleted = currentMonthTotal - currentMonthCompleted;

  // Habit-wise yearly completion
  const habitYearlyStats = habits.map(habit => {
    const completedDays = habitEntries.filter(entry => {
      const entryDate = new Date(entry.date + 'T00:00:00');
      return entry.habitId === habit.id && entryDate >= yearStart && entryDate <= yearEnd;
    }).length;
    
    return {
      ...habit,
      completedDays,
      percentage: completedDays > 0 ? ((completedDays / 365) * 100).toFixed(1) : 0
    };
  }).sort((a, b) => b.completedDays - a.completedDays);

  // Best and worst months
  const completedMonths = monthlyData.filter(m => m.total > 0);
  const bestMonth = completedMonths.length > 0 
    ? completedMonths.reduce((best, current) => current.percentage > best.percentage ? current : best)
    : null;
  const worstMonth = completedMonths.length > 0
    ? completedMonths.reduce((worst, current) => current.percentage < worst.percentage ? current : worst)
    : null;

  return (
    <div className="analytics" key={`analytics-${totalEntries}`}>
      <h2>📊 Yearly Analytics - {format(now, 'yyyy')}</h2>

      {/* Yearly Progress Chart */}
      <div className="card">
        <h3>Monthly Progress Overview</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} label={{ value: '% Complete', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="custom-tooltip">
                      <p className="label">{payload[0].payload.fullMonth}</p>
                      <p className="value">{payload[0].value}%</p>
                      <p className="detail">
                        {payload[0].payload.completed} / {payload[0].payload.total} completed
                      </p>
                      <p className="detail">
                        {payload[0].payload.habits} habit(s) tracked
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="percentage" 
              stroke="#4CAF50" 
              fillOpacity={1} 
              fill="url(#colorPercentage)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2">
        {/* Monthly Summary Cards */}
        <div className="card">
          <h3>This Month Summary</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <div className="summary-label">Active Habits</div>
              <div className="summary-value">{currentMonthHabits.length}</div>
            </div>
            <div className="summary-stat">
              <div className="summary-label">Completed</div>
              <div className="summary-value completed">{currentMonthCompleted}</div>
            </div>
            <div className="summary-stat">
              <div className="summary-label">Not Completed</div>
              <div className="summary-value not-completed">{currentMonthNotCompleted}</div>
            </div>
            <div className="summary-stat">
              <div className="summary-label">Completion Rate</div>
              <div className="summary-value">
                {currentMonthTotal > 0 ? ((currentMonthCompleted / currentMonthTotal) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Best & Worst Months */}
        <div className="card">
          <h3>Performance Highlights</h3>
          <div className="highlights">
            {bestMonth && (
              <div className="highlight-item best">
                <div className="highlight-emoji">🏆</div>
                <div>
                  <div className="highlight-label">Best Month</div>
                  <div className="highlight-value">{bestMonth.fullMonth}</div>
                  <div className="highlight-percentage">{bestMonth.percentage}%</div>
                </div>
              </div>
            )}
            {worstMonth && (
              <div className="highlight-item worst">
                <div className="highlight-emoji">📉</div>
                <div>
                  <div className="highlight-label">Needs Improvement</div>
                  <div className="highlight-value">{worstMonth.fullMonth}</div>
                  <div className="highlight-percentage">{worstMonth.percentage}%</div>
                </div>
              </div>
            )}
            {!bestMonth && !worstMonth && (
              <div className="empty-highlight">
                <p>Start tracking to see insights!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="card">
        <h3>Monthly Breakdown</h3>
        <div className="monthly-table-container">
          <table className="monthly-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Habits</th>
                <th>Completed</th>
                <th>Total</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((month, index) => (
                <tr key={index}>
                  <td className="month-name">{month.fullMonth}</td>
                  <td>{month.habits}</td>
                  <td className="completed-count">{month.completed}</td>
                  <td>{month.total}</td>
                  <td>
                    <div className="table-progress">
                      <div className="table-progress-bar">
                        <div 
                          className="table-progress-fill"
                          style={{ 
                            width: `${month.percentage}%`,
                            background: month.percentage > 70 ? '#4CAF50' : month.percentage > 40 ? '#FFC107' : '#f44336'
                          }}
                        ></div>
                      </div>
                      <span className="table-progress-text">{month.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Habit-wise Yearly Stats */}
      <div className="card">
        <h3>Habit Performance (Yearly)</h3>
        <div className="habit-yearly-list">
          {habitYearlyStats.map(habit => (
            <div key={habit.id} className="habit-yearly-item">
              <div className="habit-yearly-info">
                <span className="habit-icon">{habit.icon}</span>
                <div>
                  <div className="habit-name">{habit.name}</div>
                  <div className="habit-category">{habit.category}</div>
                </div>
              </div>
              <div className="habit-yearly-stats">
                <div className="habit-yearly-days">{habit.completedDays} days</div>
                <div className="habit-yearly-bar">
                  <div 
                    className="habit-yearly-fill"
                    style={{ 
                      width: `${Math.min(habit.percentage, 100)}%`,
                      background: habit.percentage > 50 ? '#4CAF50' : habit.percentage > 25 ? '#FFC107' : '#f44336'
                    }}
                  ></div>
                </div>
                <div className="habit-yearly-percentage">{habit.percentage}%</div>
              </div>
            </div>
          ))}
          
          {habitYearlyStats.length === 0 && (
            <div className="empty-state">
              <p>No habits tracked yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
