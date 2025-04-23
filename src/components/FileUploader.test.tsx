import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileUploader } from './FileUploader';
import { useAppStore } from '@/hooks/useAppStore';

// Mock fetch
vi.mock('node:fetch', () => ({
  default: vi.fn(),
}));

// Mock the Zustand store
vi.mock('@/hooks/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

describe('FileUploader minimal render', () => {
  it('renders the file uploader root', () => {
    render(<FileUploader />);
    expect(screen.getByTestId('file-uploader')).toBeInTheDocument();
  });
});

describe('FileUploader', () => {
  const mockSetStatus = vi.fn();
  const mockSetStoreId = vi.fn();
  const mockSetError = vi.fn();
  const mockOnUploaded = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    // Set up the Zustand store mock
    (useAppStore as any).mockReturnValue({
      status: 'idle',
      error: null,
      storeId: null,
      setStatus: mockSetStatus,
      setStoreId: mockSetStoreId,
      setError: mockSetError,
    });

    // Mock fetch response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ storeId: 'test-store-id' }),
    });
  });

  it('renders the dropzone correctly', () => {
    render(<FileUploader />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(
      screen.getByText(/Drag & drop PDF or DOCX here/i)
    ).toBeInTheDocument();
  });

  it('rejects unsupported file types', async () => {
    render(<FileUploader />);

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const inputEl = screen.getByRole('button');

    // Handle file input change
    fireEvent.drop(inputEl, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(mockSetError).toHaveBeenCalledWith(
      'Only PDF or DOCX files are allowed.'
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('rejects files larger than 20MB', async () => {
    render(<FileUploader />);

    // Create a mock file that exceeds the size limit
    const largeFile = new File(['x'.repeat(21 * 1024 * 1024)], 'large.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(largeFile, 'size', { value: 21 * 1024 * 1024 });

    const inputEl = screen.getByRole('button');

    // Handle file input change
    fireEvent.drop(inputEl, {
      dataTransfer: {
        files: [largeFile],
      },
    });

    expect(mockSetError).toHaveBeenCalledWith('File size exceeds 20MB limit.');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('uploads valid PDF file and updates state on success', async () => {
    render(<FileUploader onUploaded={mockOnUploaded} />);

    const file = new File(['dummy content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const inputEl = screen.getByRole('button');

    // Handle file input change
    fireEvent.drop(inputEl, {
      dataTransfer: {
        files: [file],
      },
    });

    // Verify upload started
    expect(mockSetStatus).toHaveBeenCalledWith('uploading');

    // Wait for upload to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/upload_rft',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );

      expect(mockSetStatus).toHaveBeenCalledWith('uploaded');
      expect(mockSetStoreId).toHaveBeenCalledWith('test-store-id');
      expect(mockOnUploaded).toHaveBeenCalledWith('test-store-id');
    });
  });

  it('handles upload error correctly', async () => {
    // Mock fetch to return an error
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Upload failed on server' }),
    });

    render(<FileUploader />);

    const file = new File(['dummy content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const inputEl = screen.getByRole('button');

    // Handle file input change
    fireEvent.drop(inputEl, {
      dataTransfer: {
        files: [file],
      },
    });

    // Wait for error handling
    await waitFor(() => {
      expect(mockSetStatus).toHaveBeenCalledWith('error');
      expect(mockSetError).toHaveBeenCalledWith('Upload failed on server');
    });
  });
});
