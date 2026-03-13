'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

export type Role =
	| 'admin'
	| 'cashier'
	| 'inventory_manager'
	| 'accountant'
	| null;

interface User {
	_id: string;
	email: string;
	name?: string;
	role: Role;
	storeId?: {
		_id: string;
		name: string;
		code: string;
	};
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (accessToken: string, refreshToken: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	login: () => {},
	logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// Check for existing session
		const loadUser = async () => {
			const token = localStorage.getItem('accessToken');
			if (token) {
				try {
					const res = await api.get('/auth/me');
					setUser(res.data);
				} catch (error) {
					console.error('Failed to load user', error);
					setUser(null);
				}
			}
			setLoading(false);
		};

		loadUser();

		// Listen for unauthorized events to force logout (e.g., from interceptor)
		const handleUnauthorized = () => {
			logout();
		};

		window.addEventListener('auth:unauthorized', handleUnauthorized);
		return () =>
			window.removeEventListener('auth:unauthorized', handleUnauthorized);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const login = (accessToken: string, refreshToken: string) => {
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);

		// Fetch profile
		api.get('/auth/me')
			.then((res) => {
				setUser(res.data);
				const role = res.data.role;
				// Redirect based on role
				if (role === 'cashier') {
					router.push('/pos');
				} else if (
					role === 'inventory_manager' ||
					role === 'accountant'
				) {
					router.push('/dashboard');
				} else {
					router.push('/');
				}
			})
			.catch((err) => {
				console.error('Failed to fetch user after login', err);
				logout();
			});
	};

	const logout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		setUser(null);
		router.push('/sign-in');
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
