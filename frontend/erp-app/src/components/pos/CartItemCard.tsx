import { CartItem, usePosStore } from '@/app/pos/store';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

export function CartItemCard({ item }: { item: CartItem }) {
	const { updateQuantity, removeItem } = usePosStore();

	return (
		<div className='flex items-center gap-3 p-3 border-b border-border bg-card'>
			<img
				src={item.image}
				alt={item.name}
				className='w-12 h-12 rounded object-cover'
			/>
			<div className='flex-1 min-w-0'>
				<h4 className='font-medium text-sm truncate'>{item.name}</h4>
				<div className='text-sm font-bold text-primary'>
					රු{(item.price * item.quantity).toFixed(2)}
				</div>
			</div>
			<div className='flex items-center gap-2'>
				<div className='flex items-center bg-muted rounded-md border border-border'>
					<Button
						variant='ghost'
						size='icon'
						className='h-8 w-8 rounded-r-none touch-manipulation'
						onClick={() =>
							updateQuantity(item.id, item.quantity - 1)
						}
					>
						<Minus className='h-3 w-3' />
					</Button>
					<div className='w-8 text-center text-sm font-medium'>
						{item.quantity}
					</div>
					<Button
						variant='ghost'
						size='icon'
						className='h-8 w-8 rounded-l-none touch-manipulation'
						onClick={() =>
							updateQuantity(item.id, item.quantity + 1)
						}
					>
						<Plus className='h-3 w-3' />
					</Button>
				</div>
				<Button
					variant='ghost'
					size='icon'
					className='h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 touch-manipulation'
					onClick={() => removeItem(item.id)}
				>
					<Trash2 className='h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
