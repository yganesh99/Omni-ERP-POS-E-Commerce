import axios from 'axios';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add access token
api.interceptors.request.use(
	(config) => {
		const token =
			typeof window !== 'undefined'
				? localStorage.getItem('accessToken')
				: null;
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response interceptor to handle 401 errors and refresh token
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Check if the error is 401 Unauthorized, and we haven't retried yet
		// Also ensuring we don't end up in an infinite loop if the refresh token endpoint itself fails (e.g. 401)
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			originalRequest.url !== '/auth/refresh' &&
			originalRequest.url !== '/auth/login' &&
			typeof window !== 'undefined'
		) {
			originalRequest._retry = true;
			const refreshToken = localStorage.getItem('refreshToken');

			if (refreshToken) {
				try {
					// Attempt to refresh token using another axios instance to avoid circular interceptors
					const refreshRes = await axios.post(
						`${api.defaults.baseURL}/auth/refresh`,
						{
							refreshToken,
						},
					);

					const newAccessToken = refreshRes.data.accessToken;
					localStorage.setItem('accessToken', newAccessToken);

					// Update Authorization header for original request and retry
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return api(originalRequest);
				} catch (refreshError) {
					// If refresh token fails (e.g. expired or invalid), logout the user
					console.error('Refresh token failed:', refreshError);
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					// Dispatch a custom event to notify AuthContext to log out
					window.dispatchEvent(new Event('auth:unauthorized'));
					return Promise.reject(refreshError);
				}
			} else {
				// No refresh token available
				localStorage.removeItem('accessToken');
				window.dispatchEvent(new Event('auth:unauthorized'));
			}
		}

		return Promise.reject(error);
	},
);

export default api;
