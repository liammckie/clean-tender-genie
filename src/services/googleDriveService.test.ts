import { describe, it, expect, vi, beforeEach } from 'vitest';
import { googleDriveService } from './googleDriveService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));

const mockInvoke = supabase.functions.invoke as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetAllMocks();
});

describe('googleDriveService.listFiles', () => {
  it('returns files when API succeeds', async () => {
    mockInvoke.mockResolvedValue({
      data: { success: true, data: { files: [{ id: '1', name: 'Doc', mimeType: 'text/plain' }], currentFolderId: '1' } }
    } as any);

    const result = await googleDriveService.listFiles('1');
    expect(result).toEqual({ files: [{ id: '1', name: 'Doc', mimeType: 'text/plain' }], currentFolderId: '1' });
    expect(mockInvoke).toHaveBeenCalled();
  });

  it('returns empty list on invalid structure', async () => {
    mockInvoke.mockResolvedValue({ data: { invalid: true } } as any);

    const result = await googleDriveService.listFiles('root');
    expect(result).toEqual({ files: [], currentFolderId: 'root' });
  });

  it('throws on API error', async () => {
    mockInvoke.mockResolvedValue({ error: { message: 'fail' } } as any);

    await expect(googleDriveService.listFiles('root')).rejects.toThrow('fail');
  });
});

describe('googleDriveService.downloadFile', () => {
  it('returns file data when API succeeds', async () => {
    mockInvoke.mockResolvedValue({
      data: {
        success: true,
        data: { id: 'f1', name: 'file.txt', mimeType: 'text/plain', content: 'abc' }
      }
    } as any);

    const result = await googleDriveService.downloadFile('f1');
    expect(result).toEqual({ id: 'f1', name: 'file.txt', mimeType: 'text/plain', content: 'abc' });
  });

  it('throws on invalid response structure', async () => {
    mockInvoke.mockResolvedValue({ data: { success: false } } as any);

    await expect(googleDriveService.downloadFile('f2')).rejects.toThrow('Invalid file download response structure');
  });

  it('throws on API error', async () => {
    mockInvoke.mockResolvedValue({ error: { message: 'boom' } } as any);

    await expect(googleDriveService.downloadFile('f2')).rejects.toThrow('boom');
  });
});
