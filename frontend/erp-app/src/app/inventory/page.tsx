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
import { Plus, Search, Filter } from 'lucide-react';

export default function InventoryPage() {
	const inventoryData = [
		{
			id: 'FAB-001',
			name: 'Premium Cotton Blend',
			category: 'Cotton',
			sku: 'C-1200',
			stock: 1540,
			status: 'In Stock',
		},
		{
			id: 'FAB-002',
			name: 'Silk Chiffon Rose',
			category: 'Silk',
			sku: 'S-3450',
			stock: 24,
			status: 'Low Stock',
		},
		{
			id: 'FAB-003',
			name: 'Heavyweight Linen',
			category: 'Linen',
			sku: 'L-900',
			stock: 450,
			status: 'In Stock',
		},
		{
			id: 'FAB-004',
			name: 'Polyester Georgette',
			category: 'Polyester',
			sku: 'P-100',
			stock: 2,
			status: 'Out of Stock',
		},
		{
			id: 'FAB-005',
			name: 'Organic Hemp Blend',
			category: 'Eco',
			sku: 'H-450',
			stock: 85,
			status: 'In Stock',
		},
	];

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>
						Inventory Management
					</h2>
					<p className='text-zinc-500'>
						View and manage fabric stock levels and SKUs.
					</p>
				</div>
				<button className='flex items-center space-x-2 bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium'>
					<Plus className='w-4 h-4' />
					<span>Add Product</span>
				</button>
			</div>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
					<CardTitle>All Products</CardTitle>
					<div className='flex items-center space-x-2'>
						<div className='relative'>
							<Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400' />
							<input
								type='text'
								placeholder='Search inventory...'
								className='w-64 pl-9 pr-4 py-1.5 border border-brand-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue'
							/>
						</div>
						<button className='flex items-center space-x-2 border border-brand-border px-3 py-1.5 rounded-md hover:bg-zinc-50 text-sm font-medium'>
							<Filter className='w-4 h-4' />
							<span>Filters</span>
						</button>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Product ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>SKU</TableHead>
								<TableHead className='text-right'>
									Stock (m)
								</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{inventoryData.map((item) => (
								<TableRow key={item.id}>
									<TableCell className='font-medium'>
										{item.id}
									</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.category}</TableCell>
									<TableCell>{item.sku}</TableCell>
									<TableCell className='text-right'>
										{item.stock}
									</TableCell>
									<TableCell>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium
                      ${item.status === 'In Stock' ? 'bg-green-100 text-green-700' : ''}
                      ${item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : ''}
                      ${item.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : ''}
                    `}
										>
											{item.status}
										</span>
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
