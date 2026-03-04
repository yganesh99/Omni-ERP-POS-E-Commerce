'use client';

import { use, useState, useEffect } from 'react';
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
import { ArrowLeft, Save, CreditCard, History, FileText } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import api from '@/lib/api';

interface Supplier {
	_id: string;
	name: string;
	contactPerson?: string;
	email?: string;
	phone?: string;
	address?: {
		street?: string;
		city?: string;
		state?: string;
		zip?: string;
		country?: string;
	};
	leadTimeDays?: number;
	currentBalance?: number;
	isActive?: boolean;
}

export default function SingleSupplierPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const { id } = params;

	const [supplier, setSupplier] = useState<Supplier | null>(null);
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
		leadTimeDays: 0,
		isActive: true,
	});

	// For now, mock recent POs or fetch if there's an endpoint
	const [recentPOs, setRecentPOs] = useState<any[]>([]);
	const [invoices, setInvoices] = useState<any[]>([]);
	const [isInvoicesOpen, setIsInvoicesOpen] = useState(false);
	const [isPaymentOpen, setIsPaymentOpen] = useState(false);
	const [paymentData, setPaymentData] = useState({
		invoiceId: '',
		amount: '',
	});

	const fetchSupplier = async () => {
		try {
			setIsLoading(true);
			const response = await api.get(`/suppliers/${id}`);
			const data = response.data.data || response.data;
			setSupplier(data);
			setFormData({
				name: data.name || '',
				email: data.email || '',
				phone: data.phone || '',
				contactPerson: data.contactPerson || '',
				street: data.address?.street || '',
				city: data.address?.city || '',
				state: data.address?.state || '',
				zip: data.address?.zip || '',
				country: data.address?.country || '',
				leadTimeDays: data.leadTimeDays || 0,
				isActive: data.isActive !== false,
			});
		} catch (error) {
			console.error('Failed to fetch supplier details:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchRelatedPOs = async () => {
		try {
			// Assuming there's a purchase-orders endpoint that filters by supplierId
			const response = await api.get(`/purchase-orders?supplierId=${id}`);
			const data = response.data;
			const posArray = data.items || data.data || data || [];
			// Just slice first 5 for history if needed
			setRecentPOs(posArray.slice(0, 5));
		} catch (error) {
			console.error('Failed to fetch related POs:', error);
		}
	};

	const fetchInvoices = async () => {
		try {
			const response = await api.get(
				`/supplier-invoices?supplierId=${id}`,
			);
			const data = response.data;
			const invoicesArray = data.items || data.data || data || [];
			setInvoices(invoicesArray);
		} catch (error) {
			console.error('Failed to fetch invoices:', error);
		}
	};

	useEffect(() => {
		if (id) {
			fetchSupplier();
			fetchRelatedPOs();
			fetchInvoices();
		}
	}, [id]);

	const handlePayInvoice = async (invoiceId: string, amount: number) => {
		try {
			await api.post(`/supplier-invoices/${invoiceId}/payment`, {
				amount,
			});
			alert('Payment recorded successfully!');
			fetchInvoices();
			fetchSupplier(); // update balance
			setIsPaymentOpen(false);
			setPaymentData({ invoiceId: '', amount: '' });
		} catch (error) {
			console.error('Failed to record payment:', error);
			alert('Failed to record payment.');
		}
	};

	const handleSaveChanges = async () => {
		try {
			setIsSaving(true);

			const updateData = {
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				contactPerson: formData.contactPerson,
				address: {
					street: formData.street,
					city: formData.city,
					state: formData.state,
					zip: formData.zip,
					country: formData.country,
				},
				leadTimeDays: formData.leadTimeDays,
				isActive: formData.isActive,
			};

			await api.put(`/suppliers/${id}`, updateData);
			await fetchSupplier();
			alert('Supplier details updated successfully!');
		} catch (error) {
			console.error('Failed to update supplier:', error);
			alert('Failed to update supplier details.');
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className='p-8 text-center text-zinc-500'>
				Loading supplier details...
			</div>
		);
	}

	if (!supplier) {
		return (
			<div className='p-8 text-center text-red-500'>
				Supplier not found.
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
							{supplier.name}
						</h2>
						<p className='text-zinc-500'>
							Supplier ID: SUP-
							{supplier._id?.substring(supplier._id.length - 6)} |
							Status:{' '}
							<span
								className={`font-medium ${supplier.isActive ? 'text-green-600' : 'text-zinc-500'}`}
							>
								{supplier.isActive ? 'Active' : 'Inactive'}
							</span>
						</p>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='md:col-span-2 space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle>Supplier Details</CardTitle>
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
											Contact Person
										</label>
										<Input
											value={formData.contactPerson}
											onChange={(e) =>
												setFormData({
													...formData,
													contactPerson:
														e.target.value,
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
									<div className='grid grid-cols-2 gap-4 col-span-2'>
										<div className='space-y-2'>
											<label className='text-sm font-medium'>
												Lead Time (Days)
											</label>
											<Input
												type='number'
												min='0'
												value={formData.leadTimeDays}
												onChange={(e) =>
													setFormData({
														...formData,
														leadTimeDays:
															parseInt(
																e.target.value,
															) || 0,
													})
												}
											/>
										</div>
										<div className='space-y-2 flex flex-col justify-end pb-2'>
											<label className='flex items-center space-x-2 text-sm font-medium cursor-pointer'>
												<input
													type='checkbox'
													checked={formData.isActive}
													onChange={(e) =>
														setFormData({
															...formData,
															isActive:
																e.target
																	.checked,
														})
													}
													className='w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue'
												/>
												<span>Active Supplier</span>
											</label>
										</div>
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
									<CardTitle>
										Purchase Order History
									</CardTitle>
									<p className='text-sm text-zinc-500'>
										Recent POs associated with this
										supplier.
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
											<TableHead>PO Number</TableHead>
											<TableHead>Date</TableHead>
											<TableHead className='text-right'>
												Total
											</TableHead>
											<TableHead>Payment</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{recentPOs.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={5}
													className='text-center py-4 text-zinc-500'
												>
													No purchase orders found.
												</TableCell>
											</TableRow>
										) : (
											recentPOs.map((po) => (
												<TableRow
													key={po._id}
													className='cursor-pointer hover:bg-zinc-50'
													onClick={() =>
														router.push(
															`/inventory/purchase-orders/${po._id}`,
														)
													}
												>
													<TableCell className='font-medium'>
														{po.poNumber ||
															po._id.substring(
																po._id.length -
																	6,
															)}
													</TableCell>
													<TableCell>
														{new Date(
															po.createdAt ||
																po.orderDate,
														).toLocaleDateString()}
													</TableCell>
													<TableCell className='text-right font-medium'>
														රු
														{(
															po.totalAmount || 0
														).toFixed(2)}
													</TableCell>
													<TableCell>
														<span
															className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${po.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
														>
															{po.paymentStatus ||
																'UNPAID'}
														</span>
													</TableCell>
													<TableCell>
														<span
															className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${po.status === 'received' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}
														>
															{po.status ||
																'PENDING'}
														</span>
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
								<CardTitle>Credit & Payments</CardTitle>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='space-y-4'>
									<div className='p-4 bg-red-50 rounded-lg border border-red-100 flex flex-col items-center justify-center'>
										<span className='text-sm text-red-600 font-semibold mb-1'>
											Outstanding Payables
										</span>
										<span className='text-3xl font-bold text-red-700'>
											රු
											{(
												supplier.currentBalance || 0
											).toFixed(2)}
										</span>
									</div>
								</div>

								<div className='space-y-3 pt-2'>
									<Dialog
										open={isPaymentOpen}
										onOpenChange={setIsPaymentOpen}
									>
										<DialogTrigger asChild>
											<Button className='w-full bg-black hover:bg-zinc-800 text-white'>
												<CreditCard className='w-4 h-4 mr-2' />
												Make Payment
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													Record Payment
												</DialogTitle>
											</DialogHeader>
											<div className='space-y-4 pt-4'>
												<div className='space-y-2'>
													<label className='text-sm font-medium'>
														Select Invoice
													</label>
													<select
														className='w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue'
														value={
															paymentData.invoiceId
														}
														onChange={(e) => {
															const invId =
																e.target.value;
															const inv =
																invoices.find(
																	(i) =>
																		i._id ===
																		invId,
																);
															setPaymentData({
																invoiceId:
																	invId,
																amount: inv
																	? String(
																			(inv.totalAmount ||
																				0) -
																				(inv.paidAmount ||
																					0),
																		)
																	: '',
															});
														}}
													>
														<option value=''>
															Select an invoice...
														</option>
														{invoices
															.filter(
																(inv) =>
																	inv.status !==
																	'paid',
															)
															.map((inv) => (
																<option
																	key={
																		inv._id
																	}
																	value={
																		inv._id
																	}
																>
																	{
																		inv.invoiceNumber
																	}{' '}
																	- Balance:
																	රු
																	{(
																		(inv.totalAmount ||
																			0) -
																		(inv.paidAmount ||
																			0)
																	).toFixed(
																		2,
																	)}
																</option>
															))}
													</select>
												</div>
												<div className='space-y-2'>
													<label className='text-sm font-medium'>
														Payment Amount (රු)
													</label>
													<Input
														type='number'
														min='0'
														step='0.01'
														value={
															paymentData.amount
														}
														onChange={(e) =>
															setPaymentData({
																...paymentData,
																amount: e.target
																	.value,
															})
														}
														placeholder='e.g., 5000.00'
													/>
												</div>
												<Button
													className='w-full mt-4'
													onClick={() => {
														if (
															!paymentData.invoiceId
														)
															return alert(
																'Please select an invoice',
															);
														if (
															!paymentData.amount ||
															Number(
																paymentData.amount,
															) <= 0
														)
															return alert(
																'Please enter a valid amount',
															);
														handlePayInvoice(
															paymentData.invoiceId,
															Number(
																paymentData.amount,
															),
														);
													}}
												>
													Confirm Payment
												</Button>
											</div>
										</DialogContent>
									</Dialog>
									<Dialog
										open={isInvoicesOpen}
										onOpenChange={setIsInvoicesOpen}
									>
										<DialogTrigger asChild>
											<Button
												variant='outline'
												className='w-full'
											>
												<FileText className='w-4 h-4 mr-2' />
												Supplier Invoices
											</Button>
										</DialogTrigger>
										<DialogContent className='max-w-3xl'>
											<DialogHeader>
												<DialogTitle>
													Invoices for {supplier.name}
												</DialogTitle>
											</DialogHeader>
											<div className='mt-4 max-h-[60vh] overflow-y-auto'>
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead>
																Invoice #
															</TableHead>
															<TableHead>
																Date
															</TableHead>
															<TableHead>
																Amount
															</TableHead>
															<TableHead>
																Paid
															</TableHead>
															<TableHead>
																Status
															</TableHead>
															<TableHead>
																Action
															</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														{invoices.length ===
														0 ? (
															<TableRow>
																<TableCell
																	colSpan={6}
																	className='text-center py-4'
																>
																	No invoices
																	found.
																</TableCell>
															</TableRow>
														) : (
															invoices.map(
																(inv) => (
																	<TableRow
																		key={
																			inv._id
																		}
																	>
																		<TableCell className='font-medium'>
																			{
																				inv.invoiceNumber
																			}
																		</TableCell>
																		<TableCell>
																			{new Date(
																				inv.createdAt,
																			).toLocaleDateString()}
																		</TableCell>
																		<TableCell>
																			රු
																			{(
																				inv.totalAmount ||
																				0
																			).toFixed(
																				2,
																			)}
																		</TableCell>
																		<TableCell>
																			රු
																			{(
																				inv.paidAmount ||
																				0
																			).toFixed(
																				2,
																			)}
																		</TableCell>
																		<TableCell>
																			<span
																				className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'partial_paid' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}
																			>
																				{
																					inv.status
																				}
																			</span>
																		</TableCell>
																		<TableCell>
																			{inv.status !==
																				'paid' && (
																				<Button
																					size='sm'
																					variant='outline'
																					onClick={() => {
																						setPaymentData(
																							{
																								invoiceId:
																									inv._id,
																								amount: String(
																									(inv.totalAmount ||
																										0) -
																										(inv.paidAmount ||
																											0),
																								),
																							},
																						);
																						setIsInvoicesOpen(
																							false,
																						);
																						setIsPaymentOpen(
																							true,
																						);
																					}}
																				>
																					Pay
																					Balance
																				</Button>
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
									<Button
										variant='outline'
										className='w-full'
									>
										<History className='w-4 h-4 mr-2' />
										View Statement
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</RoleGuard>
	);
}
