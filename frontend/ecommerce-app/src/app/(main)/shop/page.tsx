import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Shop() {
	// Generate dummy products for array
	const products = Array.from({ length: 12 }, (_, i) => ({
		id: i + 1,
		name: `Fabric Item ${i + 1}`,
		price: `Rs ${(Math.random() * 3000 + 500).toFixed(0)} Per Metre`,
		isNew: i % 3 === 0,
	}));

	return (
		<div className='container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8'>
			{/* Sidebar Filters */}
			<aside className='w-full md:w-64 flex-shrink-0 space-y-6'>
				<div>
					<h3 className='font-bold border-b border-zinc-200 pb-2 mb-4'>
						Categories
					</h3>
					<ul className='space-y-2 text-sm text-zinc-600'>
						<li>
							<label className='flex items-center gap-2'>
								<input type='checkbox' /> Cotton
							</label>
						</li>
						<li>
							<label className='flex items-center gap-2'>
								<input type='checkbox' /> Linen
							</label>
						</li>
						<li>
							<label className='flex items-center gap-2'>
								<input type='checkbox' /> Polyester
							</label>
						</li>
						<li>
							<label className='flex items-center gap-2'>
								<input type='checkbox' /> Silk
							</label>
						</li>
					</ul>
				</div>
				<div>
					<h3 className='font-bold border-b border-zinc-200 pb-2 mb-4'>
						Price
					</h3>
					<ul className='space-y-2 text-sm text-zinc-600'>
						<li>
							<label className='flex items-center gap-2'>
								<input
									type='radio'
									name='price'
								/>{' '}
								Under Rs 1000
							</label>
						</li>
						<li>
							<label className='flex items-center gap-2'>
								<input
									type='radio'
									name='price'
								/>{' '}
								Rs 1000 - 3000
							</label>
						</li>
						<li>
							<label className='flex items-center gap-2'>
								<input
									type='radio'
									name='price'
								/>{' '}
								Over Rs 3000
							</label>
						</li>
					</ul>
				</div>
			</aside>

			{/* Product Grid */}
			<div className='flex-1'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-2xl font-bold tracking-tight'>
						Shop All Fabrics
					</h1>
					<select className='border border-zinc-300 rounded-sm px-3 py-1 text-sm bg-white'>
						<option>Featured</option>
						<option>Price: Low to High</option>
						<option>Price: High to Low</option>
						<option>Newest Arrivals</option>
					</select>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
					{products.map((product) => (
						<Link
							href={`/shop/${product.id}`}
							key={product.id}
							className='group cursor-pointer block'
						>
							<div className='aspect-square bg-zinc-100 relative mb-4 rounded-sm overflow-hidden'>
								<button className='absolute top-3 right-3 p-1.5 bg-white/50 backdrop-blur hover:bg-white rounded-full transition-colors z-10'>
									<Heart className='w-4 h-4 text-zinc-600' />
								</button>
								<div className='absolute inset-0 flex items-center justify-center text-zinc-300'>
									Image {product.id}
								</div>
							</div>
							<div className='space-y-1'>
								{product.isNew && (
									<span className='text-[10px] font-bold text-brand-red uppercase bg-red-50 px-1 py-0.5 rounded-sm'>
										NEW
									</span>
								)}
								<h4 className='font-semibold text-sm line-clamp-1 group-hover:underline'>
									{product.name}
								</h4>
								<p className='text-sm font-semibold'>
									{product.price}
								</p>
							</div>
						</Link>
					))}
				</div>

				<div className='mt-12 flex justify-center'>
					<Button
						variant='outline'
						className='px-8 border-zinc-300'
					>
						Load More
					</Button>
				</div>
			</div>
		</div>
	);
}
