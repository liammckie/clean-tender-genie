
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileUploader } from './FileUploader';

describe('FileUploader', () => {
  it('renders file uploader component', () => {
    render(<FileUploader />);
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });
});
