import { useState } from 'react';
import {
	Search,
	Filter,
	MoreVertical,
	ArrowLeftRight,
	ClipboardEdit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import InventoryAdjustDialog from '@/components/erp/InventoryAdjustDialog';
import InventoryTransferDialog from '@/components/erp/InventoryTransferDialog';
import { products } from '@/data/mockData';

const ERPInventory = () => {
	const [selectedItem, setSelectedItem] = useState<any>(null);
	const [adjustOpen, setAdjustOpen] = useState(false);
	const [transferOpen, setTransferOpen] = useState(false);

	const handleAdjustClick = (item: any) => {
		setSelectedItem(item);
		setAdjustOpen(true);
	};

	const handleTransferClick = (item: any) => {
		setSelectedItem(item);
		setTransferOpen(true);
	};

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold font-display text-foreground'>
						Inventory Management
					</h1>
					<p className='text-sm text-muted-foreground'>
						Track stock levels across all locations
					</p>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline'>Stock Take</Button>
					<Button>Receive Stock</Button>
				</div>
			</div>

			<div className='flex items-center gap-4'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Search inventory...'
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
									SKU
								</th>
								<th className='text-left py-3 px-4 text-muted-foreground font-medium'>
									Product Name
								</th>
								<th className='text-left py-3 px-4 text-muted-foreground font-medium'>
									Location
								</th>
								<th className='text-right py-3 px-4 text-muted-foreground font-medium'>
									Stock Level
								</th>
								<th className='text-right py-3 px-4 text-muted-foreground font-medium'>
									Status
								</th>
								<th className='w-[50px]'></th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr
									key={product.id}
									className='border-b border-border/50 hover:bg-muted/50 transition-colors'
								>
									<td className='py-3 px-4 font-medium text-muted-foreground'>
										SKU-{product.id}
									</td>
									<td className='py-3 px-4 font-medium text-foreground'>
										{product.name}
									</td>
									<td className='py-3 px-4 text-muted-foreground'>
										Main Store
									</td>
									<td className='py-3 px-4 text-right font-medium'>
										{product.stock}
									</td>
									<td className='py-3 px-4 text-right'>
										<Badge
											variant={
												product.stock > 20
													? 'default'
													: product.stock > 0
														? 'secondary'
														: 'destructive'
											}
											className='text-[10px]'
										>
											{product.stock > 20
												? 'In Stock'
												: product.stock > 0
													? 'Low Stock'
													: 'Out of Stock'}
										</Badge>
									</td>
									<td className='py-3 px-4'>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant='ghost'
													size='icon'
													className='h-8 w-8'
												>
													<MoreVertical className='h-4 w-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuLabel>
													Actions
												</DropdownMenuLabel>
												<DropdownMenuItem
													onClick={() =>
														handleAdjustClick(
															product,
														)
													}
												>
													<ClipboardEdit className='mr-2 h-4 w-4' />{' '}
													Adjust Stock
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleTransferClick(
															product,
														)
													}
												>
													<ArrowLeftRight className='mr-2 h-4 w-4' />{' '}
													Transfer Stock
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem>
													View History
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</CardContent>
			</Card>

			{/* Dialogs */}
			<Dialog
				open={adjustOpen}
				onOpenChange={setAdjustOpen}
			>
				<InventoryAdjustDialog
					item={selectedItem}
					onClose={() => setAdjustOpen(false)}
					onConfirm={(data) => console.log('Adjust confirm:', data)}
				/>
			</Dialog>

			<Dialog
				open={transferOpen}
				onOpenChange={setTransferOpen}
			>
				<InventoryTransferDialog
					item={selectedItem}
					onClose={() => setTransferOpen(false)}
					onConfirm={(data) => console.log('Transfer confirm:', data)}
				/>
			</Dialog>
		</div>
	);
};

export default ERPInventory;
