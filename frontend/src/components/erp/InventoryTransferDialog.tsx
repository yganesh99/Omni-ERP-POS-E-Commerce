import { useState } from 'react';
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { stores } from '@/data/mockData';

interface InventoryTransferDialogProps {
	item: any;
	onClose: () => void;
	onConfirm: (transfer: { toStore: string; quantity: number }) => void;
}

const InventoryTransferDialog = ({
	item,
	onClose,
	onConfirm,
}: InventoryTransferDialogProps) => {
	const [toStore, setToStore] = useState('');
	const [quantity, setQuantity] = useState('1');

	const handleConfirm = () => {
		onConfirm({ toStore, quantity: parseInt(quantity) });
		onClose();
	};

	return (
		<DialogContent className='sm:max-w-[425px]'>
			<DialogHeader>
				<DialogTitle>Transfer Stock</DialogTitle>
				<DialogDescription>
					Move <strong>{item?.name}</strong> stock to another
					location.
				</DialogDescription>
			</DialogHeader>
			<div className='grid gap-4 py-4'>
				<div className='grid gap-2'>
					<Label>Source Store</Label>
					<div className='p-2 bg-muted rounded-md text-sm font-medium'>
						Main Store (Current)
					</div>
				</div>
				<div className='grid gap-2'>
					<Label htmlFor='destination'>Destination Store</Label>
					<Select onValueChange={setToStore}>
						<SelectTrigger>
							<SelectValue placeholder='Select destination' />
						</SelectTrigger>
						<SelectContent>
							{stores
								.filter((s) => s.name !== 'Main Store')
								.map((s) => (
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
				<div className='grid gap-2'>
					<Label htmlFor='quantity'>Quantity to Transfer</Label>
					<Input
						id='quantity'
						type='number'
						min='1'
						max={item?.stock}
						value={quantity}
						onChange={(e) => setQuantity(e.target.value)}
					/>
					<p className='text-[10px] text-muted-foreground'>
						Available: {item?.stock}
					</p>
				</div>
			</div>
			<DialogFooter>
				<Button
					variant='outline'
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					onClick={handleConfirm}
					disabled={!toStore || !quantity}
				>
					Transfer Stock
				</Button>
			</DialogFooter>
		</DialogContent>
	);
};

export default InventoryTransferDialog;
