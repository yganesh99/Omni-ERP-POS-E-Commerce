'use client';

import { usePosStore } from '@/app/pos/store';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CartItemCard } from './CartItemCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';

export function CartDrawer() {
	const [mounted, setMounted] = useState(false);
	const cart = usePosStore((state) => state.cart);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const total = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					className='fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg lg:hidden touch-manipulation z-40'
					size='icon'
				>
					<div className='relative'>
						<ShoppingCart className='h-6 w-6' />
						{itemCount > 0 && (
							<Badge
								variant='destructive'
								className='absolute -top-3 -right-3 px-1.5 min-w-[20px] h-5 flex items-center justify-center'
							>
								{itemCount}
							</Badge>
						)}
					</div>
				</Button>
			</SheetTrigger>
			<SheetContent
				side='bottom'
				className='h-[85vh] flex flex-col p-0 sm:max-w-none'
			>
				<SheetHeader className='p-4 border-b text-left'>
					<SheetTitle className='flex items-center gap-2'>
						<ShoppingCart className='h-5 w-5' /> Current Order
					</SheetTitle>
				</SheetHeader>

				<ScrollArea className='flex-1'>
					{cart.length === 0 ? (
						<div className='p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full gap-2'>
							<ShoppingCart className='h-10 w-10 opacity-20' />
							<p>Cart is empty</p>
						</div>
					) : (
						<div className='flex flex-col pb-4'>
							{cart.map((item) => (
								<CartItemCard
									key={item.id}
									item={item}
								/>
							))}
						</div>
					)}
				</ScrollArea>

				<div className='p-4 border-t bg-background space-y-4 mt-auto'>
					<div className='flex justify-between items-center text-lg font-bold'>
						<span>Total</span>
						<span>රු{total.toFixed(2)}</span>
					</div>
					<Button
						className='w-full min-h-[48px] text-lg font-bold touch-manipulation'
						size='lg'
						disabled={cart.length === 0}
					>
						Charge රු{total.toFixed(2)}
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
