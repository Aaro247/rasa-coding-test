import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import App from '../components/App';

test('renders App component', () => {
  const { getByText } = render(<App />);
  const header = getByText(/Entity Highlighting/i);
  expect(header).toBeInTheDocument();
});

test('renders EntityHighlighter component', () => {
  const { getByText } = render(<App />);
  const header = getByText(/Please click outside text area to save text changes/i);
  expect(header).toBeInTheDocument();
});
