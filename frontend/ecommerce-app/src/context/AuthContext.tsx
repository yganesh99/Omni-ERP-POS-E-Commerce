'use client';

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { authApi, clearTokens, getTokens, UserProfile } from '@/lib/auth';

// ── Types ─────────────────────────────────────────────────────────────────

interface AuthContextValue {
	user: UserProfile | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	signup: (name: string, email: string, password: string) => Promise<void>;
	logout: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	// On mount — silently restore session from refreshToken
	useEffect(() => {
		async function restoreSession() {
			const { refreshToken } = getTokens();
			if (!refreshToken) {
				setLoading(false);
				return;
			}
			try {
				const newAccessToken = await authApi.refresh();
				if (newAccessToken) {
					const profile = await authApi.me(newAccessToken);
					setUser(profile);
				}
			} catch {
				clearTokens();
			} finally {
				setLoading(false);
			}
		}
		restoreSession();
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		const { user } = await authApi.login(email, password);
		setUser(user);
	}, []);

	const signup = useCallback(
		async (name: string, email: string, password: string) => {
			await authApi.register(name, email, password);
			// Auto-login after registration
			const { user } = await authApi.login(email, password);
			setUser(user);
		},
		[],
	);

	const logout = useCallback(() => {
		authApi.logout();
		setUser(null);
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, login, signup, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
	return ctx;
}
