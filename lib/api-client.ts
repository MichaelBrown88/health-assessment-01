import { auth } from '@/lib/firebase';

interface ApiClientOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export async function apiClient<T>({ 
  endpoint, 
  method = 'GET', 
  body,
  requiresAuth = true 
}: ApiClientOptions): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = await getAuthToken();
    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.message || `API call failed with status ${response.status}`
    );
  }

  return response.json();
}

// Type-safe API endpoints
export const api = {
  healthCoach: {
    chat: (message: string) => 
      apiClient<{ response: string }>({
        endpoint: 'health-coach',
        method: 'POST',
        body: { message }
      })
  },
  
  leads: {
    create: (data: { email: string; name: string }) =>
      apiClient<{ success: boolean }>({
        endpoint: 'leads',
        method: 'POST',
        body: data
      })
  }
}; 