import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supplierInvoices } from '@/data/mockData';

const ERPSupplierInvoices = () => {
	const navigate = useNavigate();

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold font-display text-foreground'>
						Supplier Invoices
					</h1>
					<p className='text-sm text-muted-foreground'>
						Manage and track invoices from suppliers
					</p>
				</div>
				<Button
					onClick={() => navigate('/erp/supplier-invoices/new')}
					className='gap-2'
				>
					<Plus className='h-4 w-4' /> Create Invoice
				</Button>
			</div>

			<div className='flex items-center gap-4'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Search invoices...'
						className='pl-10'
					/>
				</div>
				<Button
					variant='outline'
					className='gap-2'
				>
					<Filter className='h-4 w-4' /> Filter
				</Button>
			</div>

			<Card>
				<CardContent className='p-0'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-border'>
								<th className='text-left py-3 px-4 text-muted-foreground font-medium'>
									Invoice ID
								</th>
								<th className='text-left py-3 px-4 text-muted-foreground font-medium'>
									Supplier
								</th>
								<th className='text-left py-3 px-4 text-muted-foreground font-medium'>
									PO Reference
								</th>
								<th className='text-left py-3 px-4 text-muted-foreground font-medium'>
									Date
								</th>
								<th className='text-left py-3 px-4 text-muted-foreground font-medium'>
									Items
								</th>
								<th className='text-right py-3 px-4 text-muted-foreground font-medium'>
									Total
								</th>
								<th className='text-right py-3 px-4 text-muted-foreground font-medium'>
									Status
								</th>
							</tr>
						</thead>
						<tbody>
							{supplierInvoices.map((inv) => (
								<tr
									key={inv.id}
									className='border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer'
									onClick={() =>
										navigate(
											`/erp/supplier-invoices/${inv.id}`,
										)
									}
								>
									<td className='py-3 px-4 font-medium text-foreground'>
										{inv.id}
									</td>
									<td className='py-3 px-4 text-muted-foreground'>
										{inv.supplier}
									</td>
									<td className='py-3 px-4 text-primary hover:underline'>
										{inv.poNumber}
									</td>
									<td className='py-3 px-4 text-muted-foreground'>
										{inv.date}
									</td>
									<td className='py-3 px-4 text-muted-foreground'>
										{inv.items}
									</td>
									<td className='py-3 px-4 text-right font-medium'>
										${inv.total.toLocaleString()}
									</td>
									<td className='py-3 px-4 text-right'>
										<Badge
											variant={
												inv.status === 'Paid'
													? 'default'
													: inv.status === 'Overdue'
														? 'destructive'
														: 'secondary'
											}
											className='text-[10px]'
										>
											{inv.status}
										</Badge>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</CardContent>
			</Card>
		</div>
	);
};

export default ERPSupplierInvoices;
