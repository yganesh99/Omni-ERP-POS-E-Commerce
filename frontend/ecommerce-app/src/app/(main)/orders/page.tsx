'use client';

import Link from 'next/link';
import { Search, MoreVertical, Eye, X } from 'lucide-react';
import { useState } from 'react';

export default function OrdersPage() {
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

	const orders = [
		{
			id: '#0001',
			date: 'Sep 23, 2025',
			quantity: 5,
			total: 'Rs. 8500.00',
			status: 'Completed',
		},
		{
			id: '#0002',
			date: 'Sep 18, 2025',
			quantity: 3,
			total: 'Rs. 4500.00',
			status: 'Completed',
		},
		{
			id: '#0003',
			date: 'Sep 15, 2025',
			quantity: 2,
			total: 'Rs. 3500.00',
			status: 'Completed',
		},
	];

	return (
		<div className='container mx-auto px-4 py-8 max-w-[1200px] min-h-[60vh]'>
			{/* Breadcrumbs */}
			<div className='flex items-center text-xs text-zinc-500 mb-8 space-x-2'>
				<Link
					href='/'
					className='hover:text-brand-dark transition-colors'
				>
					Home
				</Link>
				<span>&gt;</span>
				<span className='hover:text-brand-dark transition-colors cursor-pointer'>
					My Orders
				</span>
				<span>&gt;</span>
				<span className='text-zinc-900 font-medium'>Orders</span>
			</div>

			<div className='mb-8'>
				<div className='border-b border-zinc-200'>
					<h1 className='text-2xl font-bold inline-block border-b-2 border-brand-red pb-4 -mb-[2px]'>
						Orders ({orders.length})
					</h1>
				</div>
			</div>

			<div className='mb-6 relative w-full max-w-sm'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400' />
				<input
					type='text'
					placeholder='Search products...'
					className='w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-sm text-sm focus:outline-none focus:border-zinc-400'
				/>
			</div>

			{/* Orders Table */}
			<div className='w-full overflow-x-auto'>
				<table className='w-full text-left text-sm whitespace-nowrap'>
					<thead>
						<tr className='bg-zinc-50 border-b border-zinc-100 text-zinc-700'>
							<th className='py-4 px-6 font-semibold rounded-l-md'>
								Order ID
							</th>
							<th className='py-4 px-6 font-semibold'>Date</th>
							<th className='py-4 px-6 font-semibold'>
								Quantity
							</th>
							<th className='py-4 px-6 font-semibold'>Total</th>
							<th className='py-4 px-6 font-semibold'>Status</th>
							<th className='py-4 px-6 rounded-r-md'></th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr
								key={order.id}
								className='border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors'
							>
								<td className='py-5 px-6 font-bold'>
									{order.id}
								</td>
								<td className='py-5 px-6 text-zinc-600'>
									{order.date}
								</td>
								<td className='py-5 px-6 text-zinc-600'>
									{order.quantity}
								</td>
								<td className='py-5 px-6 text-zinc-600'>
									{order.total}
								</td>
								<td className='py-5 px-6 text-zinc-600'>
									{order.status}
								</td>
								<td className='py-5 px-6 text-right relative'>
									<button
										onClick={() =>
											setActiveDropdown(
												activeDropdown === order.id
													? null
													: order.id,
											)
										}
										className='p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-600 transition-colors'
									>
										<MoreVertical className='w-5 h-5' />
									</button>

									{/* Action Dropdown */}
									{activeDropdown === order.id && (
										<div className='absolute right-8 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-zinc-100 rounded-md py-1.5 w-40 z-10 flex flex-col text-left'>
											<Link
												href={`/orders/${order.id.replace('#', '')}`}
												className='flex items-center px-4 py-2 hover:bg-zinc-50 text-zinc-700 transition-colors text-xs font-medium'
											>
												<Eye className='w-3.5 h-3.5 mr-2' />
												View order
											</Link>
											<button className='flex items-center px-4 py-2 hover:bg-zinc-50 text-red-600 transition-colors text-xs font-medium w-full text-left'>
												<X className='w-3.5 h-3.5 mr-2' />
												Cancel order
											</button>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
