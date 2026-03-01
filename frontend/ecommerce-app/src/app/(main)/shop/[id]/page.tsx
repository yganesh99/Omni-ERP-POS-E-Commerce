'use client';

import { Heart, Truck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductDetail({ params }: { params: { id: string } }) {
	const [quantity, setQuantity] = useState(1);
	const [activeTab, setActiveTab] = useState('Description');

	const ProductCard = () => (
		<div className='group cursor-pointer'>
			<Link href={`/shop/${params.id}`}>
				<div className='aspect-[3/4] bg-[#E5E5E5] relative mb-3 rounded-sm overflow-hidden'>
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
		<div className='container mx-auto px-4 py-8 mb-16 max-w-[1240px]'>
			{/* Breadcrumb */}
			<div className='text-xs text-zinc-500 mb-6 font-medium space-x-2'>
				<Link
					href='/'
					className='hover:text-brand-dark transition-colors'
				>
					Home
				</Link>
				<span>&gt;</span>
				<Link
					href='/new'
					className='hover:text-brand-dark transition-colors'
				>
					New Arrivals
				</Link>
				<span>&gt;</span>
				<span className='text-zinc-900'>
					Cotton Blend Marrakech Bloom
				</span>
			</div>

			<div className='flex flex-col md:flex-row gap-12 lg:gap-16 mb-16'>
				{/* Images Column */}
				<div className='w-full md:w-[60%] lg:w-[55%] flex flex-col gap-4'>
					<div className='w-full aspect-square bg-[#E5E5E5] rounded-sm'></div>
					<div className='flex gap-4 w-full h-[120px]'>
						{[1, 2, 3, 4].map((idx) => (
							<div
								key={idx}
								className='flex-1 h-full bg-[#E5E5E5] rounded-sm hover:opacity-80 transition-opacity cursor-pointer'
							></div>
						))}
					</div>
				</div>

				{/* Details Column */}
				<div className='w-full md:w-[40%] lg:w-[45%] flex flex-col pt-2'>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>
						Cotton Blend Marrakech Bloom
					</h1>
					<p className='text-[15px] font-medium text-zinc-800 mb-8'>
						Rs 2,500 Per Metre
					</p>

					<div className='space-y-1.5 mb-10 text-[13px] font-bold text-zinc-800'>
						<p>Composition: 100% Organic Cotton</p>
						<p>Width: 140cm (54&quot;)</p>
					</div>

					<div className='mb-10'>
						<h4 className='font-bold text-[13px] mb-3'>Colours</h4>
						<div className='flex flex-wrap gap-2.5'>
							{[...Array(7)].map((_, idx) => (
								<button
									key={idx}
									className={`w-7 h-7 rounded-full bg-zinc-200 border-2 border-transparent ring-1 ring-transparent hover:ring-zinc-300 transition-all`}
								/>
							))}
						</div>
					</div>

					<div className='mb-8 flex items-center space-x-6'>
						<div className='space-y-2'>
							<h4 className='font-bold text-[13px]'>Quantity</h4>
							<div className='flex items-center border border-zinc-200 rounded-sm w-[100px] h-10'>
								<button
									className='w-1/3 h-full flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors'
									onClick={() =>
										setQuantity(Math.max(1, quantity - 1))
									}
								>
									-
								</button>
								<input
									type='number'
									value={quantity}
									readOnly
									className='w-1/3 h-full text-center focus:outline-none font-bold text-[13px]'
								/>
								<button
									className='w-1/3 h-full flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors'
									onClick={() => setQuantity(quantity + 1)}
								>
									+
								</button>
							</div>
						</div>

						<div className='flex items-center text-[13px] font-bold text-zinc-800 self-end mb-3'>
							<div className='w-2 h-2 rounded-full bg-green-500 mr-2'></div>
							In Stock (50 Metres Available)
						</div>
					</div>

					<div className='space-y-3 mb-8 w-full max-w-[400px]'>
						<button className='w-full py-3.5 bg-white border border-zinc-200 text-black font-bold text-sm tracking-wide rounded-sm hover:bg-zinc-50 transition-colors'>
							Add To Cart
						</button>
						<button className='w-full py-3.5 bg-black text-white font-bold text-sm tracking-wide rounded-sm hover:bg-zinc-800 transition-colors'>
							Buy now
						</button>
					</div>

					<div className='flex items-center text-sm font-bold text-zinc-800'>
						<Truck className='w-5 h-5 mr-3' />
						Delivery Time : 3-4 Working Days
					</div>
				</div>
			</div>

			{/* Description & Reviews Tabs */}
			<div className='w-full mb-20 border-t border-zinc-200 pt-8'>
				<div className='flex space-x-10 mb-8 font-bold text-[15px]'>
					<button
						onClick={() => setActiveTab('Description')}
						className={`pb-2 ${activeTab === 'Description' ? 'border-b-2 border-black text-black' : 'text-zinc-500'}`}
					>
						Description
					</button>
					<button
						onClick={() => setActiveTab('Reviews')}
						className={`pb-2 ${activeTab === 'Reviews' ? 'border-b-2 border-black text-black' : 'text-zinc-500'}`}
					>
						Reviews
					</button>
				</div>

				{activeTab === 'Description' && (
					<div className='text-[13px] leading-relaxed max-w-5xl space-y-6 text-zinc-900'>
						<div>
							<span className='font-bold'>Fabric :</span>
							<p className='mt-1 font-medium text-zinc-800'>
								A Soft, Breathable Cotton Blend Featuring A
								Vibrant, Blooming Marrakech-Inspired Print. Its
								Lively Pattern And Comfortable Drape Make It
								Perfect For Versatile, All-Season Garments, From
								Relaxed Jackets To Stylish Unisex Pieces Like
								The TN34 Parka. Ideal For Adding A Touch Of
								Color And Personality To Your Wardrobe While
								Maintaining Effortless Comfort.
							</p>
						</div>
						<div>
							<span className='font-bold'>Composition :</span>
							<p className='mt-1 font-medium text-zinc-800'>
								100% Organic Cotton
							</p>
						</div>
						<div>
							<span className='font-bold'>Sizes :</span>
							<p className='mt-1 font-medium text-zinc-800'>
								140cm (54&quot;)
							</p>
						</div>
						<div>
							<span className='font-bold'>Pattern/Design :</span>
							<p className='mt-1 font-medium text-zinc-800'>
								Fishtail
							</p>
						</div>
					</div>
				)}
			</div>

			{/* You May Also Like */}
			<div>
				<h3 className='text-2xl font-bold text-center mb-10 tracking-tight'>
					You May Also Like
				</h3>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
					{[1, 2, 3, 4].map((i) => (
						<ProductCard key={i} />
					))}
				</div>
			</div>
		</div>
	);
}
