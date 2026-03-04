'use client';

import {
	Search,
	LayoutGrid,
	Receipt,
	Users,
	Monitor,
	LogOut,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CloseRegisterButton } from './CloseRegisterButton';

export function TopNav() {
	const { user, logout } = useAuth();

	return (
		<header className='h-16 border-b bg-background flex items-center justify-between px-4 sticky top-0 z-40'>
			<div className='flex items-center gap-6'>
				<div className='flex items-center gap-2 font-bold text-xl tracking-tight'>
					<Link
						href='/pos'
						className='flex items-center'
					>
						<span className='text-black text-2xl'>Fabric</span>
						<span className='text-red-600 text-2xl'>Hub</span>
						<span className='text-zinc-500 text-xs ml-2 font-bold bg-zinc-100 px-2 py-1 rounded-md tracking-wider'>
							POS
						</span>
					</Link>
				</div>

				<nav className='hidden lg:flex items-center gap-1 ml-4'>
					<Button
						variant='ghost'
						className='font-semibold text-primary touch-manipulation min-h-[48px]'
						asChild
					>
						<Link href='/pos'>
							<LayoutGrid className='mr-2 h-4 w-4' /> Register
						</Link>
					</Button>
					<Button
						variant='ghost'
						className='text-muted-foreground touch-manipulation min-h-[48px]'
						asChild
					>
						<Link href='/pos/orders'>
							<Receipt className='mr-2 h-4 w-4' /> Orders
						</Link>
					</Button>
					<Button
						variant='ghost'
						className='text-muted-foreground touch-manipulation min-h-[48px]'
						asChild
					>
						<Link href='/pos/customers'>
							<Users className='mr-2 h-4 w-4' /> Customers
						</Link>
					</Button>
				</nav>
			</div>

			<div className='flex items-center gap-4 flex-1 justify-end'>
				<div className='relative w-full max-w-sm hidden md:block mr-2'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search by product name'
						className='w-full pl-9 bg-zinc-100 border-transparent focus:bg-white focus:border-zinc-300 focus:ring-zinc-200 h-10 transition-all rounded-lg'
						autoFocus
					/>
				</div>
				{user?.role === 'admin' && (
					<Button
						variant='outline'
						className='hidden sm:flex border-zinc-200 text-zinc-700 hover:bg-zinc-50 touch-manipulation h-10 rounded-lg'
						asChild
					>
						<Link href='/dashboard'>
							<Monitor className='w-4 h-4 mr-2' /> ERP
						</Link>
					</Button>
				)}
				<Button
					variant='ghost'
					size='icon'
					className='md:hidden h-10 w-10 touch-manipulation'
				>
					<Search className='h-5 w-5' />
				</Button>

				<CloseRegisterButton />

				<Button
					variant='ghost'
					size='icon'
					onClick={logout}
					className='h-10 w-10 touch-manipulation text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg'
					title='Log Out'
				>
					<LogOut className='w-5 h-5' />
				</Button>
			</div>
		</header>
	);
}
