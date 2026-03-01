'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function CheckoutPage() {
	const [shippingMethod, setShippingMethod] = useState('colombo');

	return (
		<div className='container mx-auto px-4 py-8 mb-16 max-w-[1100px] min-h-[60vh]'>
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
					href='/cart'
					className='hover:text-brand-dark transition-colors'
				>
					Cart
				</Link>
				<span>&gt;</span>
				<span className='text-zinc-900'>Checkout</span>
			</div>

			<h1 className='text-3xl font-bold tracking-tight mb-10'>
				Checkout
			</h1>

			<div className='flex flex-col lg:flex-row gap-12 lg:gap-24 relative'>
				{/* Left Column - Form */}
				<div className='flex-1 pr-0 lg:pr-8'>
					{/* Information */}
					<div className='mb-10'>
						<h2 className='text-lg font-bold mb-4'>Information</h2>
						<div className='space-y-2.5'>
							<label className='text-[13px] font-bold text-zinc-800 block'>
								Email Address
							</label>
							<input
								type='email'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 transition-colors'
							/>
							<p className='text-[11px] text-zinc-600 font-bold mt-1'>
								Already has an account?{' '}
								<Link
									href='/login'
									className='text-brand-red hover:underline'
								>
									Sign in
								</Link>
							</p>
						</div>
					</div>

					{/* Shipping Address */}
					<div className='mb-10'>
						<h2 className='text-lg font-bold mb-4'>
							Shipping address
						</h2>
						<div className='space-y-4'>
							<input
								type='text'
								placeholder='Country/Region'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-400'
							/>

							<div className='grid grid-cols-2 gap-4'>
								<input
									type='text'
									placeholder='First name'
									className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-400'
								/>
								<input
									type='text'
									placeholder='Last name'
									className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-400'
								/>
							</div>

							<input
								type='text'
								placeholder='Address'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-400'
							/>

							<div className='grid grid-cols-2 gap-4'>
								<input
									type='text'
									placeholder='City'
									className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-400'
								/>
								<input
									type='text'
									placeholder='Postal Code (Optional)'
									className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-400'
								/>
							</div>

							<input
								type='tel'
								placeholder='Phone'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-400'
							/>
						</div>
					</div>

					{/* Shipping Method */}
					<div className='mb-10'>
						<h2 className='text-lg font-bold mb-4'>
							Shipping method
						</h2>
						<div className='w-full border border-zinc-100 rounded-sm overflow-hidden text-[13px]'>
							{/* Header */}
							<div className='bg-zinc-100 px-4 py-3 flex font-bold text-zinc-900 border-b border-zinc-100'>
								<div className='w-[45%]'>Destination</div>
								<div className='w-[35%]'>Estimated Arrival</div>
								<div className='w-[20%] text-right pr-2'>
									Shipping Cost
								</div>
							</div>

							{/* Rows */}
							<label className='flex items-center px-4 py-5 hover:bg-zinc-50 cursor-pointer border-b border-zinc-100 transition-colors'>
								<div className='w-[45%] flex items-start'>
									<input
										type='radio'
										name='shipping'
										value='colombo'
										checked={shippingMethod === 'colombo'}
										onChange={(e) =>
											setShippingMethod(e.target.value)
										}
										className='mt-1 mr-3 accent-black w-3.5 h-3.5'
									/>
									<span className='font-bold text-zinc-900 pr-4'>
										Colombo District
										<br />
										<span className='text-[11px] font-normal'>
											(1 - 15)
										</span>
									</span>
								</div>
								<div className='w-[35%] text-zinc-800 font-medium pt-0.5'>
									3-4 Working Day
								</div>
								<div className='w-[20%] text-right font-bold text-zinc-900 pt-0.5 pr-2'>
									Rs 1,000.00
								</div>
							</label>

							<label className='flex items-center px-4 py-5 hover:bg-zinc-50 cursor-pointer border-b border-zinc-100 transition-colors'>
								<div className='w-[45%] flex items-start'>
									<input
										type='radio'
										name='shipping'
										value='outside'
										checked={shippingMethod === 'outside'}
										onChange={(e) =>
											setShippingMethod(e.target.value)
										}
										className='mt-1 mr-3 accent-black w-3.5 h-3.5'
									/>
									<span className='font-bold text-zinc-900 pr-4'>
										Outside Colombo
										<br />
										<span className='text-[11px] font-normal'>
											District
										</span>
									</span>
								</div>
								<div className='w-[35%] text-zinc-800 font-medium pt-0.5'>
									3-4 Working Day
								</div>
								<div className='w-[20%] text-right font-bold text-zinc-900 pt-0.5 pr-2'>
									Rs 1,500.00
								</div>
							</label>

							<label className='flex items-center px-4 py-5 hover:bg-zinc-50 cursor-pointer transition-colors'>
								<div className='w-full flex items-center'>
									<input
										type='radio'
										name='shipping'
										value='pickup'
										checked={shippingMethod === 'pickup'}
										onChange={(e) =>
											setShippingMethod(e.target.value)
										}
										className='mr-3 accent-black w-3.5 h-3.5'
									/>
									<span className='font-bold text-zinc-900'>
										Store Pickup
									</span>
								</div>
							</label>
						</div>
					</div>

					{/* Payment */}
					<div className='mb-10'>
						<h2 className='text-lg font-bold mb-4'>Payment</h2>

						<div className='space-y-5'>
							<div className='flex items-center mb-2'>
								<span className='text-[13px] font-bold text-zinc-900 mr-4'>
									Card Details
								</span>
								<div className='flex space-x-1 border border-zinc-200 rounded px-2 py-0.5 bg-zinc-50 shadow-sm text-[8px] font-black italic tracking-tighter items-center text-blue-700'>
									VISA
								</div>
								<div className='flex space-x-1 border border-zinc-200 rounded px-2 py-0.5 bg-amber-50 shadow-sm text-[8px] font-black ml-1 text-red-500 items-center'>
									<div className='w-2 h-2 rounded-full bg-red-500 opacity-80 -mr-1'></div>
									<div className='w-2 h-2 rounded-full bg-yellow-500 opacity-80'></div>
								</div>
								<div className='flex space-x-1 border border-zinc-200 rounded px-2 py-0.5 bg-zinc-50 shadow-sm text-[8px] font-black ml-1 text-zinc-700 items-center'>
									G Pay
								</div>
							</div>

							<div className='space-y-1.5'>
								<label className='text-[13px] font-bold text-zinc-900 block'>
									Cardholder&apos;s name
								</label>
								<input
									type='text'
									placeholder='Arthur Morgan'
									className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-600 block'
								/>
							</div>

							<div className='space-y-1.5'>
								<label className='text-[13px] font-bold text-zinc-900 block'>
									Card number
								</label>
								<input
									type='text'
									placeholder='4212 1234 1234 1234'
									className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-400 tracking-wider'
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-1.5'>
									<label className='text-[13px] font-bold text-zinc-900 block'>
										Expiry
									</label>
									<input
										type='text'
										placeholder='12/25'
										className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-400'
									/>
								</div>
								<div className='space-y-1.5'>
									<label className='text-[13px] font-bold text-zinc-900 block'>
										CVC
									</label>
									<input
										type='text'
										placeholder='123'
										className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500 text-sm placeholder:text-zinc-400'
									/>
								</div>
							</div>

							<label className='flex items-center pt-2 cursor-pointer group'>
								<div className='w-5 h-5 border border-zinc-400 rounded-sm group-hover:border-black mr-3 flex-shrink-0 flex items-center justify-center'></div>
								<span className='text-[13px] font-bold text-zinc-900'>
									Use shipping address as billing address
								</span>
							</label>

							<button className='w-full bg-black text-white py-4 text-sm font-bold tracking-wide rounded-sm hover:bg-zinc-800 transition-colors mt-6'>
								Pay now
							</button>
						</div>
					</div>
				</div>

				{/* Vertical Divider for desktop */}
				<div className='hidden lg:block absolute left-1/2 top-4 bottom-0 w-px bg-zinc-200 -translate-x-1/2'></div>

				{/* Right Column - Order Summary */}
				<div className='w-full lg:w-[420px] flex-shrink-0 pt-2 lg:pl-10'>
					<div className='flex items-center mb-8 font-bold text-lg'>
						<ShoppingCart className='w-5 h-5 mr-3' />
						Your Order
					</div>

					<div className='space-y-6 mb-8 border-b border-zinc-200 pb-8'>
						{/* Item 1 */}
						<div className='flex gap-4'>
							<div className='w-[85px] aspect-[4/5] bg-[#E5E5E5] flex-shrink-0'></div>
							<div className='flex flex-col pt-1 space-y-2.5 flex-1'>
								<h4 className='font-bold text-[13px] leading-tight text-zinc-900 pr-8'>
									Cotton Blend Marrakech Bloom - CB-MB-2025
								</h4>
								<div className='text-[11px] font-bold text-zinc-600 space-y-1.5'>
									<p>Colour : Blue</p>
									<p>Qty : 1</p>
								</div>
								<p className='font-bold text-[13px] text-zinc-900 pt-1'>
									Rs 2,500.00
								</p>
							</div>
						</div>

						{/* Item 2 */}
						<div className='flex gap-4'>
							<div className='w-[85px] aspect-[4/5] bg-[#E5E5E5] flex-shrink-0'></div>
							<div className='flex flex-col pt-1 space-y-2.5 flex-1'>
								<h4 className='font-bold text-[13px] leading-tight text-zinc-900 pr-8'>
									Linen Blend Marrakech Bloom - LB-MB-2025
								</h4>
								<div className='text-[11px] font-bold text-zinc-600 space-y-1.5'>
									<p>Colour : Blue</p>
									<p>Qty : 1</p>
								</div>
								<p className='font-bold text-[13px] text-zinc-900 pt-1'>
									Rs 1,500.00
								</p>
							</div>
						</div>
					</div>

					<div className='space-y-4 mb-8'>
						<div className='flex justify-between text-[13px] font-bold text-zinc-800'>
							<span>Subtotal</span>
							<span>Rs 4,000.00</span>
						</div>
						<div className='flex justify-between text-[13px] font-bold text-zinc-800'>
							<span>Shipping</span>
							<span>Rs 1,000.00</span>
						</div>
						<div className='flex justify-between text-[13px] font-bold text-zinc-800'>
							<span>Coupon</span>
							<span>-</span>
						</div>
					</div>

					<div className='flex justify-between text-xl font-black tracking-tight mb-8'>
						<span>Total</span>
						<span>Rs 5,000.00</span>
					</div>
				</div>
			</div>
		</div>
	);
}
