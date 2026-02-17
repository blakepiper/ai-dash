import React from 'react';
import { render, screen } from '@testing-library/react';
import { TabBar } from './TabBar';
import { View } from '../types';

const mockViews: View[] = [
  { id: 'home', name: 'Home', messages: [], createdAt: new Date() },
  { id: 'v1', name: 'Analysis 1', messages: [], createdAt: new Date() },
];

test('renders tabs and new view button', () => {
  render(
    <TabBar
      views={mockViews}
      activeViewId="home"
      onSelectView={() => {}}
      onNewView={() => {}}
      onCloseView={() => {}}
    />
  );
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Analysis 1')).toBeInTheDocument();
  expect(screen.getByText('New View')).toBeInTheDocument();
});

test('has ARIA tablist role', () => {
  render(
    <TabBar
      views={mockViews}
      activeViewId="home"
      onSelectView={() => {}}
      onNewView={() => {}}
      onCloseView={() => {}}
    />
  );
  expect(screen.getByRole('tablist')).toBeInTheDocument();
});
