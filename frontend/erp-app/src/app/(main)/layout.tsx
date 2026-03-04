'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	LayoutDashboard,
	Package,
	FileText,
	Building2,
	Truck,
	BarChart3,
	Settings,
	LogOut,
	HomeIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import RoleGuard from '@/components/RoleGuard';

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const { user, logout } = useAuth();

	const navigation = [
		{
			name: 'Dashboard',
			href: '/dashboard',
			icon: LayoutDashboard,
			roles: ['admin', 'inventory_manager', 'accountant'],
		},
		{
			name: 'Inventory Management',
			href: '/inventory',
			icon: Package,
			roles: ['admin', 'inventory_manager'],
		},
		{
			name: 'Sales & Invoicing',
			href: '/sales',
			icon: FileText,
			roles: ['admin', 'accountant'],
		},
		{
			name: 'Customers',
			href: '/accounts/customers',
			icon: Building2,
			roles: ['admin', 'accountant'],
		},
		{
			name: 'Suppliers',
			href: '/accounts/suppliers',
			icon: Truck,
			roles: ['admin', 'accountant'],
		},
		{
			name: 'Reports',
			href: '/reports',
			icon: BarChart3,
			roles: ['admin', 'accountant'],
		}, // Assuming reports is for admins/accountants
		{
			name: 'Settings',
			href: '/settings',
			icon: Settings,
			roles: ['admin'],
		},
	].filter((item) => !user || item.roles.includes(user.role as string));

	return (
		<RoleGuard allowedRoles={['admin', 'inventory_manager', 'accountant']}>
			<div className='flex h-screen bg-[#F8F9FA] text-zinc-900 font-sans'>
				{/* Sidebar */}
				<aside className='w-[280px] bg-white border-r border-zinc-200 flex-shrink-0 flex flex-col'>
					{/* Logo Area */}
					<div className='p-6 border-b border-zinc-100'>
						<div className='flex flex-col'>
							<div className='text-[28px] font-bold tracking-tight leading-none'>
								<span className='text-black'>Fabric</span>
								<span className='text-red-600'>Hub</span>
							</div>
							<span className='text-[11px] font-semibold text-zinc-600 tracking-wide mt-1'>
								Management System
							</span>
						</div>
					</div>

					{/* Navigation */}
					<div className='flex-1 overflow-y-auto py-6'>
						<div className='px-6 mb-4'>
							<span className='text-xs font-semibold text-zinc-400 tracking-wider'>
								MENU
							</span>
						</div>
						<nav className='space-y-1 px-3'>
							{navigation.map((item) => {
								const isActive = pathname.startsWith(item.href);
								const Icon = item.icon;
								return (
									<Link
										key={item.name}
										href={item.href}
										className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${
											isActive
												? 'bg-zinc-100 text-black'
												: 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
										}`}
									>
										<Icon
											className={`w-5 h-5 ${
												isActive
													? 'text-black'
													: 'text-zinc-500'
											}`}
										/>
										<span>{item.name}</span>
									</Link>
								);
							})}
						</nav>
					</div>

					{/* User Profile Footer */}
					<div className='p-4 mt-auto'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-10 rounded-full bg-zinc-200 flex-shrink-0 flex items-center justify-center font-bold text-sm'>
									{user?.name?.charAt(0) ||
										user?.email?.charAt(0) ||
										'U'}
								</div>
								<div className='overflow-hidden max-w-[130px]'>
									<p className='text-sm font-bold text-black leading-tight truncate'>
										{user?.name || 'User'}
									</p>
									<p className='text-xs text-zinc-500 font-medium truncate'>
										{user?.role || 'Role'}
									</p>
								</div>
							</div>
							<Link
								href={'/'}
								className='p-2 text-zinc-500 hover:text-black transition-colors rounded-lg hover:bg-zinc-100'
								title='App Selection'
							>
								<HomeIcon className='w-5 h-5' />
							</Link>
							<button
								onClick={logout}
								className='p-2 text-zinc-500 hover:text-black transition-colors rounded-lg hover:bg-zinc-100'
								title='Log out'
							>
								<LogOut className='w-5 h-5' />
							</button>
						</div>
					</div>
				</aside>

				{/* Main Content Area */}
				<main className='flex-1 flex flex-col h-screen overflow-hidden'>
					<div className='flex-1 overflow-auto p-8'>{children}</div>
				</main>
			</div>
		</RoleGuard>
	);
}
