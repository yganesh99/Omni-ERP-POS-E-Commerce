'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { AddProductModal } from '@/components/inventory/AddProductModal';

const PAGE_SIZE = 10;

export default function InventoryPage() {
	const router = useRouter();

	const [products, setProducts] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchInput, setSearchInput] = useState('');
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [limit] = useState(PAGE_SIZE);

	const fetchProducts = useCallback(
		async (search?: string, pageNum: number = 1) => {
			try {
				setIsLoading(true);
				const params: Record<string, string | number> = {
					page: pageNum,
					limit,
				};
				if (search?.trim()) params.search = search.trim();
				const res = await api.get('/products', { params });
				const data = res.data;
				setProducts(data.items || []);
				setTotal(data.total ?? 0);
				setPage(data.page ?? pageNum);
			} catch (error) {
				console.error('Failed to fetch products:', error);
			} finally {
				setIsLoading(false);
			}
		},
		[limit],
	);

	// Debounced search: apply searchQuery and refetch when it changes
	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchQuery(searchInput);
			setPage(1);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchInput]);

	// Fetch when search or page changes (page updates on pagination click)
	useEffect(() => {
		fetchProducts(searchQuery, page);
	}, [searchQuery, page, fetchProducts]);

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
								placeholder='Search by name or SKU...'
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
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
								<TableHead>Categories</TableHead>
								<TableHead className='text-right'>
									POS Price
								</TableHead>
								<TableHead className='text-right'>
									E-com Price
								</TableHead>
								<TableHead className='text-right'>
									Sale (E-com)
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
											{item.categories &&
											item.categories.length > 0
												? item.categories
														.map((c: any) => c.name)
														.join(', ')
												: '-'}
										</TableCell>
										<TableCell className='text-right'>
											රු{item.posPrice?.toFixed(2)}
										</TableCell>
										<TableCell className='text-right'>
											රු{item.ecommercePrice?.toFixed(2)}
										</TableCell>
										<TableCell className='text-right'>
											{item.isOnSale && item.salePrice != null
												? `රු${item.salePrice.toFixed(2)}`
												: '-'}
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
					{total > 0 && (
						<div className='flex items-center justify-between border-t border-brand-border pt-4 mt-4'>
							<p className='text-sm text-zinc-500'>
								Showing {(page - 1) * limit + 1}–
								{Math.min(page * limit, total)} of {total}{' '}
								products
							</p>
							<div className='flex items-center gap-2'>
								<Button
									variant='outline'
									size='sm'
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page <= 1 || isLoading}
								>
									<ChevronLeft className='w-4 h-4' />
									Previous
								</Button>
								<span className='text-sm text-zinc-600 px-2'>
									Page {page} of {Math.ceil(total / limit) || 1}
								</span>
								<Button
									variant='outline'
									size='sm'
									onClick={() =>
										setPage((p) =>
											p >= Math.ceil(total / limit) ? p : p + 1,
										)
									}
									disabled={
										page >= Math.ceil(total / limit) || isLoading
									}
								>
									Next
									<ChevronRight className='w-4 h-4' />
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<AddProductModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onSuccess={() => fetchProducts(searchQuery, page)}
			/>
		</div>
	);
}
