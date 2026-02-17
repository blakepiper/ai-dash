import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '../types';

interface ChartRendererProps {
  chart: ChartData;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export const ChartRenderer: React.FC<ChartRendererProps> = ({ chart }) => {
  const renderChart = () => {
    switch (chart.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {Array.isArray(chart.yKey) ? (
                chart.yKey.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={chart.yKey}
                  stroke={COLORS[0]}
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {Array.isArray(chart.yKey) ? (
                chart.yKey.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))
              ) : (
                <Bar dataKey={chart.yKey} fill={COLORS[0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {Array.isArray(chart.yKey) ? (
                chart.yKey.map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.6}
                  />
                ))
              ) : (
                <Area
                  type="monotone"
                  dataKey={chart.yKey || 'value'}
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                  fillOpacity={0.6}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieDataKey = Array.isArray(chart.yKey) ? chart.yKey[0] : (chart.yKey || 'percentage');
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage, percent }: any) =>
                  `${name}: ${percentage || ((percent as number) * 100).toFixed(1)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey={pieDataKey}
              >
                {chart.data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'funnel':
        // Custom funnel using bar chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chart.data}
              layout="vertical"
              margin={{ left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="funnel" type="category" />
              <Tooltip />
              <Bar dataKey="users" fill={COLORS[0]}>
                {chart.data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">{chart.title}</h3>
      <div className="chart-responsive-wrapper">
        {renderChart()}
      </div>
    </div>
  );
};
