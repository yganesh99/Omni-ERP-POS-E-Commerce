'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
	DialogTrigger,
	DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Edit2 } from 'lucide-react';
import api from '@/lib/api';

interface Store {
	_id: string;
	name: string;
	code: string;
	address?: {
		street?: string;
		city?: string;
		state?: string;
		zip?: string;
		country?: string;
	};
	phone?: string;
	isActive: boolean;
}

const emptyForm = {
	name: '',
	code: '',
	phone: '',
	street: '',
	city: '',
	state: '',
	zip: '',
	country: '',
};

export default function StoresSettingsPage() {
	const [stores, setStores] = useState<Store[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState({ ...emptyForm });

	const fetchStores = async () => {
		try {
			setIsLoading(true);
			const response = await api.get('/stores');
			const data = response.data;
			const list = data.items || data.data || data || [];
			setStores(Array.isArray(list) ? list : []);
		} catch (error) {
			console.error('Failed to fetch stores:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchStores();
	}, []);

	const buildPayload = () => ({
		name: formData.name,
		code: formData.code,
		phone: formData.phone,
		address: {
			street: formData.street,
			city: formData.city,
			state: formData.state,
			zip: formData.zip,
			country: formData.country,
		},
	});

	const handleAddSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api.post('/stores', buildPayload());
			setIsAddOpen(false);
			setFormData({ ...emptyForm });
			fetchStores();
		} catch (error) {
			console.error('Failed to create store:', error);
			alert('Failed to create store.');
		}
	};

	const openEdit = (store: Store) => {
		setEditingId(store._id);
		setFormData({
			name: store.name || '',
			code: store.code || '',
			phone: store.phone || '',
			street: store.address?.street || '',
			city: store.address?.city || '',
			state: store.address?.state || '',
			zip: store.address?.zip || '',
			country: store.address?.country || '',
		});
		setIsEditOpen(true);
	};

	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingId) return;
		try {
			await api.put(`/stores/${editingId}`, buildPayload());
			setIsEditOpen(false);
			setEditingId(null);
			setFormData({ ...emptyForm });
			fetchStores();
		} catch (error) {
			console.error('Failed to update store:', error);
			alert('Failed to update store.');
		}
	};

	const handleToggle = async (store: Store) => {
		try {
			await api.patch(`/stores/${store._id}/toggle`);
			fetchStores();
		} catch (error) {
			console.error('Failed to toggle store:', error);
		}
	};

	const renderForm = (
		onSubmit: (e: React.FormEvent) => void,
		submitLabel: string,
	) => (
		<form
			onSubmit={onSubmit}
			className='space-y-4'
		>
			<div className='grid grid-cols-2 gap-4'>
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Store Name *</label>
					<Input
						required
						value={formData.name}
						onChange={(e) =>
							setFormData({ ...formData, name: e.target.value })
						}
					/>
				</div>
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Store Code *</label>
					<Input
						required
						value={formData.code}
						onChange={(e) =>
							setFormData({ ...formData, code: e.target.value })
						}
					/>
				</div>
			</div>
			<div className='space-y-2'>
				<label className='text-sm font-medium'>Phone</label>
				<Input
					value={formData.phone}
					onChange={(e) =>
						setFormData({ ...formData, phone: e.target.value })
					}
				/>
			</div>
			<div className='space-y-2'>
				<label className='text-sm font-medium'>Street Address</label>
				<Input
					value={formData.street}
					onChange={(e) =>
						setFormData({ ...formData, street: e.target.value })
					}
				/>
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<div className='space-y-2'>
					<label className='text-sm font-medium'>City</label>
					<Input
						value={formData.city}
						onChange={(e) =>
							setFormData({ ...formData, city: e.target.value })
						}
					/>
				</div>
				<div className='space-y-2'>
					<label className='text-sm font-medium'>State</label>
					<Input
						value={formData.state}
						onChange={(e) =>
							setFormData({ ...formData, state: e.target.value })
						}
					/>
				</div>
				<div className='space-y-2'>
					<label className='text-sm font-medium'>ZIP</label>
					<Input
						value={formData.zip}
						onChange={(e) =>
							setFormData({ ...formData, zip: e.target.value })
						}
					/>
				</div>
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Country</label>
					<Input
						value={formData.country}
						onChange={(e) =>
							setFormData({
								...formData,
								country: e.target.value,
							})
						}
					/>
				</div>
			</div>
			<DialogFooter>
				<Button
					type='button'
					variant='outline'
					onClick={() => {
						setIsAddOpen(false);
						setIsEditOpen(false);
					}}
				>
					Cancel
				</Button>
				<Button type='submit'>{submitLabel}</Button>
			</DialogFooter>
		</form>
	);

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h3 className='text-2xl font-bold tracking-tight'>
					Stores & Warehouses
				</h3>
				<Dialog
					open={isAddOpen}
					onOpenChange={setIsAddOpen}
				>
					<DialogTrigger asChild>
						<Button className='bg-black text-white hover:bg-zinc-800'>
							<Plus className='w-4 h-4 mr-2' />
							Add Store
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Store</DialogTitle>
						</DialogHeader>
						{renderForm(handleAddSubmit, 'Create Store')}
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardContent className='p-0'>
					{isLoading ? (
						<p className='text-center text-zinc-500 py-8'>
							Loading stores...
						</p>
					) : stores.length === 0 ? (
						<p className='text-center text-zinc-500 py-8'>
							No stores found. Add your first store above.
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Code</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Location</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-right'>
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{stores.map((store) => (
									<TableRow key={store._id}>
										<TableCell className='font-medium'>
											{store.code}
										</TableCell>
										<TableCell>{store.name}</TableCell>
										<TableCell>
											{store.address?.city
												? `${store.address.city}${store.address.state ? ', ' + store.address.state : ''}`
												: '—'}
										</TableCell>
										<TableCell>
											{store.phone || '—'}
										</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${store.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'}`}
											>
												{store.isActive
													? 'Active'
													: 'Inactive'}
											</span>
										</TableCell>
										<TableCell className='text-right space-x-1'>
											<Button
												variant='ghost'
												size='icon'
												className='mr-1'
												onClick={() => openEdit(store)}
											>
												<Edit2 className='w-4 h-4 text-blue-600' />
											</Button>
											<Button
												variant='ghost'
												size='sm'
												className='text-xs'
												onClick={() =>
													handleToggle(store)
												}
											>
												{store.isActive
													? 'Deactivate'
													: 'Activate'}
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Edit Dialog */}
			<Dialog
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Store</DialogTitle>
					</DialogHeader>
					{renderForm(handleEditSubmit, 'Save Changes')}
				</DialogContent>
			</Dialog>
		</div>
	);
}
