import { StreakDay } from '../types';

// Generate 60 days of streak data ending today
export const generate60DayStreak = (): StreakDay[] => {
  const days: StreakDay[] = [];
  const today = new Date();
  
  for (let i = 59; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Simulate high adherence over the last 35 days, with sporadic days prior
    const isRecent = i <= 34;
    const active = isRecent ? (i % 11 !== 0) : (i % 3 === 0);
    const minutes = active ? Math.floor(35 + (i * 7) % 55) : 0;
    const tasks = active ? Math.max(1, Math.floor((minutes / 20))) : 0;
    
    days.push({
      date: dateStr,
      active,
      minutesSpent: minutes,
      tasksCompleted: tasks
    });
  }
  
  return days;
};

export const streakHistory: StreakDay[] = generate60DayStreak();
