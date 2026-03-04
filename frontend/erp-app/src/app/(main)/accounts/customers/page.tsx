'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RoleGuard from '@/components/RoleGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from '@/components/ui/dialog';
import api from '@/lib/api';

interface Customer {
	_id: string;
	name: string;
	email?: string;
	phone?: string;
	address?: {
		street?: string;
		city?: string;
		state?: string;
		zip?: string;
		country?: string;
	};
	creditLimit?: number;
	currentBalance?: number;
	availableCredit?: number;
	isActive?: boolean;
}

export default function CustomersPage() {
	const router = useRouter();
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		street: '',
		city: '',
		state: '',
		zip: '',
		country: '',
		creditLimit: 0,
	});

	const fetchCustomers = async () => {
		try {
			setIsLoading(true);
			const response = await api.get('/customers');
			const data = response.data;
			const list = data.items || data.data || data || [];
			setCustomers(Array.isArray(list) ? list : []);
		} catch (error) {
			console.error('Failed to fetch customers:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	const handleAddSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const payload = {
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				address: {
					street: formData.street,
					city: formData.city,
					state: formData.state,
					zip: formData.zip,
					country: formData.country,
				},
				creditLimit: formData.creditLimit,
			};
			await api.post('/customers', payload);
			setIsAddOpen(false);
			setFormData({
				name: '',
				email: '',
				phone: '',
				street: '',
				city: '',
				state: '',
				zip: '',
				country: '',
				creditLimit: 0,
			});
			fetchCustomers();
		} catch (error) {
			console.error('Failed to create customer:', error);
			alert('Failed to create customer.');
		}
	};

	const totalBalance = customers.reduce(
		(sum, c) => sum + (c.currentBalance || 0),
		0,
	);

	return (
		<RoleGuard allowedRoles={['admin', 'accountant']}>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h2 className='text-3xl font-bold tracking-tight'>
							Customers
						</h2>
						<p className='text-zinc-500'>
							Manage customer relations, credit balances, and
							order histories.
						</p>
					</div>
					<div className='flex items-center space-x-3'>
						<Button variant='outline'>
							<Download className='w-4 h-4 mr-2' />
							Export list
						</Button>

						<Dialog
							open={isAddOpen}
							onOpenChange={setIsAddOpen}
						>
							<DialogTrigger asChild>
								<Button className='bg-black text-white hover:bg-zinc-800'>
									<Plus className='w-4 h-4 mr-2' />
									Add Customer
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add New Customer</DialogTitle>
								</DialogHeader>
								<form
									onSubmit={handleAddSubmit}
									className='space-y-4'
								>
									<div className='space-y-2'>
										<label className='text-sm font-medium'>
											Customer Name *
										</label>
										<Input
											required
											value={formData.name}
											onChange={(e) =>
												setFormData({
													...formData,
													name: e.target.value,
												})
											}
										/>
									</div>
									<div className='grid grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												Email
											</label>
											<Input
												type='email'
												value={formData.email}
												onChange={(e) =>
													setFormData({
														...formData,
														email: e.target.value,
													})
												}
											/>
										</div>
										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												Phone
											</label>
											<Input
												value={formData.phone}
												onChange={(e) =>
													setFormData({
														...formData,
														phone: e.target.value,
													})
												}
											/>
										</div>
									</div>
									<div className='space-y-2'>
										<label className='text-sm font-medium'>
											Credit Limit
										</label>
										<Input
											type='number'
											min='0'
											value={formData.creditLimit}
											onChange={(e) =>
												setFormData({
													...formData,
													creditLimit:
														parseFloat(
															e.target.value,
														) || 0,
												})
											}
										/>
									</div>
									<div className='space-y-2'>
										<label className='text-sm font-medium'>
											Street Address
										</label>
										<Input
											value={formData.street}
											onChange={(e) =>
												setFormData({
													...formData,
													street: e.target.value,
												})
											}
										/>
									</div>
									<div className='grid grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												City
											</label>
											<Input
												value={formData.city}
												onChange={(e) =>
													setFormData({
														...formData,
														city: e.target.value,
													})
												}
											/>
										</div>
										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												State / Province
											</label>
											<Input
												value={formData.state}
												onChange={(e) =>
													setFormData({
														...formData,
														state: e.target.value,
													})
												}
											/>
										</div>
										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												ZIP / Postal Code
											</label>
											<Input
												value={formData.zip}
												onChange={(e) =>
													setFormData({
														...formData,
														zip: e.target.value,
													})
												}
											/>
										</div>
										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												Country
											</label>
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
											onClick={() => setIsAddOpen(false)}
										>
											Cancel
										</Button>
										<Button type='submit'>
											Save Customer
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<Card>
						<CardContent className='p-6 flex flex-col items-start'>
							<p className='text-sm font-medium text-zinc-500'>
								Total Customers
							</p>
							<p className='text-3xl font-bold mt-2'>
								{customers.length}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6 flex flex-col items-start'>
							<p className='text-sm font-medium text-zinc-500'>
								Active Customers
							</p>
							<p className='text-3xl font-bold mt-2'>
								{
									customers.filter(
										(c) => c.isActive !== false,
									).length
								}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6 flex flex-col items-start'>
							<p className='text-sm font-medium text-zinc-500'>
								Outstanding Credit Receivables
							</p>
							<p
								className={`text-3xl font-bold mt-2 ${totalBalance > 0 ? 'text-red-600' : ''}`}
							>
								රු{totalBalance.toFixed(2)}
							</p>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
						<CardTitle>Customer Directory</CardTitle>
						<div className='flex items-center space-x-2'>
							<div className='relative'>
								<Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400' />
								<Input
									type='text'
									placeholder='Search customers...'
									className='w-64 pl-9 pr-4 py-1.5 h-9 text-sm'
								/>
							</div>
							<Button
								variant='outline'
								className='flex items-center space-x-2 h-9'
							>
								<Filter className='w-4 h-4' />
								<span>Filters</span>
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<p className='text-center text-zinc-500 py-8'>
								Loading customers...
							</p>
						) : customers.length === 0 ? (
							<p className='text-center text-zinc-500 py-8'>
								No customers found. Add your first customer
								above.
							</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Customer</TableHead>
										<TableHead>Contact</TableHead>
										<TableHead className='text-right'>
											Credit Limit
										</TableHead>
										<TableHead className='text-right'>
											Outstanding Balance
										</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{customers.map((customer) => (
										<TableRow
											key={customer._id}
											className='cursor-pointer hover:bg-zinc-50'
											onClick={() =>
												router.push(
													`/accounts/customers/${customer._id}`,
												)
											}
										>
											<TableCell className='font-medium'>
												{customer.name}
											</TableCell>
											<TableCell>
												<div className='flex flex-col'>
													<span>
														{customer.email || '—'}
													</span>
													<span className='text-xs text-zinc-500'>
														{customer.phone || ''}
													</span>
												</div>
											</TableCell>
											<TableCell className='text-right'>
												රු
												{(
													customer.creditLimit || 0
												).toFixed(2)}
											</TableCell>
											<TableCell
												className={`text-right font-medium ${(customer.currentBalance || 0) > 0 ? 'text-red-600' : ''}`}
											>
												රු
												{(
													customer.currentBalance || 0
												).toFixed(2)}
											</TableCell>
											<TableCell>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium
													${customer.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'}
												`}
												>
													{customer.isActive !== false
														? 'Active'
														: 'Inactive'}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>
		</RoleGuard>
	);
}
