import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

// Visitor Management Chart Component
const VisitorManagementChart = () => {
  const data = [
    { month: 'Feb', totalVisitors: 180, checkedIn: 165 },
    { month: 'Mar', totalVisitors: 220, checkedIn: 205 },
    { month: 'Apr', totalVisitors: 195, checkedIn: 185 },
    { month: 'May', totalVisitors: 245, checkedIn: 230 },
    { month: 'Jun', totalVisitors: 210, checkedIn: 200 },
    { month: 'Jul', totalVisitors: 280, checkedIn: 270 },
    { month: 'Aug', totalVisitors: 255, checkedIn: 245 },
    { month: 'Sep', totalVisitors: 300, checkedIn: 285 },
    { month: 'Oct', totalVisitors: 275, checkedIn: 260 },
    { month: 'nov', totalVisitors: 275, checkedIn: 260 },
    { month: 'dec', totalVisitors: 275, checkedIn: 260 },
  ];

  const [animatedData, setAnimatedData] = useState(
    data.map(item => ({ ...item, totalVisitors: 0, checkedIn: 0 }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(data);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
              domain={[0, 320]}
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

  const hourLabels = ['8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM'];
  const maxValue = Math.max(...peakHours.map(item => item.visitors), 1);

  useEffect(() => {
    const mockData = [
      { hour: '8 AM', visitors: 12 },
      { hour: '9 AM', visitors: 25 },
      { hour: '10 AM', visitors: 18 },
      { hour: '11 AM', visitors: 30 },
      { hour: '12 PM', visitors: 45 },
      { hour: '1 PM', visitors: 38 },
      { hour: '2 PM', visitors: 28 },
      { hour: '3 PM', visitors: 35 },
      { hour: '4 PM', visitors: 22 },
      { hour: '5 PM', visitors: 15 },
    ];

    setPeakHours(mockData);
    setTodayTotal(mockData.reduce((sum, h) => sum + h.visitors, 0));
  }, []);

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

  const svgSize = 200; // Made smaller as requested

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Traffic</h3>
      
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