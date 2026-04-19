const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    ...options,
    credentials: 'include', // Crucial for sending/receiving cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, defaultOptions);
  
  if (response.status === 401 && !url.includes('/auth/login')) {
      // Optional: Handle unauthorized globally (e.g., redirect to login)
      // window.location.href = '/auth/login';
  }

  return response;
}
