// Mock analytics data for dashboard
// Optimized dataset size for performance

export interface VisitorData {
  timestamp: string;
  visitors: number;
  date: string;
  hour: number;
  dayOfWeek: string;
}

export interface SearchTerm {
  term: string;
  termAr: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PeakTime {
  hour: number;
  label: string;
  labelAr: string;
  visitors: number;
  intensity: 'low' | 'medium' | 'high';
}

export interface LanguageStats {
  language: 'en' | 'ar';
  name: string;
  nameAr: string;
  count: number;
  percentage: number;
}

// Generate last 30 days of hourly visitor data (720 data points)
const generateVisitorData = (): VisitorData[] => {
  const data: VisitorData[] = [];
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (let day = 29; day >= 0; day--) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    
    const dayOfWeek = daysOfWeek[date.getDay()];
    const isWeekend = dayOfWeek === 'Friday' || dayOfWeek === 'Saturday';
    
    // Generate hourly data for each day (focusing on business hours 8am-11pm)
    for (let hour = 8; hour <= 23; hour++) {
      const baseVisitors = isWeekend ? 45 : 35;
      let visitors = baseVisitors;
      
      // Lunch peak (12-2pm)
      if (hour >= 12 && hour <= 14) {
        visitors += Math.floor(Math.random() * 25) + 30;
      }
      // Dinner peak (7-10pm)
      else if (hour >= 19 && hour <= 22) {
        visitors += Math.floor(Math.random() * 35) + 40;
      }
      // Morning
      else if (hour >= 8 && hour <= 11) {
        visitors += Math.floor(Math.random() * 15) + 10;
      }
      // Afternoon lull
      else if (hour >= 15 && hour <= 18) {
        visitors += Math.floor(Math.random() * 10) + 5;
      }
      // Late night
      else {
        visitors += Math.floor(Math.random() * 8);
      }
      
      // Add some randomness
      visitors += Math.floor(Math.random() * 10) - 5;
      visitors = Math.max(visitors, 5); // Minimum 5 visitors
      
      const timestamp = new Date(date);
      timestamp.setHours(hour);
      
      data.push({
        timestamp: timestamp.toISOString(),
        visitors,
        date: date.toISOString().split('T')[0],
        hour,
        dayOfWeek,
      });
    }
  }
  
  return data;
};

export const visitorData = generateVisitorData();

export const searchTerms: SearchTerm[] = [
  { term: 'Steak', termAr: 'ستيك', count: 892, trend: 'up' },
  { term: 'Vegetarian', termAr: 'نباتي', count: 745, trend: 'up' },
  { term: 'Seafood', termAr: 'مأكولات بحرية', count: 623, trend: 'stable' },
  { term: 'Pasta', termAr: 'معكرونة', count: 581, trend: 'down' },
  { term: 'Dessert', termAr: 'حلويات', count: 534, trend: 'up' },
  { term: 'Pizza', termAr: 'بيتزا', count: 487, trend: 'stable' },
  { term: 'Salad', termAr: 'سلطة', count: 456, trend: 'up' },
  { term: 'Coffee', termAr: 'قهوة', count: 423, trend: 'stable' },
  { term: 'Gluten Free', termAr: 'خالي من الجلوتين', count: 398, trend: 'up' },
  { term: 'Chicken', termAr: 'دجاج', count: 367, trend: 'down' },
];

export const peakTimes: PeakTime[] = [
  { hour: 8, label: '8 AM', labelAr: '8 صباحاً', visitors: 42, intensity: 'low' },
  { hour: 9, label: '9 AM', labelAr: '9 صباحاً', visitors: 56, intensity: 'low' },
  { hour: 10, label: '10 AM', labelAr: '10 صباحاً', visitors: 68, intensity: 'medium' },
  { hour: 11, label: '11 AM', labelAr: '11 صباحاً', visitors: 73, intensity: 'medium' },
  { hour: 12, label: '12 PM', labelAr: '12 ظهراً', visitors: 95, intensity: 'high' },
  { hour: 13, label: '1 PM', labelAr: '1 ظهراً', visitors: 102, intensity: 'high' },
  { hour: 14, label: '2 PM', labelAr: '2 ظهراً', visitors: 88, intensity: 'high' },
  { hour: 15, label: '3 PM', labelAr: '3 ظهراً', visitors: 61, intensity: 'medium' },
  { hour: 16, label: '4 PM', labelAr: '4 عصراً', visitors: 54, intensity: 'low' },
  { hour: 17, label: '5 PM', labelAr: '5 عصراً', visitors: 59, intensity: 'medium' },
  { hour: 18, label: '6 PM', labelAr: '6 مساءً', visitors: 72, intensity: 'medium' },
  { hour: 19, label: '7 PM', labelAr: '7 مساءً', visitors: 118, intensity: 'high' },
  { hour: 20, label: '8 PM', labelAr: '8 مساءً', visitors: 134, intensity: 'high' },
  { hour: 21, label: '9 PM', labelAr: '9 مساءً', visitors: 127, intensity: 'high' },
  { hour: 22, label: '10 PM', labelAr: '10 مساءً', visitors: 96, intensity: 'high' },
  { hour: 23, label: '11 PM', labelAr: '11 مساءً', visitors: 67, intensity: 'medium' },
];

export const languageStats: LanguageStats[] = [
  {
    language: 'en',
    name: 'English',
    nameAr: 'الإنجليزية',
    count: 6834,
    percentage: 62,
  },
  {
    language: 'ar',
    name: 'Arabic',
    nameAr: 'العربية',
    count: 4186,
    percentage: 38,
  },
];

// Helper function to aggregate visitor data by different time periods
export const aggregateVisitorsByPeriod = (
  data: VisitorData[],
  period: 'day' | 'week' | 'month'
): { label: string; visitors: number; date: string }[] => {
  const aggregated = new Map<string, { visitors: number; date: string }>();

  data.forEach((entry) => {
    const date = new Date(entry.timestamp);
    let key: string;
    let label: string;

    if (period === 'day') {
      // Last 7 days
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      if (date < cutoff) return;
      
      key = entry.date;
      label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } else if (period === 'week') {
      // Last 4 weeks
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 28);
      if (date < cutoff) return;
      
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split('T')[0];
      label = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else {
      // Last 30 days (all data)
      key = entry.date;
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    const existing = aggregated.get(key);
    if (existing) {
      existing.visitors += entry.visitors;
    } else {
      aggregated.set(key, { visitors: entry.visitors, date: key });
    }
  });

  return Array.from(aggregated.entries())
    .map(([key, value]) => ({
      label: key,
      visitors: value.visitors,
      date: value.date,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item, index) => {
      const date = new Date(item.date);
      let label: string;
      
      if (period === 'day') {
        label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      } else if (period === 'week') {
        label = `Week ${index + 1}`;
      } else {
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      return { ...item, label };
    });
};
