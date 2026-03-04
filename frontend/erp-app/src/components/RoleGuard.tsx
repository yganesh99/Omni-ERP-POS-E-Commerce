'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, Role } from '@/context/AuthContext';

interface RoleGuardProps {
	children: React.ReactNode;
	allowedRoles?: Role[]; // If undefined, just requires authentication
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (!user) {
				// Not logged in
				router.replace('/sign-in');
			} else if (allowedRoles && !allowedRoles.includes(user.role)) {
				// Logged in but doesn't have required role
				// Redirect to a default route based on their actual role
				if (user.role === 'admin' || user.role === 'cashier') {
					router.replace('/pos');
				} else if (
					user.role === 'inventory_manager' ||
					user.role === 'accountant'
				) {
					router.replace('/dashboard');
				} else {
					router.replace('/');
				}
			}
		}
	}, [user, loading, allowedRoles, router]);

	// Show nothing while loading or if redirecting
	if (
		loading ||
		!user ||
		(allowedRoles && !allowedRoles.includes(user.role))
	) {
		return (
			<div className='flex h-screen w-screen items-center justify-center'>
				<div className='h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-900 border-r-transparent'></div>
			</div>
		);
	}

	return <>{children}</>;
}
