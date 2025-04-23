import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { parseESLintOutput } from './utils/parser';

// Mock the parser module
vi.mock('./utils/parser', () => ({
  parseESLintOutput: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    (parseESLintOutput as any).mockReturnValue([]);
    console.error = vi.fn();
  });

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

  it('loads saved input from localStorage on initial render', () => {
    const savedInput = 'test input';
    const encodedInput = btoa(encodeURIComponent(savedInput));
    localStorageMock.getItem.mockReturnValue(encodedInput);

    render(<App />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(savedInput);
  });

  it('handles localStorage load errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    render(<App />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('');
    expect(console.error).toHaveBeenCalledWith('Failed to load saved input:', expect.any(Error));
  });

  it('handles decompression errors gracefully', () => {
    // Use a valid base64 string that decodes to invalid URI characters
    const invalidData = btoa('%E0%A4%A'); // Incomplete percent-encoding
    localStorageMock.getItem.mockReturnValue(invalidData);

    render(<App />);
    expect(console.error).toHaveBeenCalledWith('Decompression failed:', expect.any(Error));
  });

  it('saves input to localStorage when changed', () => {
    render(<App />);
    const newInput = 'new test input';
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: newInput } });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'dependency-cycle-analyzer-input',
      btoa(encodeURIComponent(newInput))
    );
  });

  it('handles localStorage save errors', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    render(<App />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test input' } });

    expect(screen.getByText(/Failed to save input/i)).toBeInTheDocument();
  });

  it('shows size warning when input is too large', () => {
    const largeInput = 'a'.repeat(2 * 1024 * 1024); // 2MB of data
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste your ESLint output here/i);
    fireEvent.change(textarea, { target: { value: largeInput } });

    expect(screen.getByText(/Warning: Large input may affect performance/i)).toBeInTheDocument();
  });

  it('shows storage error when input is too large to save', () => {
    const hugeInput = 'a'.repeat(6 * 1024 * 1024); // 6MB of data (exceeds 5MB limit)
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste your ESLint output here/i);
    fireEvent.change(textarea, { target: { value: hugeInput } });

    expect(screen.getByText(/Input is too large to save/i)).toBeInTheDocument();
  });

  it('clears input and localStorage when clear button is clicked', () => {
    render(<App />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test input' } });

    const clearButton = screen.getByText(/Clear/i);
    fireEvent.click(clearButton);

    expect(textarea).toHaveValue('');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('dependency-cycle-analyzer-input');
  });

  it('updates cycles when input changes', () => {
    const mockCycles = [
      {
        id: '1',
        nodes: ['a', 'b'],
        edges: [
          ['a', 'b'],
          ['b', 'a'],
        ],
        cyclePath: ['a', 'b', 'a'],
      },
    ];
    (parseESLintOutput as any).mockReturnValue(mockCycles);

    render(<App />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test input' } });

    expect(parseESLintOutput).toHaveBeenCalledWith('test input');
    expect(screen.queryByText(/Example ESLint Output/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('visualization-section')).toBeInTheDocument();
  });
});
