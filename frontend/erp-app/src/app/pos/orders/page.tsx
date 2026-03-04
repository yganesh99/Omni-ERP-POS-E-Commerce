'use client';

import { Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePosStore } from '../store';
import { useRouter } from 'next/navigation';

export default function PosOrdersPage() {
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
			<div className='flex items-center gap-3 mb-6'>
				<Receipt className='w-8 h-8 text-black' />
				<h1 className='text-2xl font-bold text-black tracking-tight'>
					Orders
				</h1>
			</div>

			<div className='flex-1 bg-white rounded-xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center p-8 text-center'>
				<Receipt className='w-16 h-16 text-zinc-200 mb-4' />
				<h2 className='text-xl font-bold text-zinc-900 mb-2'>
					No Recent Orders
				</h2>
				<p className='text-zinc-500 max-w-sm'>
					You haven&apos;t processed any orders on this register yet
					today. Your completed orders will appear here.
				</p>
			</div>
		</div>
	);
}
