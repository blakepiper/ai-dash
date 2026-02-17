import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryInput } from './QueryInput';

test('renders textarea and submit button', () => {
  render(<QueryInput onSubmit={() => {}} />);
  expect(screen.getByLabelText('Query input')).toBeInTheDocument();
  expect(screen.getByLabelText('Send query')).toBeInTheDocument();
});

test('renders example queries', () => {
  render(<QueryInput onSubmit={() => {}} />);
  expect(screen.getByText('Try asking...')).toBeInTheDocument();
});

test('submit button disabled when input empty', () => {
  render(<QueryInput onSubmit={() => {}} />);
  expect(screen.getByLabelText('Send query')).toBeDisabled();
});
