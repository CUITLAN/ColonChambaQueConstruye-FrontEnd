
export class ApiService {
  private readonly apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = '/api/v1';
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request(endpointPath: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.apiBaseUrl}${endpointPath}`;

    const headers = {
      ...this.getHeaders(),
      ...((options.headers as Record<string, string>) || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      return response; 
    } catch (error) {
      console.error('Error en ApiService.request:', error);
      throw error instanceof Error
        ? error
        : new Error('Network error in ApiService.request');
    }
  }

  async get(endpoint: string): Promise<Response> {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data?: unknown): Promise<Response> {
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: unknown): Promise<Response> {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string): Promise<Response> {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async patch(endpoint: string, data?: unknown): Promise<Response> {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async getTestWithToken(endpointPath: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization':
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjdjZTg0NTIyYTBjNzJiN2EwYzEyNiIsInN0YXR1cyI6IkFDVElWQSIsImVtYWlsIjoiZW1wbG95ZXJfYWN0aXZvQGVtcHJlc2EuY29tIiwiaWF0IjoxNzYzNzIyODQ0LCJleHAiOjE3NjQzMjc2NDR9.tE7PiUGyakBZ9TEVlVAtlkdtpIPG__hZnaJme88z4g8',
    };

    const url = `${this.apiBaseUrl}${endpointPath}`;
    console.log(url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    console.log('Data: ', data.data);
    return data.data;
  }
}

export const apiService = new ApiService();