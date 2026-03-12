import { useState } from 'react';
import { ChevronLeft, Download, Clock, Target, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { getStatistics } from '../data/mockDetections';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalyticsPanelProps {
  onClose: () => void;
}

export function AnalyticsPanel({ onClose }: AnalyticsPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const stats = getStatistics();

  const totalDetections = stats.person.count + stats.car.count + stats.truck.count;

  const chartData = [
    { name: 'Person', count: stats.person.count, color: '#6366f1' },
    { name: 'Car', count: stats.car.count, color: '#22c55e' },
    { name: 'Truck', count: stats.truck.count, color: '#f59e0b' },
  ];

  const screenTimeData = [
    { name: 'Person', time: stats.person.totalTime, color: '#6366f1' },
    { name: 'Car', time: stats.car.totalTime, color: '#22c55e' },
    { name: 'Truck', time: stats.truck.totalTime, color: '#f59e0b' },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const exportCSV = () => {
    const csvContent = [
      ['Object Type', 'Count', 'Total Screen Time (s)', 'Avg Confidence (%)'],
      ['Person', stats.person.count, stats.person.totalTime.toFixed(1), (stats.person.avgConfidence * 100).toFixed(1)],
      ['Car', stats.car.count, stats.car.totalTime.toFixed(1), (stats.car.avgConfidence * 100).toFixed(1)],
      ['Truck', stats.truck.count, stats.truck.totalTime.toFixed(1), (stats.truck.avgConfidence * 100).toFixed(1)],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drone_analytics.csv';
    a.click();
  };

  if (collapsed) {
    return (
      <motion.div
        className="h-full bg-[#F8FAFC] border-l border-gray-200 flex flex-col items-center py-4 w-14"
        initial={{ width: 300 }}
        animate={{ width: 56 }}
      >
        <button
          onClick={() => setCollapsed(false)}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="h-full bg-[#F8FAFC] border-l border-gray-200 flex flex-col w-72"
      initial={{ width: 56 }}
      animate={{ width: 288 }}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm text-gray-900">Analytics</h2>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Summary Stats */}
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs text-gray-500">Total Detections</span>
            </div>
            <div className="text-xl text-gray-900">{totalDetections}</div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-gray-500">Active Tracks</span>
            </div>
            <div className="text-xl text-gray-900">
              {stats.person.count + stats.car.count + stats.truck.count}
            </div>
          </div>
        </div>

        {/* Detections by Class */}
        <div>
          <h3 className="text-xs text-gray-500 mb-2">Detections by Class</h3>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#d1d5db" style={{ fontSize: '11px' }} tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#d1d5db" style={{ fontSize: '11px' }} tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  color: '#374151',
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Screen Time */}
        <div>
          <h3 className="text-xs text-gray-500 mb-2">Total Screen Time</h3>
          <div className="space-y-2">
            {screenTimeData.map((item) => (
              <div key={item.name} className="bg-white rounded-md p-2.5 border border-gray-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(item.time)}</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.time / Math.max(...screenTimeData.map((d) => d.time))) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Average Confidence */}
        <div>
          <h3 className="text-xs text-gray-500 mb-2">Average Confidence</h3>
          <div className="space-y-1.5">
            {[
              { name: 'Person', confidence: stats.person.avgConfidence, color: '#6366f1' },
              { name: 'Car', confidence: stats.car.avgConfidence, color: '#22c55e' },
              { name: 'Truck', confidence: stats.truck.avgConfidence, color: '#f59e0b' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-700">{item.name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {(item.confidence * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Active Period */}
        <div>
          <h3 className="text-xs text-gray-500 mb-2">Most Active Period</h3>
          <div className="bg-white rounded-md p-2.5 border border-gray-200">
            <div className="flex items-center gap-2 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-gray-700">0:30 - 1:30</span>
            </div>
            <span className="text-[11px] text-gray-400">Peak detection activity</span>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={exportCSV}
          className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md transition-colors text-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>
    </motion.div>
  );
}
