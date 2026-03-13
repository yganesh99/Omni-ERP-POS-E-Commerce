'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	TrendingUp,
	Package,
	AlertTriangle,
	DollarSign,
	Users,
} from 'lucide-react';
import api from '@/lib/api';

interface SalesItem {
	_id: string;
	totalSales: number;
	totalOrders: number;
	storeName?: string;
}

interface LowStockItem {
	_id: string;
	name: string;
	sku: string;
	totalStock: number;
}

interface CreditItem {
	_id: string;
	name: string;
	currentBalance: number;
	creditLimit: number;
}

interface SupplierPayable {
	_id: string;
	name: string;
	currentBalance: number;
}

interface InventoryValuationItem {
	value?: number;
}

interface RecentOrder {
	_id: string;
	orderNumber: string;
	totalAmount: number;
	status: string;
	channel: string;
	customerId?: { name: string } | null;
	createdAt: string;
}

export default function Dashboard() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	// Dashboard data
	const [salesByStore, setSalesByStore] = useState<SalesItem[]>([]);
	const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
	const [creditExposure, setCreditExposure] = useState<CreditItem[]>([]);
	const [supplierPayables, setSupplierPayables] = useState<SupplierPayable[]>(
		[],
	);
	const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
	const [inventoryValuation, setInventoryValuation] = useState<
		InventoryValuationItem[] | { totalValue?: number } | null
	>(null);

	const fetchDashboard = async () => {
		try {
			setIsLoading(true);
			const [
				salesRes,
				lowStockRes,
				creditRes,
				payablesRes,
				ordersRes,
				valuationRes,
			] = await Promise.allSettled([
				api.get('/reports/sales/by-store'),
				api.get('/reports/inventory/low-stock?threshold=10'),
				api.get('/reports/finance/credit-exposure'),
				api.get('/reports/finance/supplier-payables'),
				api.get('/orders'),
				api.get('/reports/inventory/valuation'),
			]);

			if (salesRes.status === 'fulfilled') {
				const d = salesRes.value.data;
				setSalesByStore(Array.isArray(d) ? d : d.data || []);
			}
			if (lowStockRes.status === 'fulfilled') {
				const d = lowStockRes.value.data;
				setLowStock(Array.isArray(d) ? d : d.data || []);
			}
			if (creditRes.status === 'fulfilled') {
				const d = creditRes.value.data;
				setCreditExposure(Array.isArray(d) ? d : d.data || []);
			}
			if (payablesRes.status === 'fulfilled') {
				const d = payablesRes.value.data;
				setSupplierPayables(Array.isArray(d) ? d : d.data || []);
			}
			if (ordersRes.status === 'fulfilled') {
				const d = ordersRes.value.data;
				const list = d.items || d.data || d || [];
				setRecentOrders(Array.isArray(list) ? list.slice(0, 5) : []);
			}
			if (valuationRes.status === 'fulfilled') {
				setInventoryValuation(valuationRes.value.data);
			}
		} catch (error) {
			console.error('Failed to fetch dashboard data:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboard();
	}, []);

	const totalRevenue = salesByStore.reduce(
		(sum, s) => sum + (s.totalSales || 0),
		0,
	);
	const totalOrders = salesByStore.reduce(
		(sum, s) => sum + (s.totalOrders || 0),
		0,
	);
	const totalCreditExposure = creditExposure.reduce(
		(sum, c) => sum + (c.currentBalance || 0),
		0,
	);
	const totalPayables = supplierPayables.reduce(
		(sum, s) => sum + (s.currentBalance || 0),
		0,
	);
	const invValue =
		(inventoryValuation &&
			'totalValue' in inventoryValuation &&
			typeof inventoryValuation.totalValue === 'number' &&
			inventoryValuation.totalValue) ||
		(Array.isArray(inventoryValuation)
			? inventoryValuation.reduce(
					(sum: number, v: InventoryValuationItem) =>
						sum + (v.value || 0),
					0,
				)
			: 0);

	const getStatusColor = (status: string) => {
		const m: Record<string, string> = {
			pending: 'bg-amber-100 text-amber-700',
			confirmed: 'bg-blue-100 text-blue-700',
			processing: 'bg-blue-100 text-blue-700',
			delivered: 'bg-green-100 text-green-700',
			cancelled: 'bg-red-100 text-red-700',
		};
		return m[status] || 'bg-zinc-100 text-zinc-700';
	};

	return (
		<div className='space-y-6 max-w-7xl mx-auto'>
			<div className='flex flex-col gap-1 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight text-black'>
						Dashboard
					</h1>
					<p className='text-zinc-500 mt-1'>
						Welcome back! Here&apos;s what&apos;s happening with
						your business today.
					</p>
				</div>
			</div>

			{isLoading ? (
				<p className='text-center text-zinc-500 py-12'>
					Loading dashboard...
				</p>
			) : (
				<>
					{/* Stats Grid */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						<div className='bg-white rounded-xl p-6 border border-zinc-200 shadow-sm'>
							<div className='flex items-center justify-between'>
								<h3 className='text-[15px] font-medium text-zinc-500'>
									Total Revenue
								</h3>
								<DollarSign className='w-5 h-5 text-green-600' />
							</div>
							<div className='mt-2 text-2xl font-bold text-black'>
								රු
								{totalRevenue.toLocaleString('en-US', {
									minimumFractionDigits: 2,
								})}
							</div>
							<p className='mt-1 text-xs text-zinc-500'>
								{totalOrders} orders across{' '}
								{salesByStore.length} store(s)
							</p>
						</div>

						<div className='bg-white rounded-xl p-6 border border-zinc-200 shadow-sm'>
							<div className='flex items-center justify-between'>
								<h3 className='text-[15px] font-medium text-zinc-500'>
									Inventory Value
								</h3>
								<Package className='w-5 h-5 text-blue-600' />
							</div>
							<div className='mt-2 text-2xl font-bold text-black'>
								රු
								{invValue.toLocaleString('en-US', {
									minimumFractionDigits: 2,
								})}
							</div>
							<p className='mt-1 text-xs text-zinc-500'>
								Total stock valuation
							</p>
						</div>

						<div className='bg-white rounded-xl p-6 border border-zinc-200 shadow-sm'>
							<div className='flex items-center justify-between'>
								<h3 className='text-[15px] font-medium text-zinc-500'>
									Credit Receivables
								</h3>
								<Users className='w-5 h-5 text-amber-600' />
							</div>
							<div className='mt-2 text-2xl font-bold text-amber-600'>
								රු
								{totalCreditExposure.toLocaleString('en-US', {
									minimumFractionDigits: 2,
								})}
							</div>
							<p className='mt-1 text-xs text-zinc-500'>
								{creditExposure.length} customer(s) with
								outstanding balance
							</p>
						</div>

						<div className='bg-white rounded-xl p-6 border border-zinc-200 shadow-sm'>
							<div className='flex items-center justify-between'>
								<h3 className='text-[15px] font-medium text-zinc-500'>
									Supplier Payables
								</h3>
								<TrendingUp className='w-5 h-5 text-red-600' />
							</div>
							<div className='mt-2 text-2xl font-bold text-red-600'>
								රු
								{totalPayables.toLocaleString('en-US', {
									minimumFractionDigits: 2,
								})}
							</div>
							<p className='mt-1 text-xs text-zinc-500'>
								{supplierPayables.length} supplier(s) owed
							</p>
						</div>
					</div>

					<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
						{/* Recent Orders */}
						<Card className='col-span-1 lg:col-span-2'>
							<CardHeader className='flex flex-row items-center justify-between space-y-0'>
								<CardTitle>Recent Orders</CardTitle>
								<button
									onClick={() => router.push('/sales')}
									className='text-sm font-medium text-blue-600 hover:underline'
								>
									View All
								</button>
							</CardHeader>
							<CardContent>
								{recentOrders.length === 0 ? (
									<p className='text-center text-zinc-400 py-8'>
										No orders yet.
									</p>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Order</TableHead>
												<TableHead>Customer</TableHead>
												<TableHead>Channel</TableHead>
												<TableHead className='text-right'>
													Amount
												</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{recentOrders.map((order) => (
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
														{typeof order.customerId ===
															'object' &&
														order.customerId?.name
															? order.customerId
																	.name
															: 'Walk-in'}
													</TableCell>
													<TableCell>
														<span className='text-xs uppercase font-medium bg-zinc-100 px-2 py-0.5 rounded'>
															{order.channel}
														</span>
													</TableCell>
													<TableCell className='text-right font-medium'>
														රු
														{(
															order.totalAmount ||
															0
														).toFixed(2)}
													</TableCell>
													<TableCell>
														<span
															className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
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

						{/* Low Stock Alert */}
						<Card className='col-span-1'>
							<CardHeader className='flex flex-row items-center justify-between space-y-0'>
								<CardTitle className='flex items-center space-x-2'>
									<AlertTriangle className='w-4 h-4 text-amber-500' />
									<span>Low Stock Alert</span>
								</CardTitle>
								<span className='text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium'>
									{lowStock.length}
								</span>
							</CardHeader>
							<CardContent>
								{lowStock.length === 0 ? (
									<p className='text-center text-zinc-400 py-8 text-sm'>
										All stock levels are healthy.
									</p>
								) : (
									<div className='space-y-3'>
										{lowStock.slice(0, 8).map((item) => (
											<div
												key={item._id}
												className='flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors'
												onClick={() =>
													router.push(
														`/inventory/products/${item._id}`,
													)
												}
											>
												<div>
													<p className='text-sm font-medium'>
														{item.name}
													</p>
													<p className='text-xs text-zinc-500'>
														SKU: {item.sku}
													</p>
												</div>
												<span className='text-sm font-bold text-amber-700'>
													{item.totalStock} left
												</span>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Sales by Store + Credit Exposure */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						<Card>
							<CardHeader>
								<CardTitle>Sales by Store</CardTitle>
							</CardHeader>
							<CardContent>
								{salesByStore.length === 0 ? (
									<p className='text-center text-zinc-400 py-8 text-sm'>
										No sales data available.
									</p>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Store</TableHead>
												<TableHead className='text-right'>
													Orders
												</TableHead>
												<TableHead className='text-right'>
													Revenue
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{salesByStore.map((store) => (
												<TableRow key={store._id}>
													<TableCell className='font-medium'>
														{store.storeName ||
															store._id}
													</TableCell>
													<TableCell className='text-right'>
														{store.totalOrders}
													</TableCell>
													<TableCell className='text-right font-medium'>
														රු
														{(
															store.totalSales ||
															0
														).toLocaleString(
															'en-US',
															{
																minimumFractionDigits: 2,
															},
														)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader className='flex flex-row items-center justify-between space-y-0'>
								<CardTitle>Top Credit Exposure</CardTitle>
								<button
									onClick={() =>
										router.push('/accounts/customers')
									}
									className='text-sm font-medium text-blue-600 hover:underline'
								>
									View All
								</button>
							</CardHeader>
							<CardContent>
								{creditExposure.length === 0 ? (
									<p className='text-center text-zinc-400 py-8 text-sm'>
										No credit exposure.
									</p>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Customer</TableHead>
												<TableHead className='text-right'>
													Balance
												</TableHead>
												<TableHead className='text-right'>
													Limit
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{creditExposure
												.slice(0, 5)
												.map((cust) => (
													<TableRow key={cust._id}>
														<TableCell className='font-medium'>
															{cust.name}
														</TableCell>
														<TableCell className='text-right text-red-600 font-medium'>
															රු
															{(
																cust.currentBalance ||
																0
															).toFixed(2)}
														</TableCell>
														<TableCell className='text-right text-zinc-500'>
															රු
															{(
																cust.creditLimit ||
																0
															).toFixed(2)}
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>
					</div>
				</>
			)}
		</div>
	);
}
