const BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE || '';

async function handleResponse<T>(res: Response, defaultMessage: string): Promise<T> {
  if (!res.ok) {
    let body;
    try {
      body = await res.json();
    } catch {
      body = { message: res.statusText || defaultMessage };
    }
    throw new Error(body.message || defaultMessage);
  }

  return res.json();
}

export async function fetchJson<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = BASE_URL
    ? `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
    : path;

  const res = await fetch(url, options);
  return handleResponse(res, 'Unexpected error');
}

export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<any> {
  const url = BASE_URL
    ? `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
    : path;

  const formData = new FormData();
  formData.append('file', file);

  // Since fetch doesn't support progress, we're simulating progress
  // In a real implementation, you might use XMLHttpRequest or axios
  if (onProgress) {
    const simulateProgress = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress >= 90) {
          clearInterval(interval);
          progress = 90;
        }
        onProgress(progress);
      }, 200);

      return () => clearInterval(interval);
    };

    const stopProgress = simulateProgress();
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      stopProgress();
      onProgress(100);

      const result = await handleResponse(res, 'Upload failed');
      return result;
    } catch (error) {
      stopProgress();
      throw error;
    }
  }

  // If no onProgress callback, use regular fetch
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  return handleResponse(res, 'Upload failed');
}
