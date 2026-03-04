'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RoleGuard from '@/components/RoleGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface Order {
	_id: string;
	orderNumber: string;
	channel: string;
	status: string;
	customerId?: { _id: string; name: string } | string | null;
	totalAmount: number;
	subtotal: number;
	taxAmount: number;
	paymentMethod: string;
	createdAt: string;
}

export default function SalesOrdersPage() {
	const router = useRouter();
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchOrders = async () => {
		try {
			setIsLoading(true);
			const response = await api.get('/orders');
			const data = response.data;
			const list = data.items || data.data || data || [];
			setOrders(Array.isArray(list) ? list : []);
		} catch (error) {
			console.error('Failed to fetch orders:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const todayStr = new Date().toISOString().split('T')[0];
	const todayOrders = orders.filter((o) => o.createdAt?.startsWith(todayStr));
	const todaySales = todayOrders.reduce(
		(sum, o) => sum + (o.totalAmount || 0),
		0,
	);
	const pendingOrders = orders.filter(
		(o) => o.status === 'pending' || o.status === 'processing',
	);
	const monthTotal = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

	const getCustomerName = (order: Order) => {
		if (!order.customerId) return 'Walk-in Customer';
		if (typeof order.customerId === 'object' && order.customerId?.name) {
			return order.customerId.name;
		}
		return 'Customer';
	};

	const getPaymentBadge = (method: string) => {
		const colors: Record<string, string> = {
			cash: 'bg-green-100 text-green-700',
			card: 'bg-blue-100 text-blue-700',
			credit: 'bg-amber-100 text-amber-700',
			qr: 'bg-purple-100 text-purple-700',
			split: 'bg-zinc-100 text-zinc-700',
		};
		return colors[method] || 'bg-zinc-100 text-zinc-700';
	};

	const getStatusBadge = (status: string) => {
		const colors: Record<string, string> = {
			pending: 'bg-amber-100 text-amber-700',
			confirmed: 'bg-blue-100 text-blue-700',
			processing: 'bg-blue-100 text-blue-700',
			shipped: 'bg-indigo-100 text-indigo-700',
			delivered: 'bg-green-100 text-green-700',
			cancelled: 'bg-red-100 text-red-700',
			returned: 'bg-zinc-100 text-zinc-700',
		};
		return colors[status] || 'bg-zinc-100 text-zinc-700';
	};

	return (
		<RoleGuard allowedRoles={['admin', 'accountant']}>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h2 className='text-3xl font-bold tracking-tight'>
							Sales & Invoicing
						</h2>
						<p className='text-zinc-500'>
							Manage customer orders, invoices, and analytics.
						</p>
					</div>
					<div className='flex items-center space-x-3'>
						<Button variant='outline'>
							<Download className='w-4 h-4 mr-2' />
							Export Sales
						</Button>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<Card>
						<CardContent className='p-6 flex flex-col items-start'>
							<p className='text-sm font-medium text-zinc-500'>
								Total Sales (Today)
							</p>
							<p className='text-2xl font-bold mt-2'>
								රු{todaySales.toFixed(2)}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6 flex flex-col items-start'>
							<p className='text-sm font-medium text-zinc-500'>
								Orders (Today)
							</p>
							<p className='text-2xl font-bold mt-2'>
								{todayOrders.length}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6 flex flex-col items-start'>
							<p className='text-sm font-medium text-zinc-500'>
								Pending Orders
							</p>
							<p className='text-2xl font-bold mt-2 text-amber-600'>
								{pendingOrders.length}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6 flex flex-col items-start'>
							<p className='text-sm font-medium text-zinc-500'>
								Total (All Time)
							</p>
							<p className='text-2xl font-bold mt-2'>
								රු{monthTotal.toFixed(2)}
							</p>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
						<CardTitle>Recent Orders</CardTitle>
						<div className='flex items-center space-x-2'>
							<div className='relative'>
								<Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400' />
								<Input
									type='text'
									placeholder='Search orders...'
									className='w-64 pl-9 pr-4 py-1.5 h-9 text-sm'
								/>
							</div>
							<Button
								variant='outline'
								className='flex items-center space-x-2 h-9'
							>
								<Filter className='w-4 h-4' />
								<span>Filters</span>
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<p className='text-center text-zinc-500 py-8'>
								Loading orders...
							</p>
						) : orders.length === 0 ? (
							<p className='text-center text-zinc-500 py-8'>
								No orders found.
							</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Order ID</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Customer</TableHead>
										<TableHead>Channel</TableHead>
										<TableHead className='text-right'>
											Total
										</TableHead>
										<TableHead>Payment</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orders.map((order) => (
										<TableRow
											key={order._id}
											className='cursor-pointer hover:bg-zinc-50'
											onClick={() =>
												router.push(
													`/sales/orders/${order._id}`,
												)
											}
										>
											<TableCell className='font-medium'>
												{order.orderNumber}
											</TableCell>
											<TableCell>
												{new Date(
													order.createdAt,
												).toLocaleDateString()}
											</TableCell>
											<TableCell>
												{getCustomerName(order)}
											</TableCell>
											<TableCell>
												<span className='px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700 uppercase'>
													{order.channel}
												</span>
											</TableCell>
											<TableCell className='text-right font-medium'>
												රු
												{(
													order.totalAmount || 0
												).toFixed(2)}
											</TableCell>
											<TableCell>
												<span
													className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${getPaymentBadge(order.paymentMethod)}`}
												>
													{order.paymentMethod}
												</span>
											</TableCell>
											<TableCell>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
												>
													{order.status}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>
		</RoleGuard>
	);
}
