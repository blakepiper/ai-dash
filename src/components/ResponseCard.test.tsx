import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResponseCard } from './ResponseCard';
import { ResponseMessage } from '../types';

// Mock html2canvas to avoid canvas errors in tests
jest.mock('html2canvas', () => () => Promise.resolve({ toDataURL: () => '' }));

// Mock recharts to avoid SVG rendering issues
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => null,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => null,
  AreaChart: ({ children }: any) => <div>{children}</div>,
  Area: () => null,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

const textResponse: ResponseMessage = {
  id: 'test-1',
  type: 'text',
  text: 'Test response text',
  explanation: 'Test explanation',
  interpretation: {
    intent: 'test',
    entities: ['entity1'],
    dataSource: 'test.json',
    assumptions: ['assumption1'],
  },
  timestamp: new Date(),
};

const chartResponse: ResponseMessage = {
  ...textResponse,
  id: 'test-2',
  type: 'mixed',
  chart: {
    type: 'bar',
    data: [{ name: 'A', value: 10 }],
    xKey: 'name',
    yKey: 'value',
    title: 'Test Chart',
  },
};

test('renders text response', () => {
  render(<ResponseCard response={textResponse} />);
  expect(screen.getByText('Test response text')).toBeInTheDocument();
  expect(screen.getByText('Test explanation')).toBeInTheDocument();
});

test('renders chart response with export buttons', () => {
  render(<ResponseCard response={chartResponse} />);
  expect(screen.getByText('Test Chart')).toBeInTheDocument();
  expect(screen.getByText('Export CSV')).toBeInTheDocument();
  expect(screen.getByText('Download Chart')).toBeInTheDocument();
});
