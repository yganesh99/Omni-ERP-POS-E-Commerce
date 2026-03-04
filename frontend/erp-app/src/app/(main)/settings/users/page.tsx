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
import { UserPlus, Edit2 } from 'lucide-react';
import api from '@/lib/api';

interface User {
	_id: string;
	name: string;
	email: string;
	phone?: string;
	role: string;
	storeId?: { _id: string; name: string } | string | null;
	isActive: boolean;
}

interface Store {
	_id: string;
	name: string;
}

const ROLES = ['store_manager', 'inventory_manager', 'accountant', 'cashier'];

const emptyForm = {
	name: '',
	email: '',
	password: '',
	phone: '',
	role: 'cashier',
	storeId: '',
};

export default function UsersSettingsPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [stores, setStores] = useState<Store[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState({ ...emptyForm });

	const fetchUsers = async () => {
		try {
			setIsLoading(true);
			const response = await api.get('/users');
			const data = response.data;
			const list = data.items || data.data || data || [];
			setUsers(Array.isArray(list) ? list : []);
		} catch (error) {
			console.error('Failed to fetch users:', error);
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
		fetchUsers();
		fetchStores();
	}, []);

	const handleAddSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const payload: any = {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				phone: formData.phone,
				role: formData.role,
			};
			if (formData.storeId) payload.storeId = formData.storeId;
			await api.post('/users', payload);
			setIsAddOpen(false);
			setFormData({ ...emptyForm });
			fetchUsers();
		} catch (error) {
			console.error('Failed to create user:', error);
			alert('Failed to create user.');
		}
	};

	const openEdit = (user: User) => {
		setEditingId(user._id);
		const storeVal =
			typeof user.storeId === 'object'
				? user.storeId?._id || ''
				: user.storeId || '';
		setFormData({
			name: user.name || '',
			email: user.email || '',
			password: '',
			phone: user.phone || '',
			role: user.role || 'cashier',
			storeId: storeVal,
		});
		setIsEditOpen(true);
	};

	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingId) return;
		try {
			const payload: any = {
				name: formData.name,
				phone: formData.phone,
				role: formData.role,
			};
			if (formData.storeId) {
				payload.storeId = formData.storeId;
			} else {
				payload.storeId = null;
			}
			await api.put(`/users/${editingId}`, payload);
			setIsEditOpen(false);
			setEditingId(null);
			setFormData({ ...emptyForm });
			fetchUsers();
		} catch (error) {
			console.error('Failed to update user:', error);
			alert('Failed to update user.');
		}
	};

	const handleToggle = async (user: User) => {
		try {
			await api.patch(`/users/${user._id}/toggle`);
			fetchUsers();
		} catch (error) {
			console.error('Failed to toggle user:', error);
		}
	};

	const getStoreName = (user: User) => {
		if (!user.storeId) return 'All Stores';
		if (typeof user.storeId === 'object' && user.storeId?.name) {
			return user.storeId.name;
		}
		return '—';
	};

	const renderForm = (
		onSubmit: (e: React.FormEvent) => void,
		submitLabel: string,
		isEdit: boolean,
	) => (
		<form
			onSubmit={onSubmit}
			className='space-y-4'
		>
			<div className='grid grid-cols-2 gap-4'>
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Full Name *</label>
					<Input
						required
						value={formData.name}
						onChange={(e) =>
							setFormData({ ...formData, name: e.target.value })
						}
					/>
				</div>
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Email *</label>
					<Input
						type='email'
						required
						disabled={isEdit}
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
					/>
				</div>
			</div>
			{!isEdit && (
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Password *</label>
					<Input
						type='password'
						required
						minLength={8}
						value={formData.password}
						onChange={(e) =>
							setFormData({
								...formData,
								password: e.target.value,
							})
						}
					/>
				</div>
			)}
			<div className='grid grid-cols-2 gap-4'>
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
					<label className='text-sm font-medium'>Role *</label>
					<select
						className='w-full h-10 px-3 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white'
						value={formData.role}
						onChange={(e) =>
							setFormData({ ...formData, role: e.target.value })
						}
					>
						{ROLES.map((r) => (
							<option
								key={r}
								value={r}
							>
								{r.replace('_', ' ')}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className='space-y-2'>
				<label className='text-sm font-medium'>Assigned Store</label>
				<select
					className='w-full h-10 px-3 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white'
					value={formData.storeId}
					onChange={(e) =>
						setFormData({ ...formData, storeId: e.target.value })
					}
				>
					<option value=''>All Stores (Global)</option>
					{stores.map((s) => (
						<option
							key={s._id}
							value={s._id}
						>
							{s.name}
						</option>
					))}
				</select>
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
					User Access Control
				</h3>
				<Dialog
					open={isAddOpen}
					onOpenChange={setIsAddOpen}
				>
					<DialogTrigger asChild>
						<Button className='bg-black text-white hover:bg-zinc-800'>
							<UserPlus className='w-4 h-4 mr-2' />
							Invite User
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New User</DialogTitle>
						</DialogHeader>
						{renderForm(handleAddSubmit, 'Create User', false)}
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardContent className='p-0'>
					{isLoading ? (
						<p className='text-center text-zinc-500 py-8'>
							Loading users...
						</p>
					) : users.length === 0 ? (
						<p className='text-center text-zinc-500 py-8'>
							No users found.
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>User Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Assigned Store</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-right'>
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user._id}>
										<TableCell className='font-medium'>
											{user.name}
										</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>
											<span className='px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-md text-xs font-bold uppercase tracking-wider text-zinc-600'>
												{user.role.replace('_', ' ')}
											</span>
										</TableCell>
										<TableCell className='text-zinc-500 text-sm'>
											{getStoreName(user)}
										</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
											>
												{user.isActive
													? 'Active'
													: 'Suspended'}
											</span>
										</TableCell>
										<TableCell className='text-right space-x-1'>
											<Button
												variant='ghost'
												size='icon'
												onClick={() => openEdit(user)}
											>
												<Edit2 className='w-4 h-4 text-blue-600' />
											</Button>
											<Button
												variant='ghost'
												size='sm'
												className='text-xs'
												onClick={() =>
													handleToggle(user)
												}
											>
												{user.isActive
													? 'Suspend'
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
						<DialogTitle>Edit User</DialogTitle>
					</DialogHeader>
					{renderForm(handleEditSubmit, 'Save Changes', true)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
