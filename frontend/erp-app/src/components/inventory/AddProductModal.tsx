'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';

interface AddProductModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function AddProductModal({
	isOpen,
	onClose,
	onSuccess,
}: AddProductModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		sku: '',
		name: '',
		description: '',
		categories: [] as string[],
		unit: 'pcs',
		posPrice: '',
		ecommercePrice: '',
		visibility: 'both',
		isOnSale: false,
		salePrice: '',
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const [categoriesList, setCategoriesList] = useState<any[]>([]);

	useEffect(() => {
		if (isOpen) {
			api.get('/categories')
				.then((res) =>
					setCategoriesList(
						res.data.items || res.data.data || res.data || [],
					),
				)
				.catch((err) =>
					console.error('Failed to fetch categories:', err),
				);
		}
	}, [isOpen]);

	const handleCategoryToggle = (id: string) => {
		setFormData((prev) => ({
			...prev,
			categories: prev.categories.includes(id)
				? prev.categories.filter((cId) => cId !== id)
				: [...prev.categories, id],
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			let filledFormData = Object.fromEntries(
				Object.entries(formData).filter(([_, value]) => value !== ''),
			);
			// Convert price strings to numbers before sending
			const payload = {
				...filledFormData,
				posPrice: Number(filledFormData.posPrice),
				ecommercePrice: Number(filledFormData.ecommercePrice),
				isOnSale: Boolean(filledFormData.isOnSale),
				salePrice:
					filledFormData.salePrice !== undefined &&
					filledFormData.salePrice !== ''
						? Number(filledFormData.salePrice)
						: undefined,
				categories: formData.categories,
			};

			await api.post('/products', payload);
			onSuccess();
			onClose();
			// Reset form
			setFormData({
				sku: '',
				name: '',
				description: '',
				categories: [],
				unit: 'pcs',
				posPrice: '',
				ecommercePrice: '',
				visibility: 'both',
				isOnSale: false,
				salePrice: '',
			});
		} catch (err: any) {
			console.error('Error adding product:', err);
			setError(
				err.response?.data?.message ||
					'Failed to add product. Please try again.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}
		>
			<DialogContent className='sm:max-w-[600px] h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Add New Product</DialogTitle>
					<DialogDescription>
						Enter the details of the new product to add it to your
						inventory.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className='space-y-6 pt-4'
				>
					{error && (
						<div className='p-3 text-sm text-red-500 bg-red-50 rounded-md'>
							{error}
						</div>
					)}
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label
								htmlFor='sku'
								className='text-sm font-medium'
							>
								SKU *
							</label>
							<Input
								id='sku'
								name='sku'
								required
								value={formData.sku}
								onChange={handleChange}
								placeholder='e.g. C-1200'
							/>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='name'
								className='text-sm font-medium'
							>
								Product Name *
							</label>
							<Input
								id='name'
								name='name'
								required
								value={formData.name}
								onChange={handleChange}
								placeholder='e.g. Premium Cotton Blend'
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<label
							htmlFor='description'
							className='text-sm font-medium'
						>
							Description
						</label>
						<Input
							id='description'
							name='description'
							value={formData.description}
							onChange={handleChange}
							placeholder='Brief description of the product'
						/>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm font-medium'>
								Categories
							</label>
							<div className='max-h-32 overflow-y-auto border rounded-md p-2 space-y-2'>
								{categoriesList.length === 0 ? (
									<p className='text-xs text-zinc-500'>
										No active categories found
									</p>
								) : (
									categoriesList.map((cat) => (
										<label
											key={cat._id}
											className='flex items-center space-x-2 text-sm'
										>
											<input
												type='checkbox'
												checked={formData.categories.includes(
													cat._id,
												)}
												onChange={() =>
													handleCategoryToggle(
														cat._id,
													)
												}
												className='rounded border-zinc-300'
											/>
											<span>{cat.name}</span>
										</label>
									))
								)}
							</div>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='unit'
								className='text-sm font-medium'
							>
								Unit
							</label>
							<select
								id='unit'
								name='unit'
								value={formData.unit}
								onChange={handleChange}
								className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
							>
								<option value='pcs'>Pieces (pcs) — whole numbers</option>
								<option value='bales'>Bales — whole numbers</option>
								<option value='cartons'>Cartons — whole numbers</option>
								<option value='m'>Meters (m) — decimals</option>
								<option value='kg'>Kilograms (kg) — decimals</option>
								<option value='l'>Litres (l) — decimals</option>
							</select>
							<p className='text-xs text-muted-foreground'>
								POS and inventory quantities follow this unit (whole vs decimal).
							</p>
						</div>
					</div>

					<div className='grid grid-cols-3 gap-4'>
						<div className='space-y-2'>
							<label
								htmlFor='posPrice'
								className='text-sm font-medium'
							>
								POS Price *
							</label>
							<Input
								id='posPrice'
								name='posPrice'
								type='number'
								min='0'
								step='0.01'
								required
								value={formData.posPrice}
								onChange={handleChange}
								placeholder='0.00'
							/>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='ecommercePrice'
								className='text-sm font-medium'
							>
								E-com Price *
							</label>
							<Input
								id='ecommercePrice'
								name='ecommercePrice'
								type='number'
								min='0'
								step='0.01'
								required
								value={formData.ecommercePrice}
								onChange={handleChange}
								placeholder='0.00'
							/>
						</div>
						<div className='space-y-2 col-span-3'>
							<div className='flex items-center justify-between gap-4'>
								<label className='text-sm font-medium'>
									E-com Sale
								</label>
								<div className='flex items-center gap-2'>
									<input
										id='isOnSale'
										name='isOnSale'
										type='checkbox'
										checked={formData.isOnSale}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												isOnSale: e.target.checked,
											}))
										}
										className='rounded border-zinc-300'
									/>
									<label
										htmlFor='isOnSale'
										className='text-sm'
									>
										Mark as on sale for ecommerce
									</label>
								</div>
							</div>
							{formData.isOnSale && (
								<div className='space-y-1'>
									<label
										htmlFor='salePrice'
										className='text-xs font-medium text-zinc-600'
									>
										Sale Price (E-com)
									</label>
									<Input
										id='salePrice'
										name='salePrice'
										type='number'
										min='0'
										step='0.01'
										value={formData.salePrice}
										onChange={handleChange}
										placeholder='0.00'
									/>
								</div>
							)}
						</div>
					</div>

					<div className='space-y-2'>
						<label
							htmlFor='visibility'
							className='text-sm font-medium'
						>
							Visibility
						</label>
						<select
							id='visibility'
							name='visibility'
							value={formData.visibility}
							onChange={handleChange}
							className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
						>
							<option value='both'>Both POS & E-commerce</option>
							<option value='pos_only'>POS Only</option>
							<option value='ecommerce_only'>
								E-commerce Only
							</option>
						</select>
					</div>

					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={onClose}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type='submit'
							className='bg-black text-white hover:bg-zinc-800'
							disabled={isLoading}
						>
							{isLoading ? 'Saving...' : 'Save Product'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
