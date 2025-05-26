
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GoogleDriveBrowser from './GoogleDriveBrowser';

// Mock the Google Drive service
vi.mock('@/services/googleDriveService', () => ({
  listFiles: vi.fn(() => Promise.resolve([])),
}));

describe('GoogleDriveBrowser', () => {
  it('renders google drive browser', () => {
    const { getByText } = render(<GoogleDriveBrowser />);
    expect(getByText(/loading/i)).toBeInTheDocument();
  });
});
