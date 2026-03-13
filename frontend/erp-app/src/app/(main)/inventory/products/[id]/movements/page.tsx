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
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Search, Filter, ArrowDownUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StockMovementsPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const { id } = params;
	const movementsData = [
		{
			id: 'MOV-001',
			date: '2026-03-01',
			product: 'Premium Cotton Blend',
			sku: 'C-1200',
			type: 'IN',
			quantity: 500,
			reference: 'PO-1023',
			user: 'Admin',
		},
		{
			id: 'MOV-002',
			date: '2026-02-28',
			product: 'Silk Chiffon Rose',
			sku: 'S-3450',
			type: 'OUT',
			quantity: 120,
			reference: 'ORD-5091',
			user: 'Cashier 1',
		},
		{
			id: 'MOV-003',
			date: '2026-02-28',
			product: 'Heavyweight Linen',
			sku: 'L-900',
			type: 'ADJUSTMENT',
			quantity: -5,
			reference: 'INV-CHK-1',
			user: 'Inventory Mgr',
		},
		{
			id: 'MOV-004',
			date: '2026-02-25',
			product: 'Premium Cotton Blend',
			sku: 'C-1200',
			type: 'OUT',
			quantity: 45,
			reference: 'ORD-5088',
			user: 'Admin',
		},
		{
			id: 'MOV-005',
			date: '2026-02-24',
			product: 'Organic Hemp Blend',
			sku: 'H-450',
			type: 'IN',
			quantity: 100,
			reference: 'PO-1020',
			user: 'Admin',
		},
	];

	return (
		<div className='space-y-6'>
			<div className='flex items-center space-x-4'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.back()}
				>
					<ArrowLeft className='w-5 h-5' />
				</Button>
				<div className='flex-1 flex items-center justify-between'>
					<div>
						<h2 className='text-3xl font-bold tracking-tight'>
							Stock Movements
						</h2>
						<p className='text-zinc-500'>
							Track all inventory in, out, and adjustments for
							Product {id}.
						</p>
					</div>
					<Button
						className='flex items-center space-x-2'
						variant='outline'
					>
						<ArrowDownUp className='w-4 h-4' />
						<span>Export Report</span>
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
					<CardTitle>Recent Activity</CardTitle>
					<div className='flex items-center space-x-2'>
						<div className='relative'>
							<Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400' />
							<Input
								type='text'
								placeholder='Search movements...'
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
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Type</TableHead>
								<TableHead className='text-right'>
									Quantity
								</TableHead>
								<TableHead>Reference</TableHead>
								<TableHead>User</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{movementsData.map((mov) => (
								<TableRow key={mov.id}>
									<TableCell className='font-medium'>
										{mov.id}
									</TableCell>
									<TableCell>{mov.date}</TableCell>
									<TableCell>
										<span
											className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase
											${mov.type === 'IN' ? 'bg-green-100 text-green-700' : ''}
											${mov.type === 'OUT' ? 'bg-blue-100 text-blue-700' : ''}
											${mov.type === 'ADJUSTMENT' ? 'bg-amber-100 text-amber-700' : ''}
										`}
										>
											{mov.type}
										</span>
									</TableCell>
									<TableCell
										className={`text-right font-medium
										${mov.type === 'IN' ? 'text-green-600' : ''}
										${mov.type === 'OUT' || Number(mov.quantity) < 0 ? 'text-red-600' : ''}
									`}
									>
										{mov.type === 'IN'
											? '+'
											: mov.type === 'OUT'
												? '-'
												: ''}
										{mov.quantity}
									</TableCell>
									<TableCell>{mov.reference}</TableCell>
									<TableCell>{mov.user}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
