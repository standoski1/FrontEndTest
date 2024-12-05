import { Recommendation, PaginatedResponse, AuthResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aronserver-2.onrender.com';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  return fetchWithAuth('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function getRecommendations(params: {
  cursor?: string;
  limit?: number;
  search?: string;
  tags?: string[];
}): Promise<PaginatedResponse<Recommendation>> {
  const searchParams = new URLSearchParams();
  
  if (params.cursor) searchParams.set('cursor', params.cursor);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.tags?.length) searchParams.set('tags', params.tags.join(','));

  return fetchWithAuth(`/recommendations?${searchParams.toString()}`);
}

export async function toggleArchiveStatus(
  recommendationId: string,
  archive: boolean
): Promise<{ success: boolean }> {
  const endpoint = `/recommendations/${recommendationId}/${archive ? 'archive' : 'unarchive'}`;
  return fetchWithAuth(endpoint, { method: 'POST' });
}