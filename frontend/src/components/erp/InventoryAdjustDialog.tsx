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
import { Textarea } from '@/components/ui/textarea';

interface InventoryAdjustDialogProps {
	item: any;
	onClose: () => void;
	onConfirm: (adjustment: { quantity: number; reason: string }) => void;
}

const InventoryAdjustDialog = ({
	item,
	onClose,
	onConfirm,
}: InventoryAdjustDialogProps) => {
	const [quantity, setQuantity] = useState('0');
	const [reason, setReason] = useState('');

	const handleConfirm = () => {
		onConfirm({ quantity: parseInt(quantity), reason });
		onClose();
	};

	return (
		<DialogContent className='sm:max-w-[425px]'>
			<DialogHeader>
				<DialogTitle>Adjust Stock</DialogTitle>
				<DialogDescription>
					Manually adjust the stock level for{' '}
					<strong>{item?.name}</strong>.
				</DialogDescription>
			</DialogHeader>
			<div className='grid gap-4 py-4'>
				<div className='grid gap-2'>
					<Label>Current Stock</Label>
					<div className='p-2 bg-muted rounded-md text-sm font-medium'>
						{item?.stock} units
					</div>
				</div>
				<div className='grid gap-2'>
					<Label htmlFor='adjustment'>
						Adjustment Quantity (+/-)
					</Label>
					<Input
						id='adjustment'
						type='number'
						value={quantity}
						onChange={(e) => setQuantity(e.target.value)}
						placeholder='-5 or 10'
					/>
					<p className='text-[10px] text-muted-foreground'>
						Use negative values to reduce stock (e.g., damage,
						shrinkage).
					</p>
				</div>
				<div className='grid gap-2'>
					<Label htmlFor='reason'>Reason</Label>
					<Textarea
						id='reason'
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder='e.g. Damaged during shipping'
					/>
				</div>
			</div>
			<DialogFooter>
				<Button
					variant='outline'
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button onClick={handleConfirm}>Confirm Adjustment</Button>
			</DialogFooter>
		</DialogContent>
	);
};

export default InventoryAdjustDialog;
