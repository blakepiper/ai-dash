import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConversationMessage } from './ConversationMessage';
import { ConversationMessage as ConversationMessageType } from '../types';

// Mock html2canvas
jest.mock('html2canvas', () => () => Promise.resolve({ toDataURL: () => '' }));

const mockMessage: ConversationMessageType = {
  id: 'msg-1',
  userQuery: 'What are the sales?',
  response: {
    id: 'resp-1',
    type: 'text',
    text: 'Sales are up 10%.',
    explanation: 'Based on quarterly data.',
    interpretation: {
      intent: 'sales query',
      entities: ['sales'],
      dataSource: 'sales.json',
      assumptions: ['Current quarter'],
    },
    timestamp: new Date(),
  },
  timestamp: new Date(),
};

test('renders user query and response', () => {
  render(<ConversationMessage message={mockMessage} />);
  expect(screen.getByText('What are the sales?')).toBeInTheDocument();
  expect(screen.getByText('Sales are up 10%.')).toBeInTheDocument();
});
