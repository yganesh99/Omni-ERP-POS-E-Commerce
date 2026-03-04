'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { Settings, Store, Users, ShieldAlert } from 'lucide-react';

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const tabs = [
		{
			name: 'General Information',
			href: '/settings/general',
			icon: Settings,
		},
		{ name: 'Store Management', href: '/settings/stores', icon: Store },
		{ name: 'User Access Control', href: '/settings/users', icon: Users },
	];

	return (
		<RoleGuard allowedRoles={['admin']}>
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>
						Settings
					</h2>
					<p className='text-zinc-500'>
						Manage your company details, stores, and user access.
					</p>
				</div>

				<div className='flex flex-col md:flex-row gap-8'>
					<aside className='w-full md:w-64 space-y-1 flex-shrink-0'>
						<div className='mb-4 px-3 py-2 bg-red-50 rounded-lg flex items-start space-x-2'>
							<ShieldAlert className='w-4 h-4 text-red-600 mt-0.5' />
							<div className='text-xs text-red-800 font-medium'>
								Admin access only. Changes here affect the
								entire system.
							</div>
						</div>
						<nav className='flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0'>
							{tabs.map((tab) => {
								const isActive = pathname.startsWith(tab.href);
								const Icon = tab.icon;
								return (
									<Link
										key={tab.name}
										href={tab.href}
										className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
											${isActive ? 'bg-zinc-100 text-black' : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'}
										`}
									>
										<Icon
											className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`}
										/>
										<span>{tab.name}</span>
									</Link>
								);
							})}
						</nav>
					</aside>

					<main className='flex-1'>{children}</main>
				</div>
			</div>
		</RoleGuard>
	);
}
