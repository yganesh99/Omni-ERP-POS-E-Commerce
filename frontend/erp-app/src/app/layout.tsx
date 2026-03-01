import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import {
	LayoutDashboard,
	Package,
	ShoppingCart,
	Users,
	Settings,
	Bell,
	Search,
} from 'lucide-react';

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-poppins',
});

export const metadata: Metadata = {
	title: 'FabricHub ERP - Internal Dashboard',
	description: 'Internal management tool for FabricHub operations',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${poppins.variable} font-sans flex h-screen overflow-hidden bg-brand-gray text-zinc-900`}
			>
				{/* Sidebar */}
				<aside className='w-64 bg-brand-sidebar text-white flex-shrink-0 flex flex-col transition-all duration-300'>
					<div className='h-16 flex items-center px-6 border-b border-white/10'>
						<h1 className='text-xl font-bold tracking-tight'>
							FabricHub <span className='text-blue-400'>ERP</span>
						</h1>
					</div>
					<div className='flex-1 overflow-y-auto py-4'>
						<nav className='space-y-1 px-3'>
							<Link
								href='/'
								className='flex items-center space-x-3 px-3 py-2 rounded-md bg-white/10 text-white font-medium'
							>
								<LayoutDashboard className='w-5 h-5' />
								<span>Dashboard</span>
							</Link>
							<Link
								href='/inventory'
								className='flex items-center space-x-3 px-3 py-2 rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors'
							>
								<Package className='w-5 h-5' />
								<span>Inventory</span>
							</Link>
							<Link
								href='/orders'
								className='flex items-center space-x-3 px-3 py-2 rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors'
							>
								<ShoppingCart className='w-5 h-5' />
								<span>Orders</span>
							</Link>
							<Link
								href='/customers'
								className='flex items-center space-x-3 px-3 py-2 rounded-md text-zinc-300 hover:bg-white/5 hover:text-white transition-colors'
							>
								<Users className='w-5 h-5' />
								<span>Customers</span>
							</Link>
						</nav>
					</div>
					<div className='p-4 border-t border-white/10'>
						<div className='flex items-center space-x-3 text-sm'>
							<div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold'>
								A
							</div>
							<div>
								<p className='font-medium'>Admin User</p>
								<p className='text-xs text-blue-200'>
									admin@fabrichub.test
								</p>
							</div>
						</div>
					</div>
				</aside>

				{/* Main Content Area */}
				<main className='flex-1 flex flex-col h-screen overflow-hidden'>
					{/* Topbar */}
					<header className='h-16 bg-white border-b border-brand-border flex items-center justify-between px-6 flex-shrink-0 z-10'>
						<div className='flex items-center flex-1'>
							<div className='relative w-full max-w-md'>
								<Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400' />
								<input
									type='text'
									placeholder='Search orders, products...'
									className='w-full pl-10 pr-4 py-2 bg-brand-gray border border-brand-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue'
								/>
							</div>
						</div>
						<div className='flex items-center space-x-4'>
							<button className='relative p-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors'>
								<Bell className='w-5 h-5' />
								<span className='absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white'></span>
							</button>
							<button className='p-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors'>
								<Settings className='w-5 h-5' />
							</button>
						</div>
					</header>

					{/* Page Content */}
					<div className='flex-1 overflow-auto p-6'>{children}</div>
				</main>
			</body>
		</html>
	);
}
