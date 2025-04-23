
import { create } from 'zustand';

type UploadStatus = "idle" | "uploading" | "uploaded" | "error";

interface AppState {
  storeId: string | null;
  status: UploadStatus;
  error: string | null;
  setStatus: (status: UploadStatus) => void;
  setStoreId: (storeId: string | null) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  storeId: null,
  status: "idle",
  error: null,
  setStatus: (status) => set({ status }),
  setStoreId: (storeId) => set({ storeId }),
  setError: (error) => set({ error }),
}));
