import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

test('renders children when no error', () => {
  render(
    <ErrorBoundary>
      <div>Child content</div>
    </ErrorBoundary>
  );
  expect(screen.getByText('Child content')).toBeInTheDocument();
});

test('renders fallback on error', () => {
  // Suppress console.error for this test
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  expect(screen.getByText('Test error')).toBeInTheDocument();
  spy.mockRestore();
});
