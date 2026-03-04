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
import { Button } from '@/components/ui/button';
import {
	ArrowLeft,
	Download,
	RotateCcw,
	CreditCard,
	Printer,
} from 'lucide-react';
import api from '@/lib/api';

interface OrderItem {
	productId: string;
	sku: string;
	name: string;
	quantity: number;
	unitPrice: number;
	taxRate: number;
	taxAmount: number;
	lineTotal: number;
}

interface Payment {
	method: string;
	amount: number;
	reference?: string;
}

interface Order {
	_id: string;
	orderNumber: string;
	channel: string;
	status: string;
	customerId?: {
		_id: string;
		name: string;
		email?: string;
		phone?: string;
	} | null;
	storeId?: { _id: string; name: string } | null;
	items: OrderItem[];
	subtotal: number;
	taxAmount: number;
	totalAmount: number;
	paymentMethod: string;
	payments: Payment[];
	creditUsed: number;
	notes?: string;
	createdAt: string;
}

const STATUS_OPTIONS = [
	'pending',
	'confirmed',
	'processing',
	'shipped',
	'delivered',
	'cancelled',
	'returned',
];

export default function SingleOrderPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const { id } = params;

	const [order, setOrder] = useState<Order | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

	const fetchOrder = async () => {
		try {
			setIsLoading(true);
			const response = await api.get(`/orders/${id}`);
			const data = response.data.data || response.data;
			setOrder(data);
		} catch (error) {
			console.error('Failed to fetch order:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (id) {
			fetchOrder();
		}
	}, [id]);

	const handleStatusChange = async (newStatus: string) => {
		try {
			setIsUpdatingStatus(true);
			await api.patch(`/orders/${id}/status`, { status: newStatus });
			await fetchOrder();
			alert(`Order status updated to "${newStatus}"`);
		} catch (error) {
			console.error('Failed to update status:', error);
			alert('Failed to update order status.');
		} finally {
			setIsUpdatingStatus(false);
		}
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

	if (isLoading) {
		return (
			<div className='p-8 text-center text-zinc-500'>
				Loading order details...
			</div>
		);
	}

	if (!order) {
		return (
			<div className='p-8 text-center text-red-500'>Order not found.</div>
		);
	}

	const customerName =
		typeof order.customerId === 'object' && order.customerId?.name
			? order.customerId.name
			: 'Walk-in Customer';
	const customerEmail =
		typeof order.customerId === 'object'
			? order.customerId?.email
			: undefined;
	const customerPhone =
		typeof order.customerId === 'object'
			? order.customerId?.phone
			: undefined;
	const customerId =
		typeof order.customerId === 'object'
			? order.customerId?._id
			: undefined;

	return (
		<RoleGuard allowedRoles={['admin', 'accountant']}>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => router.back()}
						>
							<ArrowLeft className='w-5 h-5' />
						</Button>
						<div>
							<h2 className='text-3xl font-bold tracking-tight'>
								Order {order.orderNumber}
							</h2>
							<p className='text-zinc-500'>
								{new Date(order.createdAt).toLocaleString()} |
								Channel:{' '}
								<span className='uppercase font-medium'>
									{order.channel}
								</span>{' '}
								| Status:{' '}
								<span
									className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
								>
									{order.status}
								</span>
							</p>
						</div>
					</div>
					<div className='flex items-center space-x-3'>
						<Button variant='outline'>
							<Printer className='w-4 h-4 mr-2' />
							Print
						</Button>
						<Button variant='outline'>
							<Download className='w-4 h-4 mr-2' />
							Download Invoice
						</Button>
						{order.status !== 'cancelled' &&
							order.status !== 'returned' && (
								<Button
									variant='outline'
									className='text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200'
								>
									<RotateCcw className='w-4 h-4 mr-2' />
									Refund / Return
								</Button>
							)}
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='md:col-span-2 space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle>Order Items</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Product</TableHead>
											<TableHead>SKU</TableHead>
											<TableHead className='text-right'>
												Qty
											</TableHead>
											<TableHead className='text-right'>
												Unit Price
											</TableHead>
											<TableHead className='text-right'>
												Tax
											</TableHead>
											<TableHead className='text-right'>
												Total
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{order.items.map((item, idx) => (
											<TableRow key={idx}>
												<TableCell className='font-medium'>
													{item.name}
												</TableCell>
												<TableCell>
													{item.sku}
												</TableCell>
												<TableCell className='text-right'>
													{item.quantity}
												</TableCell>
												<TableCell className='text-right'>
													රු
													{item.unitPrice.toFixed(2)}
												</TableCell>
												<TableCell className='text-right'>
													රු
													{(
														item.taxAmount || 0
													).toFixed(2)}
												</TableCell>
												<TableCell className='text-right font-medium'>
													රු
													{item.lineTotal.toFixed(2)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>

								<div className='mt-6 border-t pt-4 flex flex-col items-end space-y-2'>
									<div className='flex justify-between w-64 text-sm text-zinc-500'>
										<span>Subtotal:</span>
										<span>
											රු{order.subtotal.toFixed(2)}
										</span>
									</div>
									<div className='flex justify-between w-64 text-sm text-zinc-500'>
										<span>Tax:</span>
										<span>
											රු
											{(order.taxAmount || 0).toFixed(2)}
										</span>
									</div>
									{order.creditUsed > 0 && (
										<div className='flex justify-between w-64 text-sm text-amber-600'>
											<span>Credit Used:</span>
											<span>
												-රු{order.creditUsed.toFixed(2)}
											</span>
										</div>
									)}
									<div className='flex justify-between w-64 text-lg font-bold'>
										<span>Total:</span>
										<span>
											රු{order.totalAmount.toFixed(2)}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle>Customer Details</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<p className='text-sm text-zinc-500 font-medium'>
										Name
									</p>
									<p className='font-medium text-brand-dark'>
										{customerName}
									</p>
								</div>
								{customerEmail && (
									<div>
										<p className='text-sm text-zinc-500 font-medium'>
											Contact
										</p>
										<p className='text-sm'>
											{customerEmail}
										</p>
										{customerPhone && (
											<p className='text-sm'>
												{customerPhone}
											</p>
										)}
									</div>
								)}
								{customerId && (
									<Button
										variant='outline'
										className='w-full text-sm'
										onClick={() =>
											router.push(
												`/accounts/customers/${customerId}`,
											)
										}
									>
										View Full Profile
									</Button>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Payment Details</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-zinc-500 font-medium'>
										Method
									</p>
									<span className='px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700 uppercase'>
										{order.paymentMethod}
									</span>
								</div>
								{order.payments &&
									order.payments.length > 0 && (
										<div className='space-y-2'>
											{order.payments.map((p, i) => (
												<div
													key={i}
													className='flex items-center space-x-2 p-3 bg-zinc-50 rounded-lg border'
												>
													<CreditCard className='w-5 h-5 text-zinc-400' />
													<div className='flex-1'>
														<p className='text-sm font-medium capitalize'>
															{p.method}
														</p>
														{p.reference && (
															<p className='text-xs text-zinc-500'>
																Ref:{' '}
																{p.reference}
															</p>
														)}
													</div>
													<span className='font-medium text-sm'>
														රු{p.amount.toFixed(2)}
													</span>
												</div>
											))}
										</div>
									)}
								{order.notes && (
									<div>
										<p className='text-sm text-zinc-500 font-medium'>
											Notes
										</p>
										<p className='text-sm mt-1'>
											{order.notes}
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Update Status</CardTitle>
							</CardHeader>
							<CardContent className='space-y-2'>
								<div className='grid grid-cols-2 gap-2'>
									{STATUS_OPTIONS.filter(
										(s) => s !== order.status,
									).map((status) => (
										<Button
											key={status}
											variant='outline'
											size='sm'
											className='capitalize text-xs'
											disabled={isUpdatingStatus}
											onClick={() =>
												handleStatusChange(status)
											}
										>
											{status}
										</Button>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</RoleGuard>
	);
}
