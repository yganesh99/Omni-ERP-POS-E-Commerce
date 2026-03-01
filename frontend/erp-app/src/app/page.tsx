'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Package,
	ShoppingCart,
	Users,
	DollarSign,
	TrendingUp,
	ArrowUpRight,
	ArrowDownRight,
} from 'lucide-react';

export default function Dashboard() {
	const stats = [
		{
			title: 'Total Revenue',
			value: '$45,231.89',
			change: '+20.1% from last month',
			icon: DollarSign,
			positive: true,
		},
		{
			title: 'Active Orders',
			value: '+2350',
			change: '+180.1% from last month',
			icon: ShoppingCart,
			positive: true,
		},
		{
			title: 'New Customers',
			value: '+12,234',
			change: '+19% from last month',
			icon: Users,
			positive: true,
		},
		{
			title: 'Low Stock Items',
			value: '48',
			change: '-12% from last month',
			icon: Package,
			positive: false,
		},
	];

	const recentOrders = [
		{
			id: 'ORD-7352',
			customer: 'Olivia Martin',
			status: 'Processing',
			amount: '$250.00',
		},
		{
			id: 'ORD-7351',
			customer: 'Jackson Lee',
			status: 'Shipped',
			amount: '$125.00',
		},
		{
			id: 'ORD-7350',
			customer: 'Isabella Nguyen',
			status: 'Delivered',
			amount: '$840.00',
		},
		{
			id: 'ORD-7349',
			customer: 'William Kim',
			status: 'Processing',
			amount: '$99.00',
		},
		{
			id: 'ORD-7348',
			customer: 'Sofia Davis',
			status: 'Cancelled',
			amount: '$39.00',
		},
	];

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-2'>
				<h2 className='text-3xl font-bold tracking-tight'>
					Dashboard Overview
				</h2>
				<p className='text-zinc-500'>
					Welcome back, here&apos;s what&apos;s happening today.
				</p>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{stats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<Card key={index}>
							<CardHeader className='flex flex-row items-center justify-between pb-2'>
								<CardTitle className='text-sm font-medium text-zinc-500'>
									{stat.title}
								</CardTitle>
								<Icon className='h-4 w-4 text-zinc-400' />
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold'>
									{stat.value}
								</div>
								<p
									className={`text-xs mt-1 flex items-center ${stat.positive ? 'text-green-600' : 'text-red-600'}`}
								>
									{stat.positive ? (
										<ArrowUpRight className='w-3 h-3 mr-1' />
									) : (
										<ArrowDownRight className='w-3 h-3 mr-1' />
									)}
									{stat.change}
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Chart Placeholder */}
				<Card className='col-span-1 lg:col-span-2'>
					<CardHeader>
						<CardTitle>Sales Over Time</CardTitle>
					</CardHeader>
					<CardContent className='h-[300px] flex items-center justify-center bg-zinc-50/50 rounded-md border border-dashed border-zinc-200 m-6 mt-0'>
						<div className='text-center text-zinc-400'>
							<TrendingUp className='w-8 h-8 mx-auto mb-2 opacity-50' />
							<p>Recharts AreaChart Placeholder</p>
						</div>
					</CardContent>
				</Card>

				{/* Recent Orders */}
				<Card className='col-span-1'>
					<CardHeader>
						<CardTitle>Recent Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-6'>
							{recentOrders.map((order, i) => (
								<div
									key={i}
									className='flex items-center justify-between'
								>
									<div>
										<p className='text-sm font-medium leading-none'>
											{order.customer}
										</p>
										<p className='text-sm text-zinc-500 mt-1'>
											{order.id} · {order.status}
										</p>
									</div>
									<div className='font-medium text-sm'>
										{order.amount}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
