'use client';

import { useRouter } from 'next/navigation';
import RoleGuard from '@/components/RoleGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

export default function CreatePurchaseOrderPage() {
	const router = useRouter();

	return (
		<RoleGuard allowedRoles={['admin', 'inventory_manager']}>
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
							Create Purchase Order
						</h2>
						<p className='text-zinc-500'>
							Draft a new PO to send to a supplier.
						</p>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='md:col-span-2 space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle>PO Details</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<label className='text-sm font-medium'>
											Select Supplier
										</label>
										<select className='w-full p-2 border rounded-md focus:ring-1 focus:ring-brand-blue bg-white'>
											<option
												disabled
												selected
											>
												Select a supplier...
											</option>
											<option>Global Fabrics Inc.</option>
											<option>Silk Road Weavers</option>
											<option>Cotton Mills Co.</option>
										</select>
									</div>
									<div className='space-y-2'>
										<label className='text-sm font-medium'>
											Expected Delivery
										</label>
										<Input type='date' />
									</div>
									<div className='col-span-2 space-y-2'>
										<label className='text-sm font-medium'>
											Notes / Terms
										</label>
										<textarea
											className='w-full min-h-[80px] p-3 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue'
											placeholder='Any special instructions for the supplier...'
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className='flex flex-row items-center justify-between'>
								<CardTitle>Line Items</CardTitle>
								<Button
									variant='outline'
									size='sm'
								>
									<Plus className='w-4 h-4 mr-2' />
									Add Item
								</Button>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>
												Product / Description
											</TableHead>
											<TableHead className='w-[100px] text-right'>
												Qty
											</TableHead>
											<TableHead className='w-[150px] text-right'>
												Unit Price
											</TableHead>
											<TableHead className='w-[150px] text-right'>
												Total
											</TableHead>
											<TableHead className='w-[50px]'></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{/* Empty State for creation */}
										<TableRow>
											<TableCell>
												<Input placeholder='Search or type item...' />
											</TableCell>
											<TableCell>
												<Input
													type='number'
													className='text-right'
													placeholder='0'
												/>
											</TableCell>
											<TableCell>
												<Input
													type='number'
													className='text-right'
													placeholder='0.00'
												/>
											</TableCell>
											<TableCell className='text-right font-medium align-middle'>
												රු0.00
											</TableCell>
											<TableCell>
												<Button
													variant='ghost'
													size='icon'
													className='text-red-500 hover:text-red-700'
												>
													<Trash2 className='w-4 h-4' />
												</Button>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>

								<div className='mt-6 border-t pt-4 flex flex-col items-end space-y-2'>
									<div className='flex justify-between w-64 text-lg font-bold'>
										<span>Total:</span>
										<span>රු0.00</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle>Actions</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3'>
								<Button className='w-full bg-black hover:bg-zinc-800 text-white'>
									<Save className='w-4 h-4 mr-2' />
									Save as Draft
								</Button>
								<RoleGuard allowedRoles={['admin']}>
									<Button className='w-full bg-green-600 hover:bg-green-700 text-white'>
										Approve & Send PO
									</Button>
								</RoleGuard>
								<Button
									variant='outline'
									className='w-full text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200'
									onClick={() => router.back()}
								>
									Discard
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</RoleGuard>
	);
}
