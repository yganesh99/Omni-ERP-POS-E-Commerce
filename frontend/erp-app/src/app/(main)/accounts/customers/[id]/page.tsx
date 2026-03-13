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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, CreditCard, History, Building } from 'lucide-react';
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

interface LedgerEntry {
	_id: string;
	type: string;
	amount: number;
	description?: string;
	createdAt: string;
}

interface CustomerOrder {
	_id: string;
	orderNumber?: string;
	totalAmount?: number;
	paymentStatus?: string;
	status?: string;
	createdAt: string;
}

export default function SingleCustomerPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const { id } = params;

	const [customer, setCustomer] = useState<Customer | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		contactPerson: '',
		street: '',
		city: '',
		state: '',
		zip: '',
		country: '',
		creditLimit: 0,
	});

	// Credit management
	const [isPaymentOpen, setIsPaymentOpen] = useState(false);
	const [paymentAmount, setPaymentAmount] = useState('');
	const [isLedgerOpen, setIsLedgerOpen] = useState(false);
	const [ledger, setLedger] = useState<LedgerEntry[]>([]);
	const [isCreditLimitOpen, setIsCreditLimitOpen] = useState(false);
	const [newCreditLimit, setNewCreditLimit] = useState('');

	// Orders
	const [recentOrders, setRecentOrders] = useState<CustomerOrder[]>([]);

	const fetchCustomer = async () => {
		try {
			setIsLoading(true);
			const response = await api.get(`/customers/${id}`);
			const data = response.data.data || response.data;
			setCustomer(data);
			setFormData({
				name: data.name || '',
				email: data.email || '',
				phone: data.phone || '',
				contactPerson: '',
				street: data.address?.street || '',
				city: data.address?.city || '',
				state: data.address?.state || '',
				zip: data.address?.zip || '',
				country: data.address?.country || '',
				creditLimit: data.creditLimit || 0,
			});
		} catch (error) {
			console.error('Failed to fetch customer:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchLedger = async () => {
		try {
			const response = await api.get(`/credit/customer/${id}`);
			const data = response.data;
			const entries = data.ledger || data.data || data || [];
			setLedger(Array.isArray(entries) ? entries : []);
		} catch (error) {
			console.error('Failed to fetch ledger:', error);
		}
	};

	const fetchOrders = async () => {
		try {
			const response = await api.get(`/orders?customerId=${id}`);
			const data = response.data;
			const ordersArray = data.items || data.data || data || [];
			setRecentOrders(
				Array.isArray(ordersArray) ? ordersArray.slice(0, 5) : [],
			);
		} catch (error) {
			console.error('Failed to fetch orders:', error);
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (id) {
			fetchCustomer();
			fetchOrders();
		}
	}, [id]);

	const handleSaveChanges = async () => {
		try {
			setIsSaving(true);
			const updateData = {
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
			await api.put(`/customers/${id}`, updateData);
			await fetchCustomer();
			alert('Customer details updated successfully!');
		} catch (error) {
			console.error('Failed to update customer:', error);
			alert('Failed to update customer details.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleRecordPayment = async () => {
		const amount = parseFloat(paymentAmount);
		if (!amount || amount <= 0) {
			alert('Please enter a valid payment amount.');
			return;
		}
		try {
			await api.post('/credit/customer/payment', {
				customerId: id,
				amount,
			});
			setIsPaymentOpen(false);
			setPaymentAmount('');
			await fetchCustomer();
			alert('Payment recorded successfully!');
		} catch (error) {
			console.error('Failed to record payment:', error);
			alert('Failed to record payment.');
		}
	};

	const handleViewStatement = async () => {
		await fetchLedger();
		setIsLedgerOpen(true);
	};

	const handleAdjustCreditLimit = async () => {
		const limit = parseFloat(newCreditLimit);
		if (isNaN(limit) || limit < 0) {
			alert('Please enter a valid credit limit.');
			return;
		}
		try {
			await api.put(`/customers/${id}`, { creditLimit: limit });
			setIsCreditLimitOpen(false);
			setNewCreditLimit('');
			await fetchCustomer();
			alert('Credit limit updated successfully!');
		} catch (error) {
			console.error('Failed to adjust credit limit:', error);
			alert('Failed to update credit limit.');
		}
	};

	if (isLoading) {
		return (
			<div className='p-8 text-center text-zinc-500'>
				Loading customer details...
			</div>
		);
	}

	if (!customer) {
		return (
			<div className='p-8 text-center text-red-500'>
				Customer not found.
			</div>
		);
	}

	return (
		<RoleGuard allowedRoles={['admin', 'accountant']}>
			<div className='space-y-6'>
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
							{customer.name}
						</h2>
						<p className='text-zinc-500'>
							Customer ID: CUS-
							{customer._id?.substring(customer._id.length - 6)} |
							Status:{' '}
							<span
								className={`font-medium ${customer.isActive !== false ? 'text-green-600' : 'text-zinc-500'}`}
							>
								{customer.isActive !== false
									? 'Active'
									: 'Inactive'}
							</span>
						</p>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='md:col-span-2 space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle>Customer Details</CardTitle>
								<p className='text-sm text-zinc-500'>
									Requires admin access to update.
								</p>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<label className='text-sm font-medium'>
											Company Name
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
											Contact Email
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
											Phone Number
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
									<div className='col-span-2 space-y-2'>
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
									<div className='grid grid-cols-2 gap-4 col-span-2'>
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
												State/Province
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
												ZIP/Postal Code
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

						<Card>
							<CardHeader className='flex flex-row items-center justify-between'>
								<div>
									<CardTitle>Order History</CardTitle>
									<p className='text-sm text-zinc-500'>
										Recent purchases by this customer.
									</p>
								</div>
								<Button
									variant='outline'
									size='sm'
								>
									View All
								</Button>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Order ID</TableHead>
											<TableHead>Date</TableHead>
											<TableHead className='text-right'>
												Total
											</TableHead>
											<TableHead>Payment</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{recentOrders.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={5}
													className='text-center text-zinc-400 py-6'
												>
													No orders found for this
													customer.
												</TableCell>
											</TableRow>
											) : (
											recentOrders.map((order) => (
												<TableRow
													key={order._id}
													className='cursor-pointer hover:bg-zinc-50'
													onClick={() =>
														router.push(
															`/sales/orders/${order._id}`,
														)
													}
												>
													<TableCell className='font-medium'>
														ORD-
														{order._id?.substring(
															order._id.length -
																4,
														)}
													</TableCell>
													<TableCell>
														{new Date(
															order.createdAt,
														).toLocaleDateString()}
													</TableCell>
													<TableCell className='text-right font-medium'>
														රු
														{(
															order.totalAmount ||
															0
														).toFixed(2)}
													</TableCell>
													<TableCell>
														<span
															className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
														>
															{order.paymentStatus ||
																'unpaid'}
														</span>
													</TableCell>
													<TableCell>
														{order.status ||
															'pending'}
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>

					<div className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle>Credit Management</CardTitle>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='space-y-4'>
									<div className='p-4 bg-red-50 rounded-lg border border-red-100 flex flex-col items-center justify-center'>
										<span className='text-sm text-red-600 font-semibold mb-1'>
											Outstanding Balance
										</span>
										<span className='text-3xl font-bold text-red-700'>
											රු
											{(
												customer.currentBalance || 0
											).toFixed(2)}
										</span>
									</div>
									<div className='flex justify-between items-center py-2 border-b'>
										<span className='text-sm text-zinc-500'>
											Available Credit
										</span>
										<span className='font-medium'>
											රු
											{(
												customer.availableCredit ||
												(customer.creditLimit || 0) -
													(customer.currentBalance ||
														0)
											).toFixed(2)}
										</span>
									</div>
									<div className='flex justify-between items-center py-2 border-b'>
										<span className='text-sm text-zinc-500'>
											Total Credit Limit
										</span>
										<span className='font-medium'>
											රු
											{(
												customer.creditLimit || 0
											).toFixed(2)}
										</span>
									</div>
								</div>

								<div className='space-y-3 pt-2'>
									{/* Record Payment Dialog */}
									<Dialog
										open={isPaymentOpen}
										onOpenChange={setIsPaymentOpen}
									>
										<DialogTrigger asChild>
											<Button className='w-full bg-green-600 hover:bg-green-700'>
												<CreditCard className='w-4 h-4 mr-2' />
												Record Payment
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													Record Customer Payment
												</DialogTitle>
											</DialogHeader>
											<div className='space-y-4'>
												<div className='p-3 bg-zinc-50 rounded-lg text-sm'>
													<p>
														Outstanding Balance:{' '}
														<strong className='text-red-600'>
															රු
															{(
																customer.currentBalance ||
																0
															).toFixed(2)}
														</strong>
													</p>
												</div>
												<div className='space-y-2'>
													<label className='text-sm font-medium'>
														Payment Amount *
													</label>
													<Input
														type='number'
														min='0.01'
														step='0.01'
														max={
															customer.currentBalance ||
															0
														}
														value={paymentAmount}
														onChange={(e) =>
															setPaymentAmount(
																e.target.value,
															)
														}
														placeholder='Enter payment amount'
													/>
												</div>
											</div>
											<DialogFooter>
												<Button
													variant='outline'
													onClick={() =>
														setIsPaymentOpen(false)
													}
												>
													Cancel
												</Button>
												<Button
													onClick={
														handleRecordPayment
													}
												>
													Record Payment
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>

									{/* Adjust Credit Limit Dialog */}
									<Dialog
										open={isCreditLimitOpen}
										onOpenChange={setIsCreditLimitOpen}
									>
										<DialogTrigger asChild>
											<Button
												variant='outline'
												className='w-full'
											>
												<Building className='w-4 h-4 mr-2' />
												Adjust Credit Limit
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													Adjust Credit Limit
												</DialogTitle>
											</DialogHeader>
											<div className='space-y-4'>
												<div className='p-3 bg-zinc-50 rounded-lg text-sm'>
													<p>
														Current Limit:{' '}
														<strong>
															රු
															{(
																customer.creditLimit ||
																0
															).toFixed(2)}
														</strong>
													</p>
												</div>
												<div className='space-y-2'>
													<label className='text-sm font-medium'>
														New Credit Limit *
													</label>
													<Input
														type='number'
														min='0'
														step='0.01'
														value={newCreditLimit}
														onChange={(e) =>
															setNewCreditLimit(
																e.target.value,
															)
														}
														placeholder='Enter new credit limit'
													/>
												</div>
											</div>
											<DialogFooter>
												<Button
													variant='outline'
													onClick={() =>
														setIsCreditLimitOpen(
															false,
														)
													}
												>
													Cancel
												</Button>
												<Button
													onClick={
														handleAdjustCreditLimit
													}
												>
													Update Limit
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>

									{/* View Statement Dialog */}
									<Dialog
										open={isLedgerOpen}
										onOpenChange={setIsLedgerOpen}
									>
										<DialogTrigger asChild>
											<Button
												variant='outline'
												className='w-full'
												onClick={handleViewStatement}
											>
												<History className='w-4 h-4 mr-2' />
												View Statement
											</Button>
										</DialogTrigger>
										<DialogContent className='max-w-2xl'>
											<DialogHeader>
												<DialogTitle>
													Credit Statement —{' '}
													{customer.name}
												</DialogTitle>
											</DialogHeader>
											<div className='max-h-[400px] overflow-y-auto'>
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead>
																Date
															</TableHead>
															<TableHead>
																Type
															</TableHead>
															<TableHead>
																Description
															</TableHead>
															<TableHead className='text-right'>
																Amount
															</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														{ledger.length === 0 ? (
															<TableRow>
																<TableCell
																	colSpan={4}
																	className='text-center text-zinc-400 py-6'
																>
																	No ledger
																	entries
																	found.
																</TableCell>
															</TableRow>
														) : (
															ledger.map(
																(entry) => (
																	<TableRow
																		key={
																			entry._id
																		}
																	>
																		<TableCell className='text-sm'>
																			{new Date(
																				entry.createdAt,
																			).toLocaleDateString()}
																		</TableCell>
																		<TableCell>
																			<span
																				className={`px-2 py-0.5 rounded text-xs font-medium ${entry.type === 'payment' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
																			>
																				{
																					entry.type
																				}
																			</span>
																		</TableCell>
																		<TableCell className='text-sm text-zinc-600'>
																			{entry.description ||
																				'—'}
																		</TableCell>
																		<TableCell
																			className={`text-right font-medium ${entry.type === 'payment' ? 'text-green-600' : 'text-red-600'}`}
																		>
																			{entry.type ===
																			'payment'
																				? '-'
																				: '+'}
																			රු
																			{Math.abs(
																				entry.amount,
																			).toFixed(
																				2,
																			)}
																		</TableCell>
																	</TableRow>
																),
															)
														)}
													</TableBody>
												</Table>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</RoleGuard>
	);
}
