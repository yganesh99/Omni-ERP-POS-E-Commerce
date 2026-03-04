'use client';

import Link from 'next/link';
import { Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
	const { user } = useAuth();
	const router = useRouter();
	const [items, setItems] = useState([
		{
			id: 1,
			name: 'Cotton Blend Marrakech Bloom - CB-MB-2025',
			color: 'Blue',
			price: 2500,
			originalPrice: null,
			quantity: 1,
		},
		{
			id: 2,
			name: 'Linen Blend Marrakech Bloom - LB-MB-2025',
			color: 'Blue',
			price: 1500,
			originalPrice: 2000,
			quantity: 1,
		},
	]);

	const updateQuantity = (id: number, delta: number) => {
		setItems(
			items.map((item) => {
				if (item.id === id) {
					return {
						...item,
						quantity: Math.max(1, item.quantity + delta),
					};
				}
				return item;
			}),
		);
	};

	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	return (
		<div className='container mx-auto px-4 py-8 mb-16 max-w-[1240px] min-h-[60vh]'>
			{/* Breadcrumb */}
			<div className='text-xs text-zinc-500 mb-6 font-medium space-x-2'>
				<Link
					href='/'
					className='hover:text-brand-dark transition-colors'
				>
					Home
				</Link>
				<span>/</span>
				<span className='text-zinc-900'>Cart</span>
			</div>

			<h1 className='text-3xl font-bold tracking-tight mb-8'>
				Shopping Cart
			</h1>

			<div className='flex flex-col lg:flex-row gap-12 lg:gap-16'>
				{/* Left Column - Cart Items */}
				<div className='flex-1'>
					{/* Table Header */}
					<div className='flex pb-4 border-b border-zinc-200 text-sm font-bold text-zinc-900'>
						<div className='flex-1'>Product</div>
						<div className='w-32 text-center'>Quantity</div>
						<div className='w-32 text-right mr-12'>Price</div>
					</div>

					{/* Table Body */}
					<div className='flex flex-col'>
						{items.map((item) => (
							<div
								key={item.id}
								className='flex items-start py-8 border-b border-zinc-100 last:border-b-0'
							>
								<div className='flex flex-1 gap-6'>
									<div className='w-[120px] aspect-square bg-[#E5E5E5] flex-shrink-0'></div>
									<div className='flex flex-col space-y-2 pt-1'>
										<h3 className='font-bold text-[15px] leading-tight max-w-[200px] text-zinc-900'>
											{item.name}
										</h3>
										<p className='text-[13px] text-zinc-500 font-medium'>
											Colour : {item.color}
										</p>
									</div>
								</div>

								<div className='w-32 flex justify-center pt-2'>
									<div className='flex items-center border border-zinc-200 rounded-sm w-[100px] h-10'>
										<button
											className='w-1/3 h-full flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors'
											onClick={() =>
												updateQuantity(item.id, -1)
											}
										>
											-
										</button>
										<input
											type='number'
											value={item.quantity}
											readOnly
											className='w-1/3 h-full text-center focus:outline-none font-bold text-[13px]'
										/>
										<button
											className='w-1/3 h-full flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors'
											onClick={() =>
												updateQuantity(item.id, 1)
											}
										>
											+
										</button>
									</div>
								</div>

								<div className='w-32 flex flex-col items-end pt-3 mr-4'>
									{item.originalPrice && (
										<span className='text-[13px] font-bold text-zinc-500 line-through mb-1'>
											Rs{' '}
											{item.originalPrice.toLocaleString(
												'en-US',
												{ minimumFractionDigits: 2 },
											)}
										</span>
									)}
									<span
										className={`text-[15px] font-bold ${item.originalPrice ? 'text-brand-red' : 'text-zinc-900'}`}
									>
										Rs{' '}
										{item.price.toLocaleString('en-US', {
											minimumFractionDigits: 2,
										})}
									</span>
								</div>

								<button className='pt-3 text-brand-red hover:text-red-700 transition-colors p-1'>
									<Trash2 className='w-5 h-5 stroke-[1.5]' />
								</button>
							</div>
						))}
					</div>

					<div className='border-t border-zinc-200 w-full mt-2'></div>
				</div>

				{/* Right Column - Order Summary */}
				<div className='w-full lg:w-[380px] flex-shrink-0 pt-2'>
					<h3 className='text-base font-bold text-zinc-900 mb-6 tracking-tight'>
						Order Summary
					</h3>

					<div className='flex mb-8'>
						<input
							type='text'
							placeholder='Enter Promo Code'
							className='flex-1 border border-zinc-300 rounded-l-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-400'
						/>
						<button className='bg-black text-white px-6 font-bold text-xs tracking-wider rounded-r-sm hover:bg-zinc-800 transition-colors'>
							Apply
						</button>
					</div>

					<div className='space-y-4 mb-6'>
						<div className='flex justify-between text-[15px] font-bold text-zinc-800'>
							<span>Subtotal</span>
							<span>
								Rs{' '}
								{subtotal.toLocaleString('en-US', {
									minimumFractionDigits: 2,
								})}
							</span>
						</div>
						<div className='flex justify-between text-[15px] font-bold text-zinc-800'>
							<span>Shipping</span>
							<span>TBD</span>
						</div>
						<div className='flex justify-between text-[15px] font-bold text-zinc-800'>
							<span>Coupon</span>
							<span>TBD</span>
						</div>
					</div>

					<div className='border-t border-zinc-200 mb-4'></div>

					<div className='bg-red-50/50 text-brand-red text-xs py-2 px-3 rounded-sm flex items-center justify-center font-bold mb-6'>
						<AlertCircle className='w-3.5 h-3.5 mr-1.5' />
						You save Rs 500 (25%)
					</div>

					<div className='flex justify-between text-2xl font-black tracking-tight mb-8'>
						<span>Total</span>
						<span>
							Rs{' '}
							{subtotal.toLocaleString('en-US', {
								minimumFractionDigits: 2,
							})}
						</span>
					</div>

					<button
						onClick={() => {
							if (!user) {
								router.push('/login?callbackUrl=/checkout');
							} else {
								router.push('/checkout');
							}
						}}
						className='block w-full text-center bg-black text-white py-4 text-sm font-bold tracking-wide rounded-sm hover:bg-zinc-800 transition-colors mb-4'
					>
						Proceed To Checkout
					</button>

					<Link
						href='/shop'
						className='block w-full text-center text-xs font-bold text-zinc-600 hover:text-black hover:underline transition-all'
					>
						Continue Shopping
					</Link>
				</div>
			</div>
		</div>
	);
}
