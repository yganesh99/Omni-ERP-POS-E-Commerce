'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Download, Search, MoreHorizontal } from 'lucide-react';

export default function OrdersPage() {
	const ordersData = [
		{
			id: 'ORD-9382',
			date: '2026-03-01',
			customer: 'Liam Johnson',
			total: '$450.00',
			status: 'Processing',
			items: 3,
		},
		{
			id: 'ORD-9381',
			date: '2026-03-01',
			customer: 'Emma Williams',
			total: '$125.50',
			status: 'Shipped',
			items: 1,
		},
		{
			id: 'ORD-9380',
			date: '2026-02-28',
			customer: 'Noah Brown',
			total: '$2,340.00',
			status: 'Delivered',
			items: 12,
		},
		{
			id: 'ORD-9379',
			date: '2026-02-28',
			customer: 'Olivia Jones',
			total: '$89.99',
			status: 'Processing',
			items: 2,
		},
		{
			id: 'ORD-9378',
			date: '2026-02-27',
			customer: 'William Garcia',
			total: '$420.00',
			status: 'Cancelled',
			items: 4,
		},
	];

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>
						Orders
					</h2>
					<p className='text-zinc-500'>
						Manage customer orders, shipments, and returns.
					</p>
				</div>
				<button className='flex items-center space-x-2 bg-white border border-brand-border text-zinc-900 px-4 py-2 rounded-md hover:bg-zinc-50 transition-colors font-medium'>
					<Download className='w-4 h-4' />
					<span>Export CSV</span>
				</button>
			</div>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
					<CardTitle>Recent Orders</CardTitle>
					<div className='relative'>
						<Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400' />
						<input
							type='text'
							placeholder='Search by Order ID or Customer...'
							className='w-80 pl-9 pr-4 py-1.5 border border-brand-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue'
						/>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order ID</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Items</TableHead>
								<TableHead className='text-right'>
									Total Amount
								</TableHead>
								<TableHead>Status</TableHead>
								<TableHead></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{ordersData.map((order) => (
								<TableRow key={order.id}>
									<TableCell className='font-medium text-brand-blue hover:underline cursor-pointer'>
										{order.id}
									</TableCell>
									<TableCell className='text-zinc-500'>
										{order.date}
									</TableCell>
									<TableCell>{order.customer}</TableCell>
									<TableCell>{order.items}</TableCell>
									<TableCell className='text-right font-medium'>
										{order.total}
									</TableCell>
									<TableCell>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium
                      ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : ''}
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : ''}
                      ${order.status === 'Processing' ? 'bg-amber-100 text-amber-700' : ''}
                      ${order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}
                    `}
										>
											{order.status}
										</span>
									</TableCell>
									<TableCell className='text-right'>
										<button className='p-1 hover:bg-zinc-100 rounded text-zinc-500 cursor-pointer'>
											<MoreHorizontal className='w-4 h-4' />
										</button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
