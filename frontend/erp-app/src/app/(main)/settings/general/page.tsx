'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Save, Plus, Edit2 } from 'lucide-react';
import api from '@/lib/api';

interface Tax {
	_id: string;
	name: string;
	rate: number;
	isDefault: boolean;
	isActive: boolean;
}

const emptyTaxForm = { name: '', rate: 0, isDefault: false };

export default function GeneralSettingsPage() {
	const [taxes, setTaxes] = useState<Tax[]>([]);
	const [isTaxLoading, setIsTaxLoading] = useState(true);
	const [isAddTaxOpen, setIsAddTaxOpen] = useState(false);
	const [isEditTaxOpen, setIsEditTaxOpen] = useState(false);
	const [editingTaxId, setEditingTaxId] = useState<string | null>(null);
	const [taxForm, setTaxForm] = useState({ ...emptyTaxForm });

	const fetchTaxes = async () => {
		try {
			setIsTaxLoading(true);
			const response = await api.get('/taxes');
			const data = response.data;
			const list = data.items || data.data || data || [];
			setTaxes(Array.isArray(list) ? list : []);
		} catch (error) {
			console.error('Failed to fetch taxes:', error);
		} finally {
			setIsTaxLoading(false);
		}
	};

	useEffect(() => {
		fetchTaxes();
	}, []);

	const handleAddTax = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api.post('/taxes', {
				name: taxForm.name,
				rate: taxForm.rate,
				isDefault: taxForm.isDefault,
			});
			setIsAddTaxOpen(false);
			setTaxForm({ ...emptyTaxForm });
			fetchTaxes();
		} catch (error) {
			console.error('Failed to create tax:', error);
			alert('Failed to create tax rate.');
		}
	};

	const openEditTax = (tax: Tax) => {
		setEditingTaxId(tax._id);
		setTaxForm({
			name: tax.name,
			rate: tax.rate,
			isDefault: tax.isDefault,
		});
		setIsEditTaxOpen(true);
	};

	const handleEditTax = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingTaxId) return;
		try {
			await api.put(`/taxes/${editingTaxId}`, {
				name: taxForm.name,
				rate: taxForm.rate,
				isDefault: taxForm.isDefault,
			});
			setIsEditTaxOpen(false);
			setEditingTaxId(null);
			setTaxForm({ ...emptyTaxForm });
			fetchTaxes();
		} catch (error) {
			console.error('Failed to update tax:', error);
			alert('Failed to update tax rate.');
		}
	};

	const handleToggleTax = async (tax: Tax) => {
		try {
			await api.put(`/taxes/${tax._id}`, { isActive: !tax.isActive });
			fetchTaxes();
		} catch (error) {
			console.error('Failed to toggle tax:', error);
		}
	};

	const renderTaxForm = (
		onSubmit: (e: React.FormEvent) => void,
		submitLabel: string,
	) => (
		<form
			onSubmit={onSubmit}
			className='space-y-4'
		>
			<div className='space-y-2'>
				<label className='text-sm font-medium'>Tax Name *</label>
				<Input
					required
					placeholder='e.g. VAT, GST, Sales Tax'
					value={taxForm.name}
					onChange={(e) =>
						setTaxForm({ ...taxForm, name: e.target.value })
					}
				/>
			</div>
			<div className='space-y-2'>
				<label className='text-sm font-medium'>Rate (%) *</label>
				<Input
					type='number'
					required
					min='0'
					step='0.01'
					value={taxForm.rate}
					onChange={(e) =>
						setTaxForm({
							...taxForm,
							rate: parseFloat(e.target.value) || 0,
						})
					}
				/>
			</div>
			<div className='flex items-center space-x-2'>
				<input
					type='checkbox'
					id='isDefault'
					checked={taxForm.isDefault}
					onChange={(e) =>
						setTaxForm({ ...taxForm, isDefault: e.target.checked })
					}
					className='w-4 h-4 rounded border-zinc-300'
				/>
				<label
					htmlFor='isDefault'
					className='text-sm font-medium'
				>
					Set as default tax rate
				</label>
			</div>
			<DialogFooter>
				<Button
					type='button'
					variant='outline'
					onClick={() => {
						setIsAddTaxOpen(false);
						setIsEditTaxOpen(false);
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
			{/* Company Details */}
			<Card>
				<CardHeader>
					<CardTitle>Company Details</CardTitle>
					<p className='text-sm text-zinc-500'>
						Basic information about your business.
					</p>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm font-medium'>
								Company Name
							</label>
							<Input defaultValue='Fabric Hub LLC' />
						</div>
						<div className='space-y-2'>
							<label className='text-sm font-medium'>
								Registration Number
							</label>
							<Input defaultValue='REG-109244' />
						</div>
						<div className='space-y-2'>
							<label className='text-sm font-medium'>
								Tax / VAT ID
							</label>
							<Input defaultValue='TAX-US-99112' />
						</div>
						<div className='space-y-2'>
							<label className='text-sm font-medium'>
								Support Email
							</label>
							<Input defaultValue='support@fabrichub.test' />
						</div>
					</div>
					<div className='pt-4 flex justify-end'>
						<Button className='flex items-center space-x-2'>
							<Save className='w-4 h-4' />
							<span>Save Changes</span>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Regional Settings */}
			<Card>
				<CardHeader>
					<CardTitle>Regional Settings</CardTitle>
					<p className='text-sm text-zinc-500'>
						Configure currency and timezone.
					</p>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm font-medium'>
								Base Currency
							</label>
							<select className='w-full p-2 border rounded-md focus:ring-1 focus:ring-brand-blue bg-white'>
								<option value='LKR'>LKR (රු)</option>
							</select>
						</div>
						<div className='space-y-2'>
							<label className='text-sm font-medium'>
								Timezone
							</label>
							<select className='w-full p-2 border rounded-md focus:ring-1 focus:ring-brand-blue bg-white'>
								<option value='Asia/Colombo'>
									Asia/Colombo (IST)
								</option>
								<option value='America/New_York'>
									Eastern Time (ET)
								</option>
								<option value='Europe/London'>
									London (GMT)
								</option>
							</select>
						</div>
					</div>
					<div className='pt-4 flex justify-end'>
						<Button className='flex items-center space-x-2'>
							<Save className='w-4 h-4' />
							<span>Save Changes</span>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Tax Rates Management */}
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0'>
					<div>
						<CardTitle>Tax Rates</CardTitle>
						<p className='text-sm text-zinc-500 mt-1'>
							Manage tax rates applied to products and POS
							transactions.
						</p>
					</div>
					<Dialog
						open={isAddTaxOpen}
						onOpenChange={setIsAddTaxOpen}
					>
						<DialogTrigger asChild>
							<Button className='bg-black text-white hover:bg-zinc-800'>
								<Plus className='w-4 h-4 mr-2' />
								Add Tax Rate
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add New Tax Rate</DialogTitle>
							</DialogHeader>
							{renderTaxForm(handleAddTax, 'Create Tax Rate')}
						</DialogContent>
					</Dialog>
				</CardHeader>
				<CardContent>
					{isTaxLoading ? (
						<p className='text-center text-zinc-500 py-8'>
							Loading tax rates...
						</p>
					) : taxes.length === 0 ? (
						<p className='text-center text-zinc-500 py-8'>
							No tax rates configured. Add your first tax rate
							above.
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead className='text-right'>
										Rate (%)
									</TableHead>
									<TableHead>Default</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-right'>
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{taxes.map((tax) => (
									<TableRow key={tax._id}>
										<TableCell className='font-medium'>
											{tax.name}
										</TableCell>
										<TableCell className='text-right'>
											{tax.rate}%
										</TableCell>
										<TableCell>
											{tax.isDefault ? (
												<span className='px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium'>
													Default
												</span>
											) : (
												<span className='text-zinc-400 text-xs'>
													—
												</span>
											)}
										</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${tax.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'}`}
											>
												{tax.isActive
													? 'Active'
													: 'Inactive'}
											</span>
										</TableCell>
										<TableCell className='text-right space-x-1'>
											<Button
												variant='ghost'
												size='icon'
												onClick={() => openEditTax(tax)}
											>
												<Edit2 className='w-4 h-4 text-blue-600' />
											</Button>
											<Button
												variant='ghost'
												size='sm'
												className='text-xs'
												onClick={() =>
													handleToggleTax(tax)
												}
											>
												{tax.isActive
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

			{/* Edit Tax Dialog */}
			<Dialog
				open={isEditTaxOpen}
				onOpenChange={setIsEditTaxOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Tax Rate</DialogTitle>
					</DialogHeader>
					{renderTaxForm(handleEditTax, 'Save Changes')}
				</DialogContent>
			</Dialog>
		</div>
	);
}
