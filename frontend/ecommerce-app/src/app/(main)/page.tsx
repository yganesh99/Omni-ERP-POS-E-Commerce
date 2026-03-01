import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function Home() {
	const products = [
		{
			id: 1,
			name: 'Cotton Blend Marrakech Bloom',
			price: 'Rs 2,500 Per Metre',
			isNew: true,
		},
		{
			id: 2,
			name: 'Cotton Blend Marrakech Bloom',
			price: 'Rs 2,500 Per Metre',
			isNew: true,
		},
		{
			id: 3,
			name: 'Cotton Blend Marrakech Bloom',
			price: 'Rs 2,500 Per Metre',
			isNew: true,
		},
		{
			id: 4,
			name: 'Cotton Blend Marrakech Bloom',
			price: 'Rs 2,500 Per Metre',
			isNew: true,
		},
		{
			id: 5,
			name: 'Cotton Blend Marrakech Bloom',
			price: 'Rs 2,500 Per Metre',
			isNew: true,
		},
		{
			id: 6,
			name: 'Cotton Blend Marrakech Bloom',
			price: 'Rs 2,500 Per Metre',
			isNew: true,
		},
		{
			id: 7,
			name: 'Cotton Blend Marrakech Bloom',
			price: 'Rs 2,500 Per Metre',
			isNew: true,
		},
		{
			id: 8,
			name: 'Cotton Blend Marrakech Bloom',
			price: 'Rs 2,500 Per Metre',
			isNew: true,
		},
	];

	return (
		<div className='w-full'>
			{/* Hero Section */}
			<section className='w-full relative bg-[#1F3E5A] h-[200px] sm:min-h-[650px]'>
				{/* Background Image */}
				<div className='absolute inset-0 z-0'>
					<Image
						src='/hero.png'
						alt='Dyeable Fabric starting from Rs.195'
						fill
						className='object-contain sm:object-cover'
						priority
					/>
				</div>

				{/* Content Overlay */}
				{/* <div className='container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col md:flex-row items-center justify-end min-h-[500px]'>
					<div className='w-full md:w-[60%] lg:w-1/2 text-white text-center md:text-right flex flex-col items-center md:items-end'>
						<h1 className='text-5xl lg:text-7xl font-black tracking-tight mb-4 uppercase leading-none drop-shadow-lg'>
							Dyeable
							<br />
							Fabric
						</h1>
						<div className='inline-block bg-[#1F3E5A]/80 backdrop-blur-sm p-4 rounded-sm border-l-4 border-[#DABC8B] mb-8 text-left md:text-right w-full max-w-sm ml-auto'>
							<p className='text-xl md:text-2xl font-light mb-1'>
								STARTING FROM Rs.195
							</p>
							<p className='text-lg font-light opacity-80'>
								Dye the fabric in your dream color
							</p>
						</div>
						<Link
							href='/shop'
							className='inline-block border-2 border-[#DABC8B] text-[#DABC8B] bg-black/30 backdrop-blur-sm px-12 py-4 text-2xl font-bold uppercase tracking-wide hover:bg-[#DABC8B] hover:text-[#1F3E5A] transition-all'
						>
							SHOP NOW!
						</Link>
					</div>
				</div> */}

				{/* Pagination Dots */}
				<div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10'>
					<div className='w-2.5 h-2.5 rounded-full bg-white opacity-100 cursor-pointer'></div>
					<div className='w-2.5 h-2.5 rounded-full bg-white opacity-50 cursor-pointer hover:opacity-100 transition-opacity'></div>
					<div className='w-2.5 h-2.5 rounded-full bg-white opacity-50 cursor-pointer hover:opacity-100 transition-opacity'></div>
				</div>
			</section>

			{/* Intro Text */}
			<section className='container mx-auto px-4 py-16 max-w-4xl text-center'>
				<h2 className='text-3xl font-bold mb-4'>
					Fabric<span className='text-brand-red'>Hub</span> — Where
					Fabric Meets Imagination
				</h2>
				<p className='text-zinc-600 mb-6 leading-relaxed'>
					Unleash your creativity with globally sourced, premium
					fabrics and tools made for makers. <br />
					From rare deadstock finds to luxury European textiles,
					FabricHub is your one-stop destination to <br />
					dream, design, and craft without limits.
				</p>
				<Link href='/about'>
					<Button
						variant='outline'
						className='rounded-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-8'
					>
						Read More
					</Button>
				</Link>
			</section>

			{/* Featured Categories */}
			<section className='container mx-auto px-4 py-8'>
				<div className='flex items-center justify-between mb-8'>
					<div className='h-px bg-zinc-200 flex-1'></div>
					<h3 className='px-6 text-xl font-bold uppercase tracking-wider'>
						Featured Categories
					</h3>
					<div className='h-px bg-zinc-200 flex-1'></div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='aspect-[4/3] bg-zinc-200 relative group overflow-hidden cursor-pointer flex items-end justify-center pb-8 rounded-sm'>
						<Image
							src='/cotton.png'
							alt='Cotton'
							fill
							className='object-cover z-0 transition-transform duration-500 group-hover:scale-105'
						/>
						<div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10'></div>
						<span className='text-white text-3xl font-bold uppercase tracking-widest z-20 drop-shadow-md'>
							Cotton
						</span>
					</div>
					<div className='aspect-[4/3] bg-zinc-200 relative group overflow-hidden cursor-pointer flex items-end justify-center pb-8 rounded-sm'>
						<Image
							src='/polyester.png'
							alt='Polyester'
							fill
							className='object-cover z-0 transition-transform duration-500 group-hover:scale-105'
						/>
						<div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10'></div>
						<span className='text-white text-3xl font-bold uppercase tracking-widest z-20 drop-shadow-md'>
							Polyester
						</span>
					</div>
					<div className='aspect-[4/3] bg-zinc-200 relative group overflow-hidden cursor-pointer flex items-end justify-center pb-8 rounded-sm'>
						<Image
							src='/linen.png'
							alt='Linen'
							fill
							className='object-cover z-0 transition-transform duration-500 group-hover:scale-105'
						/>
						<div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10'></div>
						<span className='text-white text-3xl font-bold uppercase tracking-widest z-20 drop-shadow-md'>
							Linen
						</span>
					</div>
				</div>
			</section>

			{/* Products Tabs */}
			<section className='container mx-auto px-4 py-16'>
				<div className='flex justify-center space-x-12 mb-10 border-b border-zinc-100 pb-4'>
					<button className='text-brand-dark font-bold border-b-2 border-brand-red pb-4 -mb-4'>
						New Arrivals
					</button>
					<button className='text-zinc-500 font-semibold hover:text-brand-dark transition-colors'>
						Best Sellers
					</button>
					<button className='text-zinc-500 font-semibold hover:text-brand-dark transition-colors'>
						Offers
					</button>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10'>
					{products.map((product) => (
						<div
							key={product.id}
							className='group cursor-pointer'
						>
							<div className='aspect-square bg-[#E5E5E5] relative mb-4 rounded-sm overflow-hidden'>
								<button className='absolute top-3 right-3 p-1.5 bg-white/50 backdrop-blur hover:bg-white rounded-full transition-colors z-10'>
									<Heart className='w-4 h-4 text-zinc-600' />
								</button>
								{/* Fallback pattern for dummy image */}
								<div className='absolute inset-0 flex items-center justify-center text-zinc-400'>
									Image
								</div>
							</div>
							<div className='space-y-1'>
								{product.isNew && (
									<span className='text-xs font-bold text-brand-red uppercase'>
										NEW
									</span>
								)}
								<h4 className='font-semibold text-sm line-clamp-2'>
									{product.name}
								</h4>
								<p className='text-sm font-semibold'>
									{product.price}
								</p>
							</div>
						</div>
					))}
				</div>

				<div className='mt-12 text-center'>
					<Button
						variant='outline'
						className='rounded-full px-10 font-bold border-zinc-300'
					>
						View All
					</Button>
				</div>
			</section>
		</div>
	);
}
