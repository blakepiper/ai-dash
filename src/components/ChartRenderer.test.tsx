import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartRenderer } from './ChartRenderer';

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => null,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

test('renders line chart', () => {
  render(
    <ChartRenderer chart={{
      type: 'line',
      data: [{ x: 1, y: 2 }],
      xKey: 'x',
      yKey: 'y',
      title: 'Line Test',
    }} />
  );
  expect(screen.getByText('Line Test')).toBeInTheDocument();
  expect(screen.getByTestId('line-chart')).toBeInTheDocument();
});

test('renders bar chart', () => {
  render(
    <ChartRenderer chart={{
      type: 'bar',
      data: [{ x: 1, y: 2 }],
      xKey: 'x',
      yKey: 'y',
      title: 'Bar Test',
    }} />
  );
  expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
});

test('renders pie chart', () => {
  render(
    <ChartRenderer chart={{
      type: 'pie',
      data: [{ name: 'A', percentage: 50 }],
      title: 'Pie Test',
    }} />
  );
  expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
});
