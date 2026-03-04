'use client';

import { useState } from 'react';
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
		category: '',
		unit: 'pcs',
		posPrice: '',
		ecommercePrice: '',
		costPrice: '',
		visibility: 'both',
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
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
				costPrice: Number(filledFormData.costPrice),
			};

			await api.post('/products', payload);
			onSuccess();
			onClose();
			// Reset form
			setFormData({
				sku: '',
				name: '',
				description: '',
				category: '',
				unit: 'pcs',
				posPrice: '',
				ecommercePrice: '',
				costPrice: '',
				visibility: 'both',
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
							<label
								htmlFor='category'
								className='text-sm font-medium'
							>
								Category
							</label>
							<Input
								id='category'
								name='category'
								value={formData.category}
								onChange={handleChange}
								placeholder='e.g. Cotton'
							/>
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
								<option value='pcs'>Pieces (pcs)</option>
								<option value='m'>Meters (m)</option>
								<option value='kg'>Kilograms (kg)</option>
							</select>
						</div>
					</div>

					<div className='grid grid-cols-3 gap-4'>
						<div className='space-y-2'>
							<label
								htmlFor='costPrice'
								className='text-sm font-medium'
							>
								Cost Price *
							</label>
							<Input
								id='costPrice'
								name='costPrice'
								type='number'
								min='0'
								step='0.01'
								required
								value={formData.costPrice}
								onChange={handleChange}
								placeholder='0.00'
							/>
						</div>
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
