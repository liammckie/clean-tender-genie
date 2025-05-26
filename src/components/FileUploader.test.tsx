
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileUploader } from './FileUploader';

describe('FileUploader', () => {
  it('renders file uploader component', () => {
    const { getByText } = render(<FileUploader />);
    expect(getByText(/drag and drop/i)).toBeInTheDocument();
  });
});
