
import { FunctionsResponse } from '@supabase/supabase-js';

export function handleSupabaseResponse<T>(
  response: FunctionsResponse<T>,
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
