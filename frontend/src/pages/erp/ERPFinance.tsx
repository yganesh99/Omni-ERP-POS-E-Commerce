import {
	DollarSign,
	TrendingUp,
	TrendingDown,
	Users,
	Truck,
} from 'lucide-react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { customers, suppliers } from '@/data/mockData';

const ERPFinance = () => {
	// Calculate totals from mock data
	const totalAR = customers.reduce((sum, c) => sum + c.balance, 0);
	const totalAP = suppliers.reduce((sum, s) => sum + s.balance, 0);
	const netPosition = totalAR - totalAP;

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-2xl font-bold font-display text-foreground'>
					Financial Dashboard
				</h1>
				<p className='text-sm text-muted-foreground'>
					Overview of Accounts Receivable and Payable
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-3'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Accounts Receivable (AR)
						</CardTitle>
						<TrendingUp className='h-4 w-4 text-success' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							${totalAR.toLocaleString()}
						</div>
						<p className='text-xs text-muted-foreground'>
							Total outstanding from{' '}
							{customers.filter((c) => c.balance > 0).length}{' '}
							customers
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Accounts Payable (AP)
						</CardTitle>
						<TrendingDown className='h-4 w-4 text-destructive' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							${totalAP.toLocaleString()}
						</div>
						<p className='text-xs text-muted-foreground'>
							Total owed to{' '}
							{suppliers.filter((s) => s.balance > 0).length}{' '}
							suppliers
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Net Position
						</CardTitle>
						<DollarSign className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div
							className={`text-2xl font-bold ${netPosition >= 0 ? 'text-success' : 'text-destructive'}`}
						>
							{netPosition >= 0 ? '+' : ''}$
							{netPosition.toLocaleString()}
						</div>
						<p className='text-xs text-muted-foreground'>
							Receivables - Payables
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs
				defaultValue='ar'
				className='space-y-4'
			>
				<TabsList>
					<TabsTrigger
						value='ar'
						className='gap-2'
					>
						<Users className='h-4 w-4' /> Customer Accounts (AR)
					</TabsTrigger>
					<TabsTrigger
						value='ap'
						className='gap-2'
					>
						<Truck className='h-4 w-4' /> Supplier Accounts (AP)
					</TabsTrigger>
				</TabsList>

				<TabsContent value='ar'>
					<Card>
						<CardHeader>
							<CardTitle>Customer Balances</CardTitle>
							<CardDescription>
								Customers with outstanding payments
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='rounded-md border border-border'>
								<table className='w-full text-sm'>
									<thead>
										<tr className='border-b border-border bg-muted/50'>
											<th className='text-left py-3 px-4 font-medium'>
												Customer
											</th>
											<th className='text-left py-3 px-4 font-medium'>
												Contact
											</th>
											<th className='text-right py-3 px-4 font-medium'>
												Credit Limit
											</th>
											<th className='text-right py-3 px-4 font-medium'>
												Balance
											</th>
											<th className='text-right py-3 px-4 font-medium'>
												Utilization
											</th>
										</tr>
									</thead>
									<tbody>
										{customers
											.filter((c) => c.balance > 0)
											.map((customer) => {
												const utilization =
													(customer.balance /
														customer.creditLimit) *
													100;
												return (
													<tr
														key={customer.id}
														className='border-b border-border/50 hover:bg-muted/50'
													>
														<td className='py-3 px-4 font-medium'>
															{customer.name}
														</td>
														<td className='py-3 px-4 text-muted-foreground'>
															{customer.email}
														</td>
														<td className='py-3 px-4 text-right'>
															$
															{customer.creditLimit.toLocaleString()}
														</td>
														<td className='py-3 px-4 text-right font-medium text-warning'>
															$
															{customer.balance.toLocaleString()}
														</td>
														<td className='py-3 px-4 text-right'>
															<div className='flex items-center justify-end gap-2'>
																<span className='text-xs text-muted-foreground'>
																	{utilization.toFixed(
																		1,
																	)}
																	%
																</span>
																<div className='h-1.5 w-16 bg-secondary rounded-full overflow-hidden'>
																	<div
																		className={`h-full ${utilization > 90 ? 'bg-destructive' : 'bg-primary'}`}
																		style={{
																			width: `${utilization}%`,
																		}}
																	/>
																</div>
															</div>
														</td>
													</tr>
												);
											})}
										{customers.filter((c) => c.balance > 0)
											.length === 0 && (
											<tr>
												<td
													colSpan={5}
													className='py-8 text-center text-muted-foreground'
												>
													No customers with
													outstanding balances.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='ap'>
					<Card>
						<CardHeader>
							<CardTitle>Supplier Balances</CardTitle>
							<CardDescription>
								Suppliers we owe money to
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='rounded-md border border-border'>
								<table className='w-full text-sm'>
									<thead>
										<tr className='border-b border-border bg-muted/50'>
											<th className='text-left py-3 px-4 font-medium'>
												Supplier
											</th>
											<th className='text-left py-3 px-4 font-medium'>
												Contact
											</th>
											<th className='text-right py-3 px-4 font-medium'>
												Lead Time
											</th>
											<th className='text-right py-3 px-4 font-medium'>
												Balance Payable
											</th>
										</tr>
									</thead>
									<tbody>
										{suppliers
											.filter((s) => s.balance > 0)
											.map((supplier) => (
												<tr
													key={supplier.id}
													className='border-b border-border/50 hover:bg-muted/50'
												>
													<td className='py-3 px-4 font-medium'>
														{supplier.name}
													</td>
													<td className='py-3 px-4 text-muted-foreground'>
														{supplier.email}
													</td>
													<td className='py-3 px-4 text-right'>
														{supplier.leadTime} days
													</td>
													<td className='py-3 px-4 text-right font-medium text-destructive'>
														$
														{supplier.balance.toLocaleString()}
													</td>
												</tr>
											))}
										{suppliers.filter((s) => s.balance > 0)
											.length === 0 && (
											<tr>
												<td
													colSpan={4}
													className='py-8 text-center text-muted-foreground'
												>
													No outstanding payables.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ERPFinance;
