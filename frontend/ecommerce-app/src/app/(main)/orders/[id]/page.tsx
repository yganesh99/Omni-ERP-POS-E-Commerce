import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailsPage({
	params,
}: {
	params: { id: string };
}) {
	const orderId = `#${params.id}`;

	return (
		<div className='container mx-auto px-4 py-8 max-w-[1000px] min-h-[60vh]'>
			{/* Breadcrumbs */}
			<div className='flex items-center text-xs text-zinc-500 mb-8 space-x-2'>
				<Link
					href='/'
					className='hover:text-brand-dark transition-colors'
				>
					Home
				</Link>
				<span>&gt;</span>
				<Link
					href='/orders'
					className='hover:text-brand-dark transition-colors'
				>
					My Orders
				</Link>
				<span>&gt;</span>
				<span className='text-zinc-900 font-medium'>Order Details</span>
			</div>

			<div className='mb-10 flex items-center space-x-4'>
				<Link
					href='/orders'
					className='p-1 border border-zinc-300 rounded hover:bg-zinc-50 transition-colors'
				>
					<ArrowLeft className='w-5 h-5' />
				</Link>
				<h1 className='text-3xl font-bold tracking-tight'>
					Order Details
				</h1>
			</div>

			<p className='text-zinc-600 mb-12 text-[15px]'>
				Order <span className='font-bold text-zinc-900'>{orderId}</span>{' '}
				Was Placed On{' '}
				<span className='font-bold text-zinc-900'>
					September 23, 2025
				</span>{' '}
				And Is Currently{' '}
				<span className='font-bold text-zinc-900'>Completed</span>.
			</p>

			{/* Order Items Table */}
			<div className='border-b border-zinc-200 mb-8'>
				<div className='flex justify-between font-bold pb-4 border-b border-zinc-200 text-sm'>
					<span>Product</span>
					<span>Total</span>
				</div>

				{/* Item 1 */}
				<div className='py-6 flex justify-between items-start border-b border-zinc-100 last:border-0'>
					<div className='flex space-x-6'>
						<div className='w-24 h-24 bg-zinc-200 flex-shrink-0'></div>
						<div className='flex flex-col space-y-1'>
							<h3 className='font-bold text-zinc-900 leading-tight'>
								Cotton Blend Marrakech
								<br />
								Bloom - CB-MB-2025
							</h3>
							<p className='text-sm text-zinc-500'>
								Quantity: 2M | Colour : Blue
							</p>
							<p className='text-sm text-zinc-500'>
								PPM - Rs. 200.00
							</p>
						</div>
					</div>
					<div className='font-medium text-zinc-600 self-center'>
						Rs. 400.00
					</div>
				</div>

				{/* Item 2 */}
				<div className='py-6 flex justify-between items-start'>
					<div className='flex space-x-6'>
						<div className='w-24 h-24 bg-zinc-200 flex-shrink-0'></div>
						<div className='flex flex-col space-y-1'>
							<h3 className='font-bold text-zinc-900 leading-tight'>
								Cotton Blend Marrakech
								<br />
								Bloom - CB-MB-2025
							</h3>
							<p className='text-sm text-zinc-500'>
								Quantity: 2M | Colour : Blue
							</p>
							<p className='text-sm text-zinc-500'>
								PPM - Rs. 200.00
							</p>
						</div>
					</div>
					<div className='font-medium text-zinc-600 self-center'>
						Rs. 400.00
					</div>
				</div>
			</div>

			{/* Order Summary */}
			<div className='flex flex-col items-end border-b border-zinc-200 pb-8 mb-8'>
				<div className='w-full max-w-sm space-y-4'>
					<div className='flex justify-between text-[15px] font-medium text-zinc-600'>
						<span>Sub Total</span>
						<span>Rs. 800.00</span>
					</div>
					<div className='flex justify-between text-[15px] font-medium text-zinc-600'>
						<span>Shipping</span>
						<span>Rs. 200.00</span>
					</div>
					<div className='flex justify-between text-[15px] font-medium text-zinc-600'>
						<span>Payment</span>
						<span className='text-blue-700 font-extrabold italic tracking-tight'>
							VISA
						</span>
					</div>

					<div className='flex justify-between text-2xl font-black pt-4'>
						<span>Total</span>
						<span>Rs. 1000.00</span>
					</div>
				</div>
			</div>

			{/* Addresses */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-12 mb-16'>
				<div>
					<h3 className='text-xl font-bold mb-4'>Billing Address</h3>
					<div className='text-zinc-600 text-[15px] leading-loose'>
						<p>Arthur Morgan</p>
						<p>No 10, Hill Street,</p>
						<p>Dehiwala,</p>
						<p>10350</p>
						<p>Sri Lanka</p>
						<p>(076) 456 1230</p>
						<p>arthurmorgan@gmail.com</p>
					</div>
				</div>
				<div>
					<h3 className='text-xl font-bold mb-4'>Shipping Address</h3>
					<div className='text-zinc-600 text-[15px] leading-loose'>
						<p>Arthur Morgan</p>
						<p>No 10, Hill Street,</p>
						<p>Dehiwala,</p>
						<p>10350</p>
					</div>
				</div>
			</div>

			{/* Footer message */}
			<div className='text-center pb-12'>
				<h2 className='text-2xl font-bold mb-2 tracking-tight'>
					Thank You For Your Purchase!
				</h2>
				<p className='text-zinc-500 text-[15px]'>
					Contact us for help at - fabrichub@gmail.com
				</p>
			</div>
		</div>
	);
}
