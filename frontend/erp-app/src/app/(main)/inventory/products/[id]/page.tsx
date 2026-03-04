'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	ArrowLeft,
	Save,
	PackagePlus,
	ArrowRightLeft,
	History,
	Upload,
	ImageIcon,
} from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import api from '@/lib/api';

interface Product {
	_id: string;
	sku: string;
	name: string;
	description?: string;
	category?: string;
	unit?: string;
	posPrice: number;
	ecommercePrice: number;
	costPrice: number;
	taxRate: number;
	visibility: string;
	isActive: boolean;
	image?: string;
}

export default function SingleProductPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const { id } = params;
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		sku: '',
		description: '',
		category: '',
		unit: 'pcs',
		posPrice: 0,
		ecommercePrice: 0,
		costPrice: 0,
		taxRate: 0,
		visibility: 'both',
	});

	// Stock adjustment dialog
	const [isAdjustOpen, setIsAdjustOpen] = useState(false);
	const [adjustStoreId, setAdjustStoreId] = useState('');
	const [adjustQty, setAdjustQty] = useState('');
	const [stores, setStores] = useState<any[]>([]);

	const fetchProduct = async () => {
		try {
			setIsLoading(true);
			const response = await api.get(`/products/${id}`);
			const data = response.data.data || response.data;
			setProduct(data);
			setFormData({
				name: data.name || '',
				sku: data.sku || '',
				description: data.description || '',
				category: data.category || '',
				unit: data.unit || 'pcs',
				posPrice: data.posPrice || 0,
				ecommercePrice: data.ecommercePrice || 0,
				costPrice: data.costPrice || 0,
				taxRate: data.taxRate || 0,
				visibility: data.visibility || 'both',
			});
		} catch (error) {
			console.error('Failed to fetch product:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchStores = async () => {
		try {
			const response = await api.get('/stores');
			const data = response.data;
			const list = data.items || data.data || data || [];
			setStores(Array.isArray(list) ? list : []);
		} catch (error) {
			console.error('Failed to fetch stores:', error);
		}
	};

	useEffect(() => {
		if (id) {
			fetchProduct();
			fetchStores();
		}
	}, [id]);

	const handleSaveChanges = async () => {
		try {
			setIsSaving(true);
			await api.put(`/products/${id}`, {
				name: formData.name,
				sku: formData.sku,
				description: formData.description,
				category: formData.category,
				unit: formData.unit,
				posPrice: formData.posPrice,
				ecommercePrice: formData.ecommercePrice,
				costPrice: formData.costPrice,
				taxRate: formData.taxRate,
				visibility: formData.visibility,
			});
			await fetchProduct();
			alert('Product updated successfully!');
		} catch (error) {
			console.error('Failed to update product:', error);
			alert('Failed to update product.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleToggleActive = async () => {
		try {
			await api.patch(`/products/${id}/toggle`);
			await fetchProduct();
		} catch (error) {
			console.error('Failed to toggle product:', error);
		}
	};

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const formDataObj = new FormData();
			formDataObj.append('image', file);
			await api.post(`/products/${id}/image`, formDataObj, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			await fetchProduct();
			alert('Product image uploaded successfully!');
		} catch (error) {
			console.error('Failed to upload image:', error);
			alert('Failed to upload image.');
		}
	};

	const handleAdjustStock = async () => {
		const qty = parseInt(adjustQty);
		if (!qty || !adjustStoreId) {
			alert('Please select a store and enter a quantity.');
			return;
		}
		try {
			await api.post('/inventory/adjust', {
				productId: id,
				storeId: adjustStoreId,
				quantityChange: qty,
			});
			setIsAdjustOpen(false);
			setAdjustQty('');
			setAdjustStoreId('');
			alert('Stock adjusted successfully!');
		} catch (error) {
			console.error('Failed to adjust stock:', error);
			alert('Failed to adjust stock.');
		}
	};

	if (isLoading) {
		return (
			<div className='p-8 text-center text-zinc-500'>
				Loading product details...
			</div>
		);
	}

	if (!product) {
		return (
			<div className='p-8 text-center text-red-500'>
				Product not found.
			</div>
		);
	}

	return (
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
							{product.name}
						</h2>
						<p className='text-zinc-500'>
							SKU: {product.sku} |{' '}
							<span
								className={`font-medium ${product.isActive ? 'text-green-600' : 'text-zinc-500'}`}
							>
								{product.isActive ? 'Active' : 'Inactive'}
							</span>
						</p>
					</div>
				</div>
				<Button
					variant='outline'
					size='sm'
					onClick={handleToggleActive}
				>
					{product.isActive
						? 'Deactivate Product'
						: 'Activate Product'}
				</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='md:col-span-2 space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Product Details</CardTitle>
							<p className='text-sm text-zinc-500'>
								Update product information and pricing.
							</p>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										Name
									</label>
									<Input
										value={formData.name}
										onChange={(e) =>
											setFormData({
												...formData,
												name: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										SKU
									</label>
									<Input
										value={formData.sku}
										onChange={(e) =>
											setFormData({
												...formData,
												sku: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										Category
									</label>
									<Input
										value={formData.category}
										onChange={(e) =>
											setFormData({
												...formData,
												category: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										Unit
									</label>
									<Input
										value={formData.unit}
										onChange={(e) =>
											setFormData({
												...formData,
												unit: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										POS Price (රු)
									</label>
									<Input
										type='number'
										step='0.01'
										min='0'
										value={formData.posPrice}
										onChange={(e) =>
											setFormData({
												...formData,
												posPrice:
													parseFloat(
														e.target.value,
													) || 0,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										E-commerce Price (රු)
									</label>
									<Input
										type='number'
										step='0.01'
										min='0'
										value={formData.ecommercePrice}
										onChange={(e) =>
											setFormData({
												...formData,
												ecommercePrice:
													parseFloat(
														e.target.value,
													) || 0,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										Cost Price (රු)
									</label>
									<Input
										type='number'
										step='0.01'
										min='0'
										value={formData.costPrice}
										onChange={(e) =>
											setFormData({
												...formData,
												costPrice:
													parseFloat(
														e.target.value,
													) || 0,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										Tax Rate (%)
									</label>
									<Input
										type='number'
										step='0.01'
										min='0'
										value={formData.taxRate}
										onChange={(e) =>
											setFormData({
												...formData,
												taxRate:
													parseFloat(
														e.target.value,
													) || 0,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										Visibility
									</label>
									<select
										className='w-full h-10 px-3 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white'
										value={formData.visibility}
										onChange={(e) =>
											setFormData({
												...formData,
												visibility: e.target.value,
											})
										}
									>
										<option value='both'>
											POS & E-commerce
										</option>
										<option value='pos_only'>
											POS Only
										</option>
										<option value='ecommerce_only'>
											E-commerce Only
										</option>
									</select>
								</div>
								<div className='col-span-2 space-y-2'>
									<label className='text-sm font-medium'>
										Description
									</label>
									<textarea
										className='w-full min-h-[80px] p-3 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue'
										value={formData.description}
										onChange={(e) =>
											setFormData({
												...formData,
												description: e.target.value,
											})
										}
									/>
								</div>
							</div>
							<div className='pt-4 flex justify-end'>
								<Button
									className='flex items-center space-x-2'
									onClick={handleSaveChanges}
									disabled={isSaving}
								>
									<Save className='w-4 h-4' />
									<span>
										{isSaving
											? 'Saving...'
											: 'Save Changes'}
									</span>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className='space-y-6'>
					{/* Product Image */}
					<Card>
						<CardHeader>
							<CardTitle>Product Image</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							{product.image ? (
								<div className='w-full aspect-square rounded-lg border overflow-hidden bg-zinc-50'>
									<img
										src={product.image}
										alt={product.name}
										className='w-full h-full object-cover'
									/>
								</div>
							) : (
								<div className='w-full aspect-square rounded-lg border border-dashed border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center text-zinc-400'>
									<ImageIcon className='w-12 h-12 mb-2' />
									<span className='text-sm'>
										No image uploaded
									</span>
								</div>
							)}
							<input
								ref={fileInputRef}
								type='file'
								accept='image/*'
								className='hidden'
								onChange={handleImageUpload}
							/>
							<Button
								variant='outline'
								className='w-full'
								onClick={() => fileInputRef.current?.click()}
							>
								<Upload className='w-4 h-4 mr-2' />
								{product.image
									? 'Change Image'
									: 'Upload Image'}
							</Button>
						</CardContent>
					</Card>

					{/* Actions */}
					<Card>
						<CardHeader>
							<CardTitle>Stock Actions</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<Button
								className='w-full flex items-center justify-center space-x-2'
								variant='outline'
								onClick={() => setIsAdjustOpen(true)}
							>
								<ArrowRightLeft className='w-4 h-4' />
								<span>Adjust Stock</span>
							</Button>
							<Button
								className='w-full flex items-center justify-center space-x-2'
								variant='outline'
								onClick={() =>
									router.push(
										`/inventory/products/${id}/movements`,
									)
								}
							>
								<PackagePlus className='w-4 h-4' />
								<span>View Movements</span>
							</Button>
							<Button
								className='w-full flex items-center justify-center space-x-2'
								variant='outline'
								onClick={() =>
									router.push(
										`/inventory/products/${id}/history`,
									)
								}
							>
								<History className='w-4 h-4' />
								<span>View History</span>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Adjust Stock Dialog */}
			<Dialog
				open={isAdjustOpen}
				onOpenChange={setIsAdjustOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Adjust Stock — {product.name}</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<label className='text-sm font-medium'>
								Store *
							</label>
							<select
								className='w-full h-10 px-3 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white'
								value={adjustStoreId}
								onChange={(e) =>
									setAdjustStoreId(e.target.value)
								}
							>
								<option value=''>Select a store</option>
								{stores.map((s: any) => (
									<option
										key={s._id}
										value={s._id}
									>
										{s.name}
									</option>
								))}
							</select>
						</div>
						<div className='space-y-2'>
							<label className='text-sm font-medium'>
								Quantity Change *
							</label>
							<Input
								type='number'
								value={adjustQty}
								onChange={(e) => setAdjustQty(e.target.value)}
								placeholder='Positive to add, negative to remove'
							/>
							<p className='text-xs text-zinc-500'>
								Use positive values to add stock, negative to
								remove.
							</p>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setIsAdjustOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleAdjustStock}>
							Apply Adjustment
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
