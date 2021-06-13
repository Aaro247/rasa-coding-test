import React, { useState as useStateMock } from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import App from '../components/App';
import EntityHighlighter from '../components/EntityHighlighter';

describe("EntityHighlighter test suite", () => {

  it("input field render correctly", () => {
    const { getByTestId } = render(<EntityHighlighter />);
    const inputDiv = getByTestId("input");
    expect(inputDiv).toBeInTheDocument();
  });

  it("hightlighter render correctly", () => {
    const { getByTestId } = render(<App><EntityHighlighter /></App>);
    const hightlighter = getByTestId("highlighter-test");
    expect(hightlighter).toBeInTheDocument();
  });
});