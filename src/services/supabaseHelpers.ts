export interface SupabaseResponse<T> {
  data?: { success?: boolean; data?: T };
  error?: { message?: string };
}

export function handleSupabaseResponse<T>(
  response: SupabaseResponse<T>,
  errorMessage: string,
): T {
  if (response.error) {
    throw new Error(response.error.message || errorMessage);
  }
  const data = response.data;
  if (!data || !data.success || data.data === undefined) {
    throw new Error(errorMessage);
  }
  return data.data as T;
}
