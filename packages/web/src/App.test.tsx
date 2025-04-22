import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Dependency Cycle Analyzer/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the file upload section', () => {
    render(<App />);
    const uploadElement = screen.getByText(/Upload your project files/i);
    expect(uploadElement).toBeInTheDocument();
  });

  it('renders the visualization section', () => {
    render(<App />);
    const visualizationElement = screen.getByText(/Dependency Graph/i);
    expect(visualizationElement).toBeInTheDocument();
  });
}); 