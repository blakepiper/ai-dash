import React, { useState } from 'react';
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
  Sector,
  ScatterChart,
  Scatter,
  ZAxis,
  Treemap,
} from 'recharts';
import { ChartData } from '../types';
import { TrendingUp, TrendingDown, Minus, ArrowUpDown } from 'lucide-react';

interface ChartRendererProps {
  chart: ChartData;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

const formatValue = (value: string | number): string => {
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return String(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label != null && <div className="chart-tooltip-label">{label}</div>}
      {payload.map((entry: any, index: number) => (
        <div key={index} className="chart-tooltip-row">
          <span
            className="chart-tooltip-dot"
            style={{ backgroundColor: entry.color || entry.fill }}
          />
          <span className="chart-tooltip-name">{entry.name}:</span>
          <span className="chart-tooltip-value">{formatValue(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill,
    payload, percent, value,
  } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" className="chart-active-label">
        {payload.name}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="chart-active-value">
        {formatValue(value)} ({(percent * 100).toFixed(1)}%)
      </text>
    </g>
  );
};

export const ChartRenderer: React.FC<ChartRendererProps> = ({ chart }) => {
  const [tableSortKey, setTableSortKey] = useState<string | null>(null);
  const [tableSortDir, setTableSortDir] = useState<'asc' | 'desc'>('asc');

  const handleTableSort = (key: string) => {
    if (tableSortKey === key) {
      setTableSortDir(tableSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setTableSortKey(key);
      setTableSortDir('asc');
    }
  };

  const renderChart = () => {
    switch (chart.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis dataKey={chart.xKey} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Array.isArray(chart.yKey) ? (
                chart.yKey.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={chart.yKey}
                  stroke={COLORS[0]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis dataKey={chart.xKey} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
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

      case 'stackedBar':
        const stackKeys = chart.stackKeys || (Array.isArray(chart.yKey) ? chart.yKey : [chart.yKey || 'value']);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis dataKey={chart.xKey} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Legend />
              {stackKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="stack"
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis dataKey={chart.xKey} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
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
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                  />
                ))
              ) : (
                <Area
                  type="monotone"
                  dataKey={chart.yKey || 'value'}
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                  fillOpacity={0.6}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2 }}
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
                activeShape={renderActiveShape}
              >
                {chart.data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'funnel':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chart.data}
              layout="vertical"
              margin={{ left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis type="number" />
              <YAxis dataKey="funnel" type="category" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
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

      case 'scatter': {
        const xKey = chart.xKey || 'x';
        const yKey = Array.isArray(chart.yKey) ? chart.yKey[0] : (chart.yKey || 'y');
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis dataKey={xKey} name={xKey} />
              <YAxis dataKey={yKey} name={yKey} />
              <ZAxis range={[40, 400]} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name={chart.title} data={chart.data} fill={COLORS[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      }

      case 'kpi': {
        const kpi = chart.kpiData;
        if (!kpi) return <div>No KPI data</div>;
        const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
        const trendColor = kpi.trend === 'up' ? '#27ae60' : kpi.trend === 'down' ? '#e74c3c' : '#95a5a6';
        return (
          <div className="kpi-card">
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{formatValue(kpi.value)}</div>
            {kpi.trend && (
              <div className="kpi-trend" style={{ color: trendColor }}>
                <TrendIcon size={18} />
                {kpi.changePercent != null && (
                  <span className="kpi-change">{kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent}%</span>
                )}
                {kpi.comparisonLabel && (
                  <span className="kpi-comparison">{kpi.comparisonLabel}</span>
                )}
              </div>
            )}
          </div>
        );
      }

      case 'table': {
        if (chart.data.length === 0) return <div>No data</div>;
        const keys = Object.keys(chart.data[0]);
        let sortedData = [...chart.data];
        if (tableSortKey) {
          sortedData.sort((a, b) => {
            const aVal = a[tableSortKey];
            const bVal = b[tableSortKey];
            const cmp = typeof aVal === 'number' && typeof bVal === 'number'
              ? aVal - bVal
              : String(aVal).localeCompare(String(bVal));
            return tableSortDir === 'asc' ? cmp : -cmp;
          });
        }
        return (
          <div className="chart-table-wrapper">
            <table className="chart-table">
              <thead>
                <tr>
                  {keys.map((key) => (
                    <th key={key} onClick={() => handleTableSort(key)}>
                      <span className="table-header-content">
                        {key}
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, i) => (
                  <tr key={i}>
                    {keys.map((key) => (
                      <td key={key}>{formatValue(row[key])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'treemap': {
        const dataKey = Array.isArray(chart.yKey) ? chart.yKey[0] : (chart.yKey || 'value');
        return (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={chart.data}
              dataKey={dataKey}
              aspectRatio={4 / 3}
              stroke="#fff"
              content={({ x, y, width, height, name, index }: any) => (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={COLORS[(index || 0) % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                  {width > 50 && height > 30 && (
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize={12}
                      fontWeight={600}
                    >
                      {name}
                    </text>
                  )}
                </g>
              )}
            />
          </ResponsiveContainer>
        );
      }

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">{chart.title}</h3>
      {chart.type === 'kpi' ? (
        renderChart()
      ) : (
        <div className="chart-responsive-wrapper">
          {renderChart()}
        </div>
      )}
    </div>
  );
};
