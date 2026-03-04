'use client';

import { usePosStore } from './store';
import { MOCK_PRODUCTS } from './mock-data';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { CartPanel } from '@/components/pos/CartPanel';
import { CartDrawer } from '@/components/pos/CartDrawer';
import { CheckoutBar } from '@/components/pos/CheckoutBar';
import { Product } from './store';
import { useCallback, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';

export default function PosPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [mounted, setMounted] = useState(false);
	const addItem = usePosStore((state) => state.addItem);
	const session = usePosStore((state) => state.session);
	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);

	const filteredProducts = MOCK_PRODUCTS.filter(
		(p) =>
			p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			p.barcode.includes(searchQuery),
	);

	const handleAddProduct = useCallback(
		(product: Product) => {
			addItem(product);
		},
		[addItem],
	);

	if (!mounted) return null;

	if (!session) {
		router.replace('/registers');
		return null;
	}

	return (
		<div className='flex-1 flex overflow-hidden relative'>
			{/* Main Content Area */}
			<div className='flex-1 flex flex-col lg:mr-96 h-[calc(100vh-64px)] overflow-hidden'>
				{/* Mobile Search Bar */}
				<div className='p-4 border-b md:hidden shrink-0'>
					<div className='relative'>
						<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							type='search'
							placeholder='Search products...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full pl-9 bg-muted/50 border-transparent focus:bg-background h-10 text-base'
						/>
					</div>
				</div>

				{/* Categories Tab (mock layout) */}
				<div className='p-4 border-b shrink-0 overflow-x-auto whitespace-nowrap hide-scrollbar'>
					<div className='flex gap-2'>
						{['All', 'Clothing', 'Accessories', 'Footwear'].map(
							(cat) => (
								<button
									key={cat}
									className={`px-4 py-2 rounded-full text-sm font-semibold touch-manipulation transition-all border ${cat === 'All' ? 'bg-black text-white border-black shadow-sm' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'}`}
								>
									{cat}
								</button>
							),
						)}
					</div>
				</div>

				{/* Scrollable Product Grid */}
				<ScrollArea className='flex-1 h-[calc(100vh-64px-130px)]'>
					<ProductGrid
						products={filteredProducts}
						onAddProduct={handleAddProduct}
					/>
				</ScrollArea>
			</div>

			{/* Desktop Cart Right Panel */}
			<CartPanel />

			{/* Mobile Cart Floating Action Button / Drawer */}
			<CartDrawer />

			{/* Mobile Checkout Sticky Bar */}
			<CheckoutBar />
		</div>
	);
}
