import { create } from 'zustand';

type UploadStatus = 'idle' | 'uploading' | 'uploaded' | 'error';

interface AppState {
  storeId: string | null;
  taskId: string | null;
  status: UploadStatus;
  error: string | null;
  setStatus: (status: UploadStatus) => void;
  setStoreId: (storeId: string | null) => void;
  setTaskId: (taskId: string | null) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  storeId: null,
  taskId: null,
  status: 'idle',
  error: null,
  setStatus: (status) => set({ status }),
  setStoreId: (storeId) => set({ storeId }),
  setTaskId: (taskId) => set({ taskId }),
  setError: (error) => set({ error }),
}));
