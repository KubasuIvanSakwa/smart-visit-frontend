import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, ArrowLeft } from 'lucide-react';

const CleanBarChart = ({ data, title, icon: Icon, activeTheme }) => {
  const maxValue = Math.max(...data.map(item => item.visitors), 1); // Prevent division by zero
  
  return (
    <div className={`${
      activeTheme === 'light' 
        ? 'bg-white border border-gray-100' 
        : 'bg-gray-900 border border-gray-800'
    } rounded-lg p-8 transition-all duration-200`}>
      {/* Chart Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className={`p-2 rounded-lg ${
          activeTheme === 'light' 
            ? 'bg-gray-100' 
            : 'bg-gray-800'
        }`}>
          <Icon className={`h-5 w-5 ${
            activeTheme === 'light' 
              ? 'text-gray-600' 
              : 'text-gray-400'
          }`} />
        </div>
        <h3 className={`text-lg font-medium ${
          activeTheme === 'light' 
            ? 'text-gray-900' 
            : 'text-white'
        }`}>
          {title}
        </h3>
      </div>

      {/* Chart Bars */}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${
                activeTheme === 'light' 
                  ? 'text-gray-700' 
                  : 'text-gray-300'
              }`}>
                {item.hour || item.month}
              </span>
              <span className={`text-sm ${
                activeTheme === 'light' 
                  ? 'text-gray-500' 
                  : 'text-gray-400'
              }`}>
                {item.visitors}
              </span>
            </div>
            <div className={`${
              activeTheme === 'light' 
                ? 'bg-gray-100' 
                : 'bg-gray-800'
            } rounded-full h-2 relative overflow-hidden`}>
              <div 
                className={`${
                  activeTheme === 'light' 
                    ? 'bg-gray-900' 
                    : 'bg-white'
                } h-2 rounded-full transition-all duration-500 ease-out group-hover:opacity-80`}
                style={{ 
                  width: `${(item.visitors / maxValue) * 100}%`,
                  transitionDelay: `${index * 50}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Chart Footer Stats */}
      <div className={`mt-8 pt-6 border-t ${
        activeTheme === 'light' 
          ? 'border-gray-100' 
          : 'border-gray-800'
      }`}>
        <div className="flex items-center justify-between text-sm">
          <span className={activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}>
            Peak: {maxValue} visitors
          </span>
          <span className={activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}>
            Total: {data.reduce((sum, item) => sum + item.visitors, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const [activeTheme, setActiveTheme] = useState('light');
  const [peakHours, setPeakHours] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [peakHourLabel, setPeakHourLabel] = useState('--');

  const hourLabels = ['8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM'];
  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const hourToIndex = {
    '8 AM': 8, '9 AM': 9, '10 AM': 10, '11 AM': 11, '12 PM': 12,
    '1 PM': 13, '2 PM': 14, '3 PM': 15, '4 PM': 16, '5 PM': 17
  };



  useEffect(() => {
    const fetchAnalyticsData = () => {
      try {
        // Get visitors from localStorage only
        const visitors = JSON.parse(localStorage.getItem('visibleVisitors')) || [];

        const now = new Date();

        // PEAK HOURS (Today)
        const hoursCount = hourLabels.map(hour => ({
          hour,
          visitors: 0
        }));

        visitors.forEach(v => {
          if (!v.check_in_time) return;
          const d = new Date(v.check_in_time);
          if (
            d.getDate() === now.getDate() &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          ) {
            const h = d.getHours();
            const label = Object.entries(hourToIndex).find(([label, hour]) => hour === h);
            if (label) {
              const index = hourLabels.indexOf(label[0]);
              if (index !== -1) hoursCount[index].visitors++;
            }
          }
        });

        setPeakHours(hoursCount);

        // Peak hour label
        const peakHourObj = hoursCount.reduce((a, b) =>
          a.visitors > b.visitors ? a : b
        );
        setPeakHourLabel(peakHourObj.visitors > 0 ? peakHourObj.hour : '--');

        // MONTHLY DATA (This Year)
        const monthCount = monthLabels.map(month => ({
          month,
          visitors: 0
        }));

        visitors.forEach(v => {
          if (!v.check_in_time) return;
          const d = new Date(v.check_in_time);
          if (d.getFullYear() === now.getFullYear()) {
            monthCount[d.getMonth()].visitors++;
          }
        });

        setMonthlyData(monthCount);

        // Totals
        const todaysTotal = hoursCount.reduce((sum, h) => sum + h.visitors, 0);
        setTodayTotal(todaysTotal);
        setMonthlyTotal(monthCount[now.getMonth()].visitors);

      } catch (err) {
        console.error('Failed to load analytics:', err);
        // Set empty data on error - no mock data
        setPeakHours(hourLabels.map(hour => ({ hour, visitors: 0 })));
        setMonthlyData(monthLabels.map(month => ({ month, visitors: 0 })));
        setTodayTotal(0);
        setMonthlyTotal(0);
        setPeakHourLabel('--');
      }
    };

    fetchAnalyticsData();
  }, []);

  // Theme Selector
  const ThemeSelector = () => (
    <div className="fixed top-4 right-6 z-50 flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={() => setActiveTheme('light')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === 'light' 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        Light
      </button>
      <button
        onClick={() => setActiveTheme('dark')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === 'dark' 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        Dark
      </button>
    </div>
  );

  const handleBack = () => {
    // In a real app, this would navigate back
    if (window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen">
      <ThemeSelector />
      <button
        onClick={handleBack}
        className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm m-3 ${
          activeTheme === "light"
            ? "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
            : "bg-gray-900 hover:bg-gray-800 text-white border-gray-800 hover:border-gray-700"
        }`}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className={`min-h-screen ${
        activeTheme === 'light' 
          ? 'bg-gray-50' 
          : 'bg-black'
      } p-6 transition-colors duration-200`}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className={`text-3xl font-light mb-2 tracking-tight ${
              activeTheme === 'light' 
                ? 'text-gray-900' 
                : 'text-white'
            }`}>
              Analytics Dashboard
            </h1>
            <p className={`text-lg ${
              activeTheme === 'light' 
                ? 'text-gray-500' 
                : 'text-gray-400'
            }`}>
              Visitor traffic patterns and insights
            </p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CleanBarChart 
              data={peakHours} 
              title="Peak Hours Today" 
              icon={BarChart3}
              activeTheme={activeTheme}
            />
            <CleanBarChart 
              data={monthlyData} 
              title="Monthly Visitors" 
              icon={TrendingUp}
              activeTheme={activeTheme}
            />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className={`${
              activeTheme === 'light' 
                ? 'bg-white border border-gray-100' 
                : 'bg-gray-900 border border-gray-800'
            } rounded-lg p-6`}>
              <div className={`text-2xl font-light mb-2 ${
                activeTheme === 'light' 
                  ? 'text-gray-900' 
                  : 'text-white'
              }`}>
                {todayTotal.toLocaleString()}
              </div>
              <div className={`text-sm ${
                activeTheme === 'light' 
                  ? 'text-gray-500' 
                  : 'text-gray-400'
              }`}>
                Today's Visitors
              </div>
            </div>
            
            <div className={`${
              activeTheme === 'light' 
                ? 'bg-white border border-gray-100' 
                : 'bg-gray-900 border border-gray-800'
            } rounded-lg p-6`}>
              <div className={`text-2xl font-light mb-2 ${
                activeTheme === 'light' 
                  ? 'text-gray-900' 
                  : 'text-white'
              }`}>
                {monthlyTotal.toLocaleString()}
              </div>
              <div className={`text-sm ${
                activeTheme === 'light' 
                  ? 'text-gray-500' 
                  : 'text-gray-400'
              }`}>
                This Month
              </div>
            </div>
            
            <div className={`${
              activeTheme === 'light' 
                ? 'bg-white border border-gray-100' 
                : 'bg-gray-900 border border-gray-800'
            } rounded-lg p-6`}>
              <div className={`text-2xl font-light mb-2 ${
                activeTheme === 'light' 
                  ? 'text-gray-900' 
                  : 'text-white'
              }`}>
                {peakHourLabel}
              </div>
              <div className={`text-sm ${
                activeTheme === 'light' 
                  ? 'text-gray-500' 
                  : 'text-gray-400'
              }`}>
                Peak Hour
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;