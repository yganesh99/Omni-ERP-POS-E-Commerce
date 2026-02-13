import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { purchaseOrders, suppliers } from '@/data/mockData';

const ERPSupplierInvoiceDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isNew = !id; // "new" route vs :id route logic would be handled by router, simplified here for mock

	const [selectedPo, setSelectedPo] = useState('');

	// Mock logic to load items from a selected PO
	const poData = purchaseOrders.find((po) => po.id === selectedPo);

	return (
		<div className='space-y-6 max-w-5xl mx-auto'>
			<div className='flex items-center gap-4'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => navigate('/erp/supplier-invoices')}
				>
					<ArrowLeft className='h-4 w-4' />
				</Button>
				<div>
					<h1 className='text-2xl font-bold font-display text-foreground'>
						{isNew ? 'Create Supplier Invoice' : `Invoice #${id}`}
					</h1>
					<p className='text-sm text-muted-foreground'>
						{isNew
							? 'Record a new invoice received from a supplier'
							: 'View invoice details'}
					</p>
				</div>
				<div className='ml-auto flex gap-2'>
					<Button variant='outline'>Cancel</Button>
					<Button className='gap-2'>
						<Save className='h-4 w-4' /> Save Invoice
					</Button>
				</div>
			</div>

			<div className='grid grid-cols-3 gap-6'>
				{/* Main Form */}
				<div className='col-span-2 space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle className='text-base'>
								Invoice Details
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Supplier</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Select supplier' />
										</SelectTrigger>
										<SelectContent>
											{suppliers.map((s) => (
												<SelectItem
													key={s.id}
													value={s.id}
												>
													{s.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label>Invoice Number</Label>
									<Input placeholder='e.g. INV-2024-001' />
								</div>
								<div className='space-y-2'>
									<Label>Invoice Date</Label>
									<Input type='date' />
								</div>
								<div className='space-y-2'>
									<Label>Payment Due</Label>
									<Input type='date' />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='text-base'>
								Line Items
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-end gap-4'>
								<div className='space-y-2 flex-1'>
									<Label>Link Purchase Order</Label>
									<Select onValueChange={setSelectedPo}>
										<SelectTrigger>
											<SelectValue placeholder='Select PO to import items...' />
										</SelectTrigger>
										<SelectContent>
											{purchaseOrders.map((po) => (
												<SelectItem
													key={po.id}
													value={po.id}
												>
													{po.id} - {po.supplier} ($
													{po.total})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<Button variant='secondary'>
									Import Items
								</Button>
							</div>

							{poData && (
								<div className='rounded-md border border-border'>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Item</TableHead>
												<TableHead className='w-[100px]'>
													Qty
												</TableHead>
												<TableHead className='w-[100px]'>
													Price
												</TableHead>
												<TableHead className='text-right'>
													Total
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{/* Mock items based on PO total since we don't have deep PO items in mockData yet */}
											<TableRow>
												<TableCell>
													Mock Product A (from{' '}
													{poData.id})
												</TableCell>
												<TableCell>5</TableCell>
												<TableCell>$100.00</TableCell>
												<TableCell className='text-right'>
													$500.00
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													Mock Product B
												</TableCell>
												<TableCell>2</TableCell>
												<TableCell>$50.00</TableCell>
												<TableCell className='text-right'>
													$100.00
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</div>
							)}

							{!poData && (
								<div className='text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg'>
									Select a PO to populate line items
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className='space-y-6'>
					{/* Price validation Alert */}
					<Alert variant='destructive'>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>Price Mismatch</AlertTitle>
						<AlertDescription className='text-xs'>
							The unit price for "Mock Product A" ($105.00)
							differs from the PO price ($100.00). Please resolve
							before saving.
						</AlertDescription>
					</Alert>

					<Card>
						<CardHeader>
							<CardTitle className='text-base'>
								Attachments
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer'>
								<Upload className='mx-auto h-8 w-8 text-muted-foreground mb-2' />
								<p className='text-sm font-medium'>
									Upload Invoice PDF
								</p>
								<p className='text-xs text-muted-foreground mt-1'>
									Drag & drop or click to browse
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='text-base'>Summary</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2'>
							<div className='flex justify-between text-sm'>
								<span className='text-muted-foreground'>
									Subtotal
								</span>
								<span>$0.00</span>
							</div>
							<div className='flex justify-between text-sm'>
								<span className='text-muted-foreground'>
									Tax
								</span>
								<span>$0.00</span>
							</div>
							<div className='border-t border-border my-2 pt-2 flex justify-between font-bold'>
								<span>Total</span>
								<span>$0.00</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ERPSupplierInvoiceDetail;
