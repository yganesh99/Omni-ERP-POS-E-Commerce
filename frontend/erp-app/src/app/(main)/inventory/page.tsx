'use client';

import { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { AddProductModal } from '@/components/inventory/AddProductModal';

export default function InventoryPage() {
	const router = useRouter();

	const [products, setProducts] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const fetchProducts = async () => {
		try {
			setIsLoading(true);
			const res = await api.get('/products');
			setProducts(res.data.items || []);
		} catch (error) {
			console.error('Failed to fetch products:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

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
				<div className='flex items-center space-x-3'>
					<Button
						className='bg-black text-white hover:bg-zinc-800'
						onClick={() => setIsAddModalOpen(true)}
					>
						<Plus className='w-4 h-4 mr-2' />
						Add Product
					</Button>
				</div>
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
								<TableHead>SKU</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Category</TableHead>
								<TableHead className='text-right'>
									POS Price
								</TableHead>
								<TableHead className='text-right'>
									E-com Price
								</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className='text-center py-8'
									>
										Loading products...
									</TableCell>
								</TableRow>
							) : products.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className='text-center py-8'
									>
										No products found.
									</TableCell>
								</TableRow>
							) : (
								products.map((item) => (
									<TableRow
										key={item._id}
										className='cursor-pointer hover:bg-zinc-50'
										onClick={() =>
											router.push(
												`/inventory/products/${item._id}`,
											)
										}
									>
										<TableCell className='font-medium'>
											{item.sku}
										</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell>
											{item.category || '-'}
										</TableCell>
										<TableCell className='text-right'>
											රු{item.posPrice?.toFixed(2)}
										</TableCell>
										<TableCell className='text-right'>
											රු{item.ecommercePrice?.toFixed(2)}
										</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													item.isActive
														? 'bg-green-100 text-green-700'
														: 'bg-zinc-100 text-zinc-700'
												}`}
											>
												{item.isActive
													? 'Active'
													: 'Inactive'}
											</span>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<AddProductModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onSuccess={fetchProducts}
			/>
		</div>
	);
}
