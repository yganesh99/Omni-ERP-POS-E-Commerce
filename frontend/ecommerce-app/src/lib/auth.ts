// ---------------------------------------------------------------------------
// auth.ts — API helpers, token storage, and auto-refresh fetch wrapper
// ---------------------------------------------------------------------------

export const API_BASE =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ── Token storage ─────────────────────────────────────────────────────────

export function getTokens() {
	if (typeof window === 'undefined')
		return { accessToken: null, refreshToken: null };
	return {
		accessToken: sessionStorage.getItem('accessToken'),
		refreshToken: localStorage.getItem('refreshToken'),
	};
}

export function setTokens(accessToken: string, refreshToken?: string) {
	sessionStorage.setItem('accessToken', accessToken);
	if (refreshToken) {
		localStorage.setItem('refreshToken', refreshToken);
	}
}

export function clearTokens() {
	sessionStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
}

// ── Silent refresh ────────────────────────────────────────────────────────

async function silentRefresh(): Promise<string | null> {
	const { refreshToken } = getTokens();
	if (!refreshToken) return null;

	try {
		const res = await fetch(`${API_BASE}/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken }),
		});
		if (!res.ok) {
			clearTokens();
			return null;
		}
		const data = await res.json();
		setTokens(data.accessToken);
		return data.accessToken;
	} catch {
		clearTokens();
		return null;
	}
}

// ── Authenticated fetch wrapper ───────────────────────────────────────────
// Automatically injects Authorization header.
// On 401, silently refreshes and retries once.

export async function apiFetch(
	path: string,
	options: RequestInit = {},
	retry = true,
): Promise<Response> {
	let { accessToken } = getTokens();

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	};
	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

	if (res.status === 401 && retry) {
		const newToken = await silentRefresh();
		if (newToken) {
			return apiFetch(path, options, false);
		}
	}

	return res;
}

// ── Auth API ──────────────────────────────────────────────────────────────

export interface UserProfile {
	_id: string;
	email: string;
	name?: string;
	role: string;
}

export const authApi = {
	async login(
		email: string,
		password: string,
	): Promise<{ user: UserProfile }> {
		const res = await fetch(`${API_BASE}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			throw new Error(err.message || 'Invalid credentials');
		}
		const data: { accessToken: string; refreshToken: string } =
			await res.json();
		setTokens(data.accessToken, data.refreshToken);

		// Immediately fetch user profile
		const user = await authApi.me(data.accessToken);
		return { user };
	},

	async register(
		name: string,
		email: string,
		password: string,
	): Promise<void> {
		const res = await fetch(`${API_BASE}/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, email, password }),
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			throw new Error(err.message || 'Registration failed');
		}
	},

	async me(token?: string): Promise<UserProfile> {
		const { accessToken } = getTokens();
		const bearerToken = token || accessToken;
		const res = await fetch(`${API_BASE}/auth/me`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${bearerToken}`,
			},
		});
		if (!res.ok) throw new Error('Failed to fetch user');
		return res.json();
	},

	async refresh(): Promise<string | null> {
		return silentRefresh();
	},

	logout() {
		clearTokens();
	},
};
