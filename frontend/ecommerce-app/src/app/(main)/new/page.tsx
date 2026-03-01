'use client';

import Link from 'next/link';
import { Heart, ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';

export default function NewArrivalsPage() {
	const [openFilter, setOpenFilter] = useState('Fabric Type');

	const ProductCard = () => (
		<div className='group cursor-pointer'>
			<Link href='/shop/cotton-blend-marrakech-bloom'>
				<div className='aspect-[3/4] bg-[#E5E5E5] relative mb-3 rounded-sm overflow-hidden'>
					{/* Heart Icon */}
					<button
						className='absolute top-3 right-3 z-10 p-1'
						onClick={(e) => e.preventDefault()}
					>
						<Heart className='w-5 h-5 text-zinc-600 stroke-[1.5] hover:fill-black hover:text-black transition-colors' />
					</button>
				</div>
				<div className='space-y-1'>
					<span className='text-[10px] font-bold text-brand-red uppercase tracking-wider'>
						NEW
					</span>
					<h4 className='font-bold text-sm text-zinc-900 leading-tight group-hover:underline'>
						Cotton Blend Marrakech Bloom
					</h4>
					<p className='text-xs font-bold text-zinc-800'>
						Rs 2,500 Per Metre
					</p>
				</div>
			</Link>
		</div>
	);

	return (
		<div className='container mx-auto px-4 py-8 mb-16'>
			{/* Breadcrumbs */}
			<div className='flex justify-between items-center mb-6'>
				<div className='flex items-center text-xs text-zinc-500 space-x-2'>
					<Link
						href='/'
						className='hover:text-brand-dark transition-colors'
					>
						Home
					</Link>
					<span>&gt;</span>
					<span className='text-zinc-900 font-medium'>
						New Arrivals
					</span>
				</div>

				<button className='flex items-center text-xs font-medium text-zinc-600 hover:text-zinc-900'>
					Sort by <ChevronDown className='w-3 h-3 ml-1' />
				</button>
			</div>

			<div className='flex flex-col md:flex-row gap-10'>
				{/* Left Sidebar Filters */}
				<div className='w-full md:w-64 flex-shrink-0'>
					<div className='mb-10'>
						<h1 className='text-2xl font-bold mb-3 tracking-tight leading-none'>
							All New
							<br />
							Arrivals
						</h1>
						<p className='text-xs font-bold text-zinc-800 leading-relaxed pr-8'>
							Browse All Our New Arrivals Here And Use The Filter
							To Refine Your Options!
						</p>
					</div>

					<div className='space-y-2'>
						{/* Filter Section Open */}
						<div className='border-b border-zinc-100 pb-4'>
							<button
								onClick={() =>
									setOpenFilter(
										openFilter === 'Fabric Type'
											? ''
											: 'Fabric Type',
									)
								}
								className='flex items-center justify-between w-full py-2 font-bold text-sm'
							>
								Fabric Type
								{openFilter === 'Fabric Type' ? (
									<span className='font-light text-2xl -mt-1 leading-none'>
										-
									</span>
								) : (
									<Plus className='w-4 h-4' />
								)}
							</button>

							{openFilter === 'Fabric Type' && (
								<div className='mt-2 space-y-2.5'>
									<label className='flex items-center text-xs text-zinc-800 font-medium cursor-pointer hover:text-black'>
										<span className='w-3 h-3 mr-3 rounded border border-zinc-300'></span>
										Canvas{' '}
										<span className='text-zinc-400 font-normal ml-1'>
											(4)
										</span>
									</label>
									<label className='flex items-center text-xs text-zinc-800 font-medium cursor-pointer hover:text-black'>
										<span className='w-3 h-3 mr-3 rounded border border-zinc-300'></span>
										Patterns{' '}
										<span className='text-zinc-400 font-normal ml-1'>
											(4)
										</span>
									</label>
									<label className='flex items-center text-xs text-zinc-800 font-medium cursor-pointer hover:text-black'>
										<span className='w-3 h-3 mr-3 rounded border border-zinc-300'></span>
										Coating{' '}
										<span className='text-zinc-400 font-normal ml-1'>
											(4)
										</span>
									</label>
									<label className='flex items-center text-xs text-zinc-800 font-medium cursor-pointer hover:text-black'>
										<span className='w-3 h-3 mr-3 rounded border border-zinc-300'></span>
										Double Jersey{' '}
										<span className='text-zinc-400 font-normal ml-1'>
											(4)
										</span>
									</label>
								</div>
							)}
						</div>

						{/* Other Collapsed Filters */}
						<div className='border-b border-zinc-100'>
							<button className='flex items-center justify-between w-full py-4 font-bold text-sm'>
								Colour
								<Plus className='w-4 h-4' />
							</button>
						</div>
						<div className='border-b border-zinc-100'>
							<button className='flex items-center justify-between w-full py-4 font-bold text-sm'>
								Size
								<Plus className='w-4 h-4' />
							</button>
						</div>
						<div className='border-b border-zinc-100'>
							<button className='flex items-center justify-between w-full py-4 font-bold text-sm'>
								Availability
								<Plus className='w-4 h-4' />
							</button>
						</div>
						<div className='border-b border-zinc-100'>
							<button className='flex items-center justify-between w-full py-4 font-bold text-sm'>
								Price
								<Plus className='w-4 h-4' />
							</button>
						</div>
					</div>
				</div>

				{/* Right Main Grid */}
				<div className='flex-1'>
					<div className='grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12'>
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<ProductCard key={i} />
						))}
					</div>

					{/* Pagination */}
					<div className='flex justify-center items-center space-x-2 mt-16 pt-8'>
						<button className='w-7 h-7 flex items-center justify-center bg-black text-white text-xs font-medium rounded-sm'>
							1
						</button>
						<button className='w-7 h-7 flex items-center justify-center bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-black transition-colors text-xs font-medium rounded-sm'>
							2
						</button>
						<button className='w-7 h-7 flex items-center justify-center bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-black transition-colors text-xs font-medium rounded-sm'>
							3
						</button>
						<button className='w-7 h-7 flex items-center justify-center bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-black transition-colors text-xs font-medium rounded-sm'>
							4
						</button>
						<button className='w-7 h-7 flex items-center justify-center bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-black transition-colors text-xs font-medium rounded-sm'>
							5
						</button>
						<span className='text-zinc-500 font-medium px-1 tracking-widest text-xs'>
							...
						</span>
						<button className='w-7 h-7 flex items-center justify-center bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-black transition-colors text-xs font-medium rounded-sm'>
							6
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
