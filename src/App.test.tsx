import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import App from './App';

// Mock html2canvas
jest.mock('html2canvas', () => () => Promise.resolve({ toDataURL: () => '' }));

// Mark setup wizard as complete so tests can access the main UI
beforeEach(() => {
  localStorage.setItem('ai-dash-setup', JSON.stringify({ isComplete: true, currentStep: 4 }));
});
afterEach(() => {
  localStorage.clear();
});

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
  ScatterChart: ({ children }: any) => <div>{children}</div>,
  Scatter: () => null,
  ZAxis: () => null,
  Treemap: () => null,
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
  render(<App />);

  // Type a query
  const textarea = screen.getByLabelText('Query input');
  fireEvent.change(textarea, { target: { value: 'Show sales by category' } });

  // Submit
  const submitButton = screen.getByLabelText('Send query');
  await act(async () => {
    fireEvent.click(submitButton);
  });

  // Response should appear
  await waitFor(() => {
    expect(screen.getByText(/Electronics dominates/)).toBeInTheDocument();
  });
  // The user query is shown in the conversation
  expect(screen.getByText('You asked:')).toBeInTheDocument();
});
