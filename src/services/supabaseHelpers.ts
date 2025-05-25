
export function handleSupabaseResponse<T>(
  response: { data: T | null; error: any },
  errorMessage: string,
): T {
  if (response.error) {
    throw new Error(response.error.message || errorMessage);
  }
  
  if (!response.data) {
    throw new Error(errorMessage);
  }
  
  return response.data;
}
