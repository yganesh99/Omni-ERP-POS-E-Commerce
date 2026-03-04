'use client';

import { usePosStore } from '@/app/pos/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { CartItemCard } from './CartItemCard';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export function CartPanel() {
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(false);
	const { cart, session, clearCart } = usePosStore();
	// Using primitive alert since shadcn toast is not available.

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className='hidden lg:flex flex-col w-96 border-l border-border bg-background h-[calc(100vh-64px)] fixed right-0 top-16' />
		);
	}

	const total = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	const handleCheckout = async () => {
		if (!session) {
			alert('No active register session!');
			return;
		}

		setLoading(true);
		try {
			const formattedItems = cart.map((item) => ({
				productId: item.id,
				quantity: item.quantity,
			}));

			await api.post('/pos', {
				storeId: session.storeId,
				sessionId: session._id,
				items: formattedItems,
				paymentMethod: 'cash', // Hardcoded as placeholder
			});

			alert('Order successfully placed!');
			clearCart();
		} catch (err: any) {
			console.error(err);
			alert(err.response?.data?.message || 'Failed to complete order');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='hidden lg:flex flex-col w-96 border-l border-border bg-background h-[calc(100vh-64px)] fixed right-0 top-16'>
			<div className='p-4 border-b border-border bg-muted/30'>
				<h2 className='font-bold gap-2 flex items-center text-lg'>
					<ShoppingCart className='h-5 w-5' /> Current Order
				</h2>
			</div>

			<ScrollArea className='flex-1'>
				{cart.length === 0 ? (
					<div className='p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full gap-2'>
						<ShoppingCart className='h-10 w-10 opacity-20' />
						<p>Cart is empty</p>
					</div>
				) : (
					<div className='flex flex-col'>
						{cart.map((item) => (
							<CartItemCard
								key={item.id}
								item={item}
							/>
						))}
					</div>
				)}
			</ScrollArea>

			<div className='p-4 border-t border-border bg-background space-y-4'>
				<div className='flex justify-between items-center text-lg font-bold'>
					<span>Total</span>
					<span>රු{total.toFixed(2)}</span>
				</div>
				<Button
					className='w-full min-h-[48px] text-lg font-bold touch-manipulation'
					size='lg'
					disabled={cart.length === 0 || loading || !session}
					onClick={handleCheckout}
				>
					{loading ? 'Processing...' : `Charge රු${total.toFixed(2)}`}
				</Button>
			</div>
		</div>
	);
}
