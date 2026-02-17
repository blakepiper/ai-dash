import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

// Mock html2canvas
jest.mock('html2canvas', () => () => Promise.resolve({ toDataURL: () => '' }));

// Mock recharts
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

test('renders without crashing', () => {
  render(<App />);
  expect(screen.getByText('New Chat')).toBeInTheDocument();
});

test('renders sidebar and tab bar', () => {
  render(<App />);
  expect(screen.getByText('Chat History')).toBeInTheDocument();
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('New View')).toBeInTheDocument();
});

test('full query-to-response flow', async () => {
  jest.useFakeTimers();
  render(<App />);

  // Type a query
  const textarea = screen.getByLabelText('Query input');
  fireEvent.change(textarea, { target: { value: 'Show sales by category' } });

  // Submit
  const submitButton = screen.getByLabelText('Send query');
  fireEvent.click(submitButton);

  // Thinking indicator should appear
  expect(screen.getByText('Analyzing your query...')).toBeInTheDocument();

  // Advance past the loading delay
  act(() => { jest.advanceTimersByTime(500); });

  // Response should appear
  expect(screen.getByText(/Electronics dominates/)).toBeInTheDocument();
  // The user query is shown in the conversation
  expect(screen.getByText('You asked:')).toBeInTheDocument();

  jest.useRealTimers();
});
