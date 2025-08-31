import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import api from '../api/axios';

// Visitor Management Chart Component
const VisitorManagementChart = () => {
  const [data, setData] = useState([]);

  const [animatedData, setAnimatedData] = useState([]);

  useEffect(() => {
    const fetchMonthlyTrends = async () => {
      try {
        const response = await api.get('/api/visitors/');
        if (response.data) {
          // Compute monthly trends from visitors data
          const visitors = response.data;
          const today = new Date();
          const monthlyTrendsData = [];
          for (let i = 11; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const monthVisitors = visitors.filter(visitor => {
              const checkInDate = new Date(visitor.check_in_time || visitor.created_at);
              return checkInDate >= monthStart && checkInDate <= monthEnd;
            });

            monthlyTrendsData.push({
              month: date.toLocaleDateString('en-US', { month: 'short' }),
              totalVisitors: monthVisitors.length,
              checkedIn: monthVisitors.filter(v => v.status === 'checked_in' || v.status === 'Checked In').length
            });
          }
          setData(monthlyTrendsData);
          setAnimatedData(monthlyTrendsData.map(item => ({ ...item, totalVisitors: 0, checkedIn: 0 })));
          setTimeout(() => {
            setAnimatedData(monthlyTrendsData);
          }, 300);
        }
      } catch (error) {
        console.error('Failed to fetch monthly trends:', error);
      }
    };

    fetchMonthlyTrends();
  }, []);

  // Calculate dynamic y-axis domain based on data
  const maxValue = Math.max(
    ...animatedData.map(item => Math.max(item.totalVisitors || 0, item.checkedIn || 0)),
    1 // Minimum value to avoid 0
  );
  const yAxisMax = Math.ceil(maxValue + 5); // Add 5 padding to the highest value

  return (
    <div className="bg-white w-[fit] rounded-lg shadow-sm border border-gray-100 p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Yearly Chart</h3>

      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={animatedData}
            margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#D3D3D3"
              horizontal={true}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              domain={[0, yAxisMax]}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                      <p className="text-sm font-medium text-gray-900 mb-2">{`${label}`}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                          {`${entry.dataKey === 'totalVisitors' ? 'Total Visitors' : 'Checked In'}: ${entry.value}`}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar
              dataKey="totalVisitors" 
              fill="#aeb1b5"
              radius={[20, 20, 0, 0]}
              animationDuration={1500}
              animationBegin={0}
              animationEasing="ease-out"
            />
            
            <Bar 
              dataKey="checkedIn" 
              fill="#3b82f6"
              radius={[20, 20, 0, 0]}
              animationDuration={1500}
              animationBegin={200}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center mt-4 gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-300 rounded-sm"></div>
          <span className="text-sm text-gray-600">Total Visitors</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span className="text-sm text-gray-600">Checked In</span>
        </div>
      </div>
    </div>
  );
};

// Support Tracker Style Progress Ring
const ProgressRing = ({ value, size = 120 }) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3b82f6"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-500 mb-1">Completed Task</span>
          <span className="text-2xl font-bold text-gray-900">{value}</span>
        </div>
      </div>
    </div>
  );
};

// Circular Daily Chart Component with Hover
const CircularHeatMap = () => {
  const [peakHours, setPeakHours] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [chartMode, setChartMode] = useState('daily'); // 'daily' or 'weekly'
  const [chartTitle, setChartTitle] = useState('Daily Traffic');

  const svgSize = 200; // Made smaller as requested

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/visitors/');
        if (response.data) {
          const visitors = response.data;
          const today = new Date();
          const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

          // Filter today's visitors
          const todaysVisitors = visitors.filter(visitor => {
            const checkInDate = new Date(visitor.check_in_time || visitor.created_at);
            return checkInDate >= startOfToday;
          });

          // Check if there's data for today
          if (todaysVisitors.length > 0) {
            // Show daily traffic
            setChartMode('daily');
            setChartTitle('Daily Traffic');

            // Compute peak hours for 8 AM to 5 PM
            const hoursRange = Array.from({ length: 10 }, (_, i) => 8 + i);
            const peakHoursData = hoursRange.map(hour => {
              return {
                hour: `${hour} ${hour < 12 ? 'AM' : 'PM'}`,
                visitors: todaysVisitors.filter(visitor => {
                  const checkInHour = new Date(visitor.check_in_time || visitor.created_at).getHours();
                  return checkInHour === hour;
                }).length
              };
            });

            setPeakHours(peakHoursData);
            setTodayTotal(todaysVisitors.length);
          } else {
            // Show last month's four-week data
            setChartMode('weekly');
            setChartTitle('Last Month (4 Weeks)');

            // Get last month's data
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

            const lastMonthVisitors = visitors.filter(visitor => {
              const checkInDate = new Date(visitor.check_in_time || visitor.created_at);
              return checkInDate >= lastMonth && checkInDate <= lastMonthEnd;
            });

            // Divide last month into 4 weeks
            const weeksData = [];
            for (let week = 0; week < 4; week++) {
              const weekStart = new Date(lastMonth);
              weekStart.setDate(week * 7 + 1);
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekStart.getDate() + 6);

              const weekVisitors = lastMonthVisitors.filter(visitor => {
                const checkInDate = new Date(visitor.check_in_time || visitor.created_at);
                return checkInDate >= weekStart && checkInDate <= weekEnd;
              });

              weeksData.push({
                hour: `Week ${week + 1}`,
                visitors: weekVisitors.length
              });
            }

            setPeakHours(weeksData);
            setTodayTotal(lastMonthVisitors.length);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const maxValue = Math.max(...peakHours.map(item => item.visitors), 1);

  const getSegmentColor = (visitors, maxValue) => {
    const percentage = (visitors / maxValue) * 100;
    if (percentage >= 80) return '#3b82f6';
    else if (percentage >= 60) return '#60a5fa';
    else if (percentage >= 40) return '#93c5fd';
    else if (percentage >= 20) return '#bfdbfe';
    else return '#dbeafe';
  };

  const createSegmentPath = (index, visitors, maxValue, svgSize) => {
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    const innerRadius = svgSize * 0.2;
    const maxOuterRadius = svgSize * 0.45;
    
    const percentage = visitors / maxValue;
    const outerRadius = innerRadius + (percentage * (maxOuterRadius - innerRadius));
    
    const totalSegments = peakHours.length;
    const segmentAngle = (2 * Math.PI) / totalSegments;
    const startAngle = index * segmentAngle - Math.PI / 2;
    const endAngle = (index + 1) * segmentAngle - Math.PI / 2;
    
    const x1 = centerX + innerRadius * Math.cos(startAngle);
    const y1 = centerY + innerRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(startAngle);
    const y2 = centerY + outerRadius * Math.sin(startAngle);
    const x3 = centerX + outerRadius * Math.cos(endAngle);
    const y3 = centerY + outerRadius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(endAngle);
    const y4 = centerY + innerRadius * Math.sin(endAngle);
    
    const largeArcFlag = segmentAngle > Math.PI ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
      Z
    `;
  };

  const getLabelPosition = (index, svgSize) => {
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    const labelRadius = svgSize * 0.52;
    
    const totalSegments = peakHours.length;
    const segmentAngle = (2 * Math.PI) / totalSegments;
    const angle = index * segmentAngle + segmentAngle / 2 - Math.PI / 2;
    
    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle)
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{chartTitle}</h3>
      
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative">
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            {/* Heat map segments */}
            {peakHours.map((item, index) => (
              <g key={index}>
                <path
                  d={createSegmentPath(index, item.visitors, maxValue, svgSize)}
                  fill={getSegmentColor(item.visitors, maxValue)}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-200 hover:opacity-80 cursor-pointer"
                  onMouseEnter={() => setHoveredSegment(item)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              </g>
            ))}
            
            {/* Center circle with total */}
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={svgSize * 0.15}
              fill="white"
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            <text
              x={svgSize / 2}
              y={svgSize / 2 - 5}
              textAnchor="middle"
              className="text-xs fill-gray-500 font-medium"
            >
              Total
            </text>
            <text
              x={svgSize / 2}
              y={svgSize / 2 + 10}
              textAnchor="middle"
              className="text-lg font-bold fill-gray-900"
            >
              {todayTotal}
            </text>
          </svg>
          
          {/* Hour labels */}
          {peakHours.map((item, index) => {
            const pos = getLabelPosition(index, svgSize);
            return (
              <div
                key={index}
                className="absolute text-xs font-medium text-gray-600 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: pos.x,
                  top: pos.y
                }}
              >
                {item.hour}
              </div>
            );
          })}
          
          {/* Hover tooltip */}
          {hoveredSegment && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10">
              {hoveredSegment.hour}: {hoveredSegment.visitors} visitors
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// Main Charts Container Component with Support Tracker
export default function ResponsiveChartsContainer({ sidenavExpanded = false }) {
  return (
    <div className={`w-full p-4 sm:p-6 min-h-screen transition-all duration-300`}>
      
      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Visitor Management Chart - Takes 2 columns on xl screens */}
        <div className="lg:col-span-1 xl:col-span-2">
          <VisitorManagementChart />
        </div>
        
        {/* Daily Heat Map Chart */}
        <div className="lg:col-span-1">
          <CircularHeatMap />
        </div>
      </div>
    </div>
  );
}