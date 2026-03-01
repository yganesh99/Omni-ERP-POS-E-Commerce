'use client';

import Link from 'next/link';
import {
	Search,
	User,
	Heart,
	ShoppingCart,
	Menu,
	X,
	ChevronLeft,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [activeMenu, setActiveMenu] = useState('main'); // 'main' | 'a-d'

	// Prevent body scroll when drawer is open
	useEffect(() => {
		if (drawerOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [drawerOpen]);

	return (
		<>
			<div className='w-full bg-white border-b border-zinc-200 sticky top-0 z-50'>
				{/* Top Promotional Banner */}
				<div className='w-full bg-white text-brand-red text-xs py-1.5 border-b border-zinc-100 flex justify-between px-6 font-medium'>
					<span>Premium fabrics destination</span>
					<span>Your one stop destination for premium fabrics</span>
				</div>

				{/* Main Header */}
				<div className='container mx-auto px-4 py-4 flex items-center justify-between gap-8'>
					{/* Logo */}
					<Link
						href='/'
						className='flex-shrink-0 text-3xl font-bold tracking-tight'
					>
						Fabric<span className='text-brand-red'>Hub</span>
					</Link>

					{/* Search Bar */}
					<div className='flex-1 max-w-2xl hidden md:flex relative'>
						<input
							type='text'
							placeholder='Search for fabric type'
							className='w-full border border-zinc-300 rounded-full py-2.5 px-6 pr-14 focus:outline-none focus:border-brand-dark'
						/>
						<button className='absolute right-2 top-1/2 -translate-y-1/2 bg-brand-red text-white p-2 rounded-full hover:bg-red-700 transition-colors'>
							<Search className='w-4 h-4' />
						</button>
					</div>

					{/* Action Icons */}
					<div className='flex items-center space-x-6'>
						<div className='relative group'>
							<Link
								href='/login'
								className='hover:text-brand-red transition-colors flex items-center p-2 -m-2'
							>
								<User className='w-5 h-5' />
							</Link>
							{/* Dropdown Menu */}
							<div className='absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-48'>
								<div className='bg-white shadow-lg border border-zinc-100 rounded-md py-2 flex flex-col'>
									<Link
										href='/profile'
										className='px-4 py-2 text-sm font-medium hover:bg-zinc-50 hover:text-brand-red transition-colors text-zinc-700'
									>
										Profile
									</Link>
									<Link
										href='/orders'
										className='px-4 py-2 text-sm font-medium hover:bg-zinc-50 hover:text-brand-red transition-colors text-zinc-700'
									>
										Orders
									</Link>
									<Link
										href='/wishlist'
										className='px-4 py-2 text-sm font-medium hover:bg-zinc-50 hover:text-brand-red transition-colors text-zinc-700'
									>
										Wishlist
									</Link>
									<div className='h-px bg-zinc-100 my-1'></div>
									<Link
										href='/login'
										className='px-4 py-2 text-sm font-medium hover:bg-zinc-50 text-red-600 transition-colors'
									>
										Logout
									</Link>
								</div>
							</div>
						</div>
						<Link
							href='/wishlist'
							className='hover:text-brand-red transition-colors'
						>
							<Heart className='w-5 h-5' />
						</Link>
						<Link
							href='/cart'
							className='hover:text-brand-red transition-colors'
						>
							<ShoppingCart className='w-5 h-5' />
						</Link>
					</div>
				</div>

				{/* Subnavigation */}
				<div className='container mx-auto px-4 hidden md:flex items-center space-x-10 text-sm font-semibold py-3 border-t border-zinc-100'>
					<button
						onClick={() => {
							setDrawerOpen(!drawerOpen);
							setActiveMenu('main');
						}}
						className='flex items-center space-x-2 hover:text-brand-red'
					>
						{drawerOpen ? (
							<X className='w-5 h-5' />
						) : (
							<Menu className='w-5 h-5' />
						)}
						<span>Shop All</span>
					</button>
					<Link
						href='/new'
						className='hover:text-brand-red transition-colors'
					>
						New Arrivals
					</Link>
					<Link
						href='/best-sellers'
						className='hover:text-brand-red transition-colors'
					>
						Best Sellers
					</Link>
					<Link
						href='/category/a-d'
						className='hover:text-brand-red transition-colors'
					>
						Fabrics A-D
					</Link>
					<Link
						href='/category/e-o'
						className='hover:text-brand-red transition-colors'
					>
						Fabrics E-O
					</Link>
					<Link
						href='/category/p-z'
						className='hover:text-brand-red transition-colors'
					>
						Fabrics P-Z
					</Link>
					<Link
						href='/sale'
						className='text-brand-red hover:text-red-700 transition-colors'
					>
						Sale
					</Link>
				</div>

				{/* Navigation Drawer Overlay Dropdown */}
				{drawerOpen && (
					<div className='absolute top-full left-0 w-full h-[calc(100vh-140px)] flex bg-black/40'>
						<div className='w-[400px] h-full bg-white shadow-xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-left-4 duration-300'>
							{activeMenu === 'main' ? (
								<div className='flex flex-col h-full'>
									{/* Tabs */}
									<div className='flex items-center pt-2 px-6'>
										<button className='flex-1 py-4 text-center font-bold text-[15px] border-b-2 border-zinc-900'>
											Fabrics
										</button>
										<div className='w-px h-6 bg-zinc-200 mx-2'></div>
										<button className='flex-1 py-4 text-center font-bold text-[15px] text-zinc-400 border-b-2 border-transparent'>
											Imported Fabrics
										</button>
									</div>

									<div className='p-6 space-y-4 flex-1 overflow-y-auto flex'>
										<div className='flex-1 space-y-4 pr-4'>
											{/* Discount Banner */}
											<div className='bg-zinc-50 p-4 border border-zinc-200 rounded-sm flex items-center justify-between mb-4'>
												<span className='font-bold text-sm text-zinc-800 ml-2'>
													Discounts Upto
												</span>
												<div className='flex items-center text-brand-red mr-2 select-none'>
													<span className='font-black italic text-5xl tracking-tighter leading-none'>
														30
													</span>
													<div className='flex flex-col items-center justify-center font-black italic leading-none ml-1'>
														<span className='text-xl'>
															%
														</span>
														<span className='text-[10px] mt-0.5 tracking-wider'>
															OFF
														</span>
													</div>
												</div>
											</div>

											{/* Menu Items */}
											<button
												onClick={() =>
													setActiveMenu('a-d')
												}
												className='w-full text-left px-6 py-4 bg-zinc-100/60 hover:bg-zinc-200/60 font-bold text-[15px] text-zinc-800 rounded-sm transition-colors'
											>
												Fabrics A-D
											</button>
											<button className='w-full text-left px-6 py-4 bg-zinc-100/60 hover:bg-zinc-200/60 font-bold text-[15px] text-zinc-800 rounded-sm transition-colors'>
												Fabrics A-D
											</button>
											<button className='w-full text-left px-6 py-4 bg-zinc-100/60 hover:bg-zinc-200/60 font-bold text-[15px] text-zinc-800 rounded-sm transition-colors'>
												Fabrics P-Z
											</button>
										</div>
										<div className='w-1.5 bg-[#3D91E6] h-64 mt-4 rounded-full flex-shrink-0'></div>
									</div>
								</div>
							) : (
								<div className='flex flex-col h-full animate-in slide-in-from-right-8 duration-300'>
									{/* Back Button */}
									<button
										onClick={() => setActiveMenu('main')}
										className='flex items-center px-6 py-5 font-bold text-lg hover:bg-zinc-50 border-b border-zinc-100'
									>
										<ChevronLeft className='w-5 h-5 mr-3' />
										Fabrics A - D
									</button>

									{/* Subheader */}
									<div className='bg-zinc-100/80 px-6 py-3 text-sm font-bold text-zinc-800 border-b border-zinc-200'>
										Shop By Product
									</div>

									{/* Product List */}
									<div className='flex-1 overflow-y-auto'>
										{[
											'New Arrivals',
											'Fabric A1',
											'Fabric B1',
											'Fabric C1',
											'Fabric D1',
											'Fabric A1',
											'Fabric B1',
											'Fabric C1',
											'Fabric D1',
											'Fabric A1',
										].map((item, i) => (
											<Link
												href='/shop'
												key={i}
												onClick={() =>
													setDrawerOpen(false)
												}
												className={`flex items-center px-6 py-4 hover:bg-zinc-50 border-b border-zinc-100 transition-colors ${
													item === 'Fabric B1' &&
													i === 2
														? 'border-2 border-[#3D91E6]'
														: ''
												}`}
											>
												<div className='w-11 h-11 rounded-full bg-zinc-300 mr-5 flex-shrink-0'></div>
												<span className='font-bold text-[15px] text-zinc-800'>
													{item}
												</span>
											</Link>
										))}
									</div>
								</div>
							)}
						</div>
						<div
							className='flex-1'
							onClick={() => {
								setDrawerOpen(false);
								setActiveMenu('main');
							}}
						/>
					</div>
				)}
			</div>
		</>
	);
}
