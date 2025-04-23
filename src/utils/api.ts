
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
      body = { message: res.statusText };
    }
    throw new Error(body.message || "Unexpected error");
  }
  return res.json();
}
