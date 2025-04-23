
const BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE || "";

export async function fetchJson<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = BASE_URL
    ? `${BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`
    : path;
    
  const res = await fetch(url, options);
  
  if (!res.ok) {
    let body;
    try {
      body = await res.json();
    } catch {
      body = { message: res.statusText || "An unexpected error occurred" };
    }
    throw new Error(body.message || "Unexpected error");
  }
  
  return res.json();
}

export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<any> {
  const url = BASE_URL
    ? `${BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`
    : path;
    
  const formData = new FormData();
  formData.append("file", file);
  
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
        method: "POST",
        body: formData,
      });
      
      stopProgress();
      onProgress(100);
      
      if (!res.ok) {
        let body;
        try {
          body = await res.json();
        } catch {
          body = { message: res.statusText || "An unexpected error occurred" };
        }
        throw new Error(body.message || "Upload failed");
      }
      
      return res.json();
    } catch (error) {
      stopProgress();
      throw error;
    }
  }
  
  // If no onProgress callback, use regular fetch
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  
  if (!res.ok) {
    let body;
    try {
      body = await res.json();
    } catch {
      body = { message: res.statusText || "An unexpected error occurred" };
    }
    throw new Error(body.message || "Upload failed");
  }
  
  return res.json();
}
