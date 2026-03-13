'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit2, CheckCircle2, XCircle } from 'lucide-react';
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
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import api from '@/lib/api';

interface Category {
	_id: string;
	name: string;
	description?: string;
	isActive: boolean;
	createdAt: string;
}

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

	// Modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({
		name: '',
		description: '',
		isActive: true,
	});

	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCategories = async () => {
		try {
			setIsLoading(true);
			const response = await api.get('/categories');
			const data = response.data.data || response.data;
			setCategories(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error('Failed to fetch categories:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const filteredCategories = categories.filter((c) =>
		c.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleOpenModal = (category?: Category) => {
		setError(null);
		if (category) {
			setIsEditing(true);
			setCurrentCategory(category);
		} else {
			setIsEditing(false);
			setCurrentCategory({
				name: '',
				description: '',
				isActive: true,
			});
		}
		setIsModalOpen(true);
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!currentCategory.name) return;

		setIsSaving(true);
		setError(null);

		try {
			if (isEditing && currentCategory._id) {
				await api.put(`/categories/${currentCategory._id}`, {
					name: currentCategory.name,
					description: currentCategory.description,
				});
			} else {
				await api.post('/categories', {
					name: currentCategory.name,
					description: currentCategory.description,
				});
			}
			setIsModalOpen(false);
			fetchCategories();
		} catch (err: any) {
			console.error('Failed to save category:', err);
			setError(err.response?.data?.message || 'Failed to save category.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleToggleActive = async (id: string) => {
		try {
			await api.patch(`/categories/${id}/toggle`);
			fetchCategories();
		} catch (err) {
			console.error('Failed to toggle category:', err);
		}
	};

	return (
		<div className='p-6 space-y-6 max-w-6xl mx-auto'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Categories
					</h1>
					<p className='text-zinc-500'>
						Manage product categories for your inventory
					</p>
				</div>
				<Button
					className='bg-black text-white hover:bg-zinc-800'
					onClick={() => handleOpenModal()}
				>
					<Plus className='w-4 h-4 mr-2' />
					Add Category
				</Button>
			</div>

			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<CardTitle>All Categories</CardTitle>
						<div className='relative w-64'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500' />
							<Input
								placeholder='Search categories...'
								className='pl-9'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className='py-8 text-center text-zinc-500'>
							Loading categories...
						</div>
					) : filteredCategories.length === 0 ? (
						<div className='py-8 text-center text-zinc-500'>
							No categories found. Create one to get started!
						</div>
					) : (
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Description</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className='text-right'>
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredCategories.map((category) => (
										<TableRow key={category._id}>
											<TableCell className='font-medium'>
												{category.name}
											</TableCell>
											<TableCell className='text-zinc-500 max-w-md truncate'>
												{category.description || '-'}
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
														category.isActive
															? 'bg-emerald-100 text-emerald-700'
															: 'bg-zinc-100 text-zinc-700'
													}`}
												>
													{category.isActive
														? 'Active'
														: 'Inactive'}
												</span>
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex justify-end space-x-2'>
													<Button
														variant='ghost'
														size='sm'
														onClick={() =>
															handleOpenModal(
																category,
															)
														}
													>
														<Edit2 className='w-4 h-4' />
													</Button>
													<Button
														variant='ghost'
														size='sm'
														onClick={() =>
															handleToggleActive(
																category._id,
															)
														}
														title={
															category.isActive
																? 'Deactivate'
																: 'Activate'
														}
													>
														{category.isActive ? (
															<XCircle className='w-4 h-4 text-red-500' />
														) : (
															<CheckCircle2 className='w-4 h-4 text-emerald-500' />
														)}
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<Dialog
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{isEditing ? 'Edit Category' : 'Add Category'}
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? 'Update the details for this category.'
								: 'Enter the details for the new product category.'}
						</DialogDescription>
					</DialogHeader>

					<form
						onSubmit={handleSave}
						className='space-y-4 pt-4'
					>
						{error && (
							<div className='p-3 text-sm text-red-500 bg-red-50 rounded-md'>
								{error}
							</div>
						)}

						<div className='space-y-2'>
							<label
								htmlFor='name'
								className='text-sm font-medium'
							>
								Category Name *
							</label>
							<Input
								id='name'
								required
								value={currentCategory.name}
								onChange={(e) =>
									setCurrentCategory({
										...currentCategory,
										name: e.target.value,
									})
								}
								placeholder='e.g. Clothing'
							/>
						</div>

						<div className='space-y-2'>
							<label
								htmlFor='description'
								className='text-sm font-medium'
							>
								Description
							</label>
							<textarea
								id='description'
								className='w-full min-h-[100px] p-3 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue'
								value={currentCategory.description}
								onChange={(e) =>
									setCurrentCategory({
										...currentCategory,
										description: e.target.value,
									})
								}
								placeholder='Optional description...'
							/>
						</div>

						<DialogFooter className='pt-4'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setIsModalOpen(false)}
								disabled={isSaving}
							>
								Cancel
							</Button>
							<Button
								type='submit'
								className='bg-black text-white hover:bg-zinc-800'
								disabled={isSaving}
							>
								{isSaving ? 'Saving...' : 'Save Category'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
