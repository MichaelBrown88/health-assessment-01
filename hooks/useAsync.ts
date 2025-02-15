import { useState, useCallback } from 'react';
import { handleError, ErrorResponse } from '@/utils/error-handling';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ErrorResponse | null;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorResponse = handleError(error);
      setState(prev => ({ ...prev, loading: false, error: errorResponse }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
} 