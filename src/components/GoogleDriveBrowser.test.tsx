import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoogleDriveBrowser from './GoogleDriveBrowser';
import { googleDriveService } from '@/services/googleDriveService';

vi.mock('@/services/googleDriveService', () => ({
  googleDriveService: {
    listFiles: vi.fn()
  }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

const mockListFiles = googleDriveService.listFiles as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetAllMocks();
});

describe('GoogleDriveBrowser', () => {
  it('renders files from the API', async () => {
    mockListFiles.mockResolvedValue({
      files: [{ id: '1', name: 'MyFile', mimeType: 'text/plain' }],
      currentFolderId: 'root'
    });

    render(<GoogleDriveBrowser />);

    await waitFor(() => {
      expect(screen.getByText('MyFile')).toBeInTheDocument();
    });
  });

  it('shows empty folder message when no files', async () => {
    mockListFiles.mockResolvedValue({ files: [], currentFolderId: 'root' });

    render(<GoogleDriveBrowser />);

    await waitFor(() => {
      expect(screen.getByText('No files found in this folder')).toBeInTheDocument();
    });
  });

  it('displays error and allows retry', async () => {
    mockListFiles.mockRejectedValueOnce(new Error('API Error'));
    mockListFiles.mockResolvedValueOnce({ files: [], currentFolderId: 'root' });

    render(<GoogleDriveBrowser />);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Try Again'));

    await waitFor(() => {
      expect(mockListFiles).toHaveBeenCalledTimes(2);
      expect(screen.getByText('No files found in this folder')).toBeInTheDocument();
    });
  });
});
