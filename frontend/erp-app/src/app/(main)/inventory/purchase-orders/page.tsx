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
import { Search, Plus, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface PurchaseOrder {
	_id: string;
	poNumber: string;
	status: string;
	supplierId?: { _id: string; name: string } | string | null;
	storeId?: { _id: string; name: string } | string | null;
	totalAmount: number;
	items: any[];
	createdAt: string;
}

export default function PurchaseOrdersPage() {
	const router = useRouter();
	const [orders, setOrders] = useState<PurchaseOrder[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchOrders = async () => {
		try {
			setIsLoading(true);
			const response = await api.get('/purchase-orders');
			const data = response.data;
			const list = data.items || data.data || data || [];
			setOrders(Array.isArray(list) ? list : []);
		} catch (error) {
			console.error('Failed to fetch purchase orders:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const getSupplierName = (po: PurchaseOrder) => {
		if (!po.supplierId) return '—';
		if (typeof po.supplierId === 'object' && po.supplierId?.name)
			return po.supplierId.name;
		return '—';
	};

	const drafts = orders.filter((o) => o.status === 'draft');
	const sent = orders.filter(
		(o) => o.status === 'sent' || o.status === 'approved',
	);
	const partial = orders.filter((o) => o.status === 'partial_received');
	const pipeline = orders
		.filter((o) => !['closed', 'cancelled'].includes(o.status))
		.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

	const getStatusBadge = (status: string) => {
		const colors: Record<string, string> = {
			draft: 'bg-zinc-100 text-zinc-700',
			approved: 'bg-blue-100 text-blue-700',
			sent: 'bg-blue-100 text-blue-700',
			partial_received: 'bg-amber-100 text-amber-700',
			closed: 'bg-green-100 text-green-700',
			cancelled: 'bg-red-100 text-red-700',
		};
		return colors[status] || 'bg-zinc-100 text-zinc-700';
	};

	return (
		<RoleGuard allowedRoles={['admin', 'inventory_manager']}>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h2 className='text-3xl font-bold tracking-tight'>
							Purchase Orders
						</h2>
						<p className='text-zinc-500'>
							Create and manage stock purchase orders to
							suppliers.
						</p>
					</div>
					<div className='flex items-center space-x-3'>
						<Button
							className='bg-black text-white hover:bg-zinc-800'
							onClick={() =>
								router.push('/inventory/purchase-orders/create')
							}
						>
							<Plus className='w-4 h-4 mr-2' />
							Create PO
						</Button>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<Card>
						<CardContent className='p-6 flex flex-col items-start'>
							<p className='text-sm font-medium text-zinc-500'>
								Drafts
							</p>
							<p className='text-2xl font-bold mt-2'>
								{drafts.length}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6 flex flex-col items-start'>
							<p className='text-sm font-medium text-zinc-500'>
								Sent (Awaiting)
							</p>
							<p className='text-2xl font-bold mt-2 text-blue-600'>
								{sent.length}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6 flex flex-col items-start'>
							<p className='text-sm font-medium text-zinc-500'>
								Partially Received
							</p>
							<p className='text-2xl font-bold mt-2 text-amber-600'>
								{partial.length}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6 flex flex-col items-start'>
							<p className='text-sm font-medium text-zinc-500'>
								Value in Pipeline
							</p>
							<p className='text-2xl font-bold mt-2'>
								රු
								{pipeline.toLocaleString('en-US', {
									minimumFractionDigits: 2,
								})}
							</p>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
						<CardTitle>Purchase Orders</CardTitle>
						<div className='flex items-center space-x-2'>
							<div className='relative'>
								<Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400' />
								<Input
									type='text'
									placeholder='Search POs...'
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
								Loading purchase orders...
							</p>
						) : orders.length === 0 ? (
							<p className='text-center text-zinc-500 py-8'>
								No purchase orders found.
							</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>PO Number</TableHead>
										<TableHead>Date Created</TableHead>
										<TableHead>Supplier</TableHead>
										<TableHead>Items</TableHead>
										<TableHead className='text-right'>
											Total Amount
										</TableHead>
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
													`/inventory/purchase-orders/${order._id}`,
												)
											}
										>
											<TableCell className='font-medium'>
												<div className='flex items-center space-x-2'>
													<FileText className='w-4 h-4 text-zinc-400' />
													<span>
														{order.poNumber}
													</span>
												</div>
											</TableCell>
											<TableCell>
												{new Date(
													order.createdAt,
												).toLocaleDateString()}
											</TableCell>
											<TableCell>
												{getSupplierName(order)}
											</TableCell>
											<TableCell>
												{order.items?.length || 0}
											</TableCell>
											<TableCell className='text-right font-medium'>
												රු
												{(
													order.totalAmount || 0
												).toFixed(2)}
											</TableCell>
											<TableCell>
												<span
													className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusBadge(order.status)}`}
												>
													{order.status.replace(
														'_',
														' ',
													)}
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
