import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { ChatSession } from '../types';

const mockSession: ChatSession = {
  id: 'test-1',
  name: 'Test Session',
  views: [{ id: 'home', name: 'Home', messages: [], createdAt: new Date() }],
  lastAccessed: new Date(),
};

test('renders sidebar with session', () => {
  render(
    <Sidebar
      sessions={[mockSession]}
      currentSessionId="test-1"
      onSelectSession={() => {}}
      onNewSession={() => {}}
      onRenameSession={() => {}}
      onDeleteSession={() => {}}
    />
  );
  expect(screen.getByText('Test Session')).toBeInTheDocument();
  expect(screen.getByText('New Chat')).toBeInTheDocument();
  expect(screen.getByText('Chat History')).toBeInTheDocument();
});

test('renders empty state with no sessions', () => {
  render(
    <Sidebar
      sessions={[]}
      currentSessionId=""
      onSelectSession={() => {}}
      onNewSession={() => {}}
      onRenameSession={() => {}}
      onDeleteSession={() => {}}
    />
  );
  expect(screen.getByText('No chat history yet')).toBeInTheDocument();
});
