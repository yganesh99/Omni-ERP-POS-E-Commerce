'use client';

import { Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import { usePosStore } from '../store';
import { useRouter } from 'next/navigation';

export default function PosCustomersPage() {
	const [mounted, setMounted] = useState(false);
	const session = usePosStore((state) => state.session);

	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	if (!session) {
		router.replace('/registers');
		return null;
	}
	return (
		<div className='flex-1 flex flex-col p-6 h-[calc(100vh-64px)] overflow-hidden'>
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center gap-3'>
					<Users className='w-8 h-8 text-black' />
					<h1 className='text-2xl font-bold text-black tracking-tight'>
						Customers
					</h1>
				</div>
				<Button className='bg-black text-white hover:bg-zinc-800 rounded-lg'>
					Add Customer
				</Button>
			</div>

			<div className='bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col flex-1'>
				<div className='p-4 border-b border-zinc-200 flex items-center justify-between'>
					<Input
						placeholder='Search customers by name, phone, or email...'
						className='max-w-md bg-zinc-50 border-transparent focus:border-zinc-300 focus:bg-white rounded-lg'
					/>
				</div>

				<div className='flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500'>
					<Users className='w-16 h-16 text-zinc-200 mb-4' />
					<h2 className='text-xl font-bold text-zinc-900 mb-2'>
						Customer Database
					</h2>
					<p className='max-w-sm'>
						Search for an existing customer above or add a new one
						to link them to the current transaction.
					</p>
				</div>
			</div>
		</div>
	);
}
