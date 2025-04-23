import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Dependency Cycle Analyzer/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the input section', () => {
    render(<App />);
    const inputElement = screen.getByText(/Paste ESLint Output/i);
    expect(inputElement).toBeInTheDocument();
  });

  it('renders the example section when no input', () => {
    render(<App />);
    const exampleElement = screen.getByText(/Example ESLint Output/i);
    expect(exampleElement).toBeInTheDocument();
  });
});
