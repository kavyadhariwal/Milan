import { AuthContext } from './AuthContext';
import { useContext, useCallback } from 'react';

export const useAuthFetch = () => {
  const { refreshAccessToken, logout } = useContext(AuthContext);

  const authFetch = useCallback(async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');

    // Create headers and remove Content-Type if using FormData
    const isFormData = options.body instanceof FormData;
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // If token expired, try to refresh
    if (response.status === 401) {
      accessToken = await refreshAccessToken();
      if (!accessToken) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }

      headers.Authorization = `Bearer ${accessToken}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    }

    return response;
  }, [refreshAccessToken, logout]);

  return authFetch;
};
