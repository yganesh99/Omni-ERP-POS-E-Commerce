'use client';

import { usePosStore, SelectedCustomer } from '@/app/pos/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, X, User } from 'lucide-react';
import { CartItemCard } from './CartItemCard';
import { useEffect, useState, useRef, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export function CartPanel() {
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [quoteLoading, setQuoteLoading] = useState(false);
	const [customerSearch, setCustomerSearch] = useState('');
	const [customerResults, setCustomerResults] = useState<any[]>([]);
	const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
	const customerDebounceRef = useRef<NodeJS.Timeout | null>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const {
		cart,
		session,
		clearCart,
		paymentMethod,
		setPaymentMethod,
		selectedCustomer,
		setSelectedCustomer,
		discountType,
		discountValue,
		setDiscount,
	} = usePosStore();

	useEffect(() => {
		setMounted(true);
	}, []);

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setShowCustomerDropdown(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Debounced customer search
	const searchCustomers = useCallback(async (query: string) => {
		if (!query.trim()) {
			setCustomerResults([]);
			setShowCustomerDropdown(false);
			return;
		}
		try {
			const res = await api.get('/customers', {
				params: { search: query.trim(), limit: 10 },
			});
			const data = res.data.items || res.data.data || res.data || [];
			setCustomerResults(Array.isArray(data) ? data : []);
			setShowCustomerDropdown(true);
		} catch (err) {
			console.error('Failed to search customers:', err);
		}
	}, []);

	useEffect(() => {
		if (customerDebounceRef.current) {
			clearTimeout(customerDebounceRef.current);
		}
		customerDebounceRef.current = setTimeout(() => {
			searchCustomers(customerSearch);
		}, 300);
		return () => {
			if (customerDebounceRef.current) {
				clearTimeout(customerDebounceRef.current);
			}
		};
	}, [customerSearch, searchCustomers]);

	const handleSelectCustomer = (customer: any) => {
		setSelectedCustomer({
			_id: customer._id,
			name: customer.name,
			phone: customer.phone,
			email: customer.email,
		});
		setCustomerSearch('');
		setShowCustomerDropdown(false);
	};

	if (!mounted) {
		return (
			<div className='hidden lg:flex flex-col w-96 border-l border-border bg-background h-[calc(100vh-64px)] fixed right-0 top-16' />
		);
	}

	// Subtotal (excl. tax) — matches backend/invoice
	const subtotal = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	// Tax breakdown by rate (same as invoice calculation)
	const taxByRate = cart.reduce<Record<number, number>>((acc, item) => {
		const rate = item.taxRate ?? 0;
		const lineTax = item.price * item.quantity * (rate / 100);
		acc[rate] = (acc[rate] ?? 0) + lineTax;
		return acc;
	}, {});
	const taxBreakdown = Object.entries(taxByRate)
		.filter(([, amount]) => amount > 0)
		.sort(([a], [b]) => Number(a) - Number(b));
	const taxAmount = taxBreakdown.reduce((sum, [, amt]) => sum + amt, 0);

	let discountAmount = 0;
	if (discountType === 'percentage' && discountValue > 0) {
		discountAmount = (subtotal * discountValue) / 100;
	} else if (discountType === 'fixed' && discountValue > 0) {
		discountAmount = discountValue;
	}
	discountAmount = Math.min(discountAmount, subtotal); // Cap at subtotal

	// Total = Subtotal + Tax - Discount (matches invoice)
	const total = subtotal + taxAmount - discountAmount;

	const handleCheckout = async () => {
		if (!session) {
			toast.error('No active register session!');
			return;
		}

		setLoading(true);
		try {
			const formattedItems = cart.map((item) => ({
				productId: item.id,
				quantity: item.quantity,
			}));

			const payload: any = {
				storeId: session.storeId,
				sessionId: session._id,
				items: formattedItems,
				paymentMethod: paymentMethod,
			};

			if (selectedCustomer) {
				payload.customerId = selectedCustomer._id;
			}
			if (discountType && discountValue > 0) {
				payload.discountType = discountType;
				payload.discountValue = discountValue;
			}

			const res = await api.post('/pos/order', payload);

			toast.success('Order successfully placed!');
			clearCart();

			// Try to automatically open invoice PDF
			try {
				const orderId = res.data?._id || res.data?.data?._id;
				if (orderId) {
					const invoiceRes = await api.get(
						`/orders/${orderId}/invoice`,
						{
							responseType: 'blob',
						},
					);
					const blob = new Blob([invoiceRes.data], {
						type: 'application/pdf',
					});
					const url = window.URL.createObjectURL(blob);
					window.open(url, '_blank');
				}
			} catch (pdfErr) {
				console.error('Failed to generate PDF invoice', pdfErr);
				toast.error('Failed to load invoice PDF');
			}
		} catch (err: any) {
			console.error(err);
			toast.error(
				err.response?.data?.message || 'Failed to complete order',
			);
		} finally {
			setLoading(false);
		}
	};

	const handleGenerateQuote = async () => {
		if (!session) {
			toast.error('No active register session!');
			return;
		}

		if (cart.length === 0) {
			toast.error('Cart is empty');
			return;
		}

		setQuoteLoading(true);
		try {
			const formattedItems = cart.map((item) => ({
				productId: item.id,
				quantity: item.quantity,
			}));

			const payload: any = {
				storeId: session.storeId,
				items: formattedItems,
			};

			if (selectedCustomer) {
				payload.customerId = selectedCustomer._id;
			}
			if (discountType && discountValue > 0) {
				payload.discountType = discountType;
				payload.discountValue = discountValue;
			}

			const quoteRes = await api.post('/pos/quote', payload, {
				responseType: 'blob',
			});

			toast.success('Quote generated');

			const blob = new Blob([quoteRes.data], {
				type: 'application/pdf',
			});
			const url = window.URL.createObjectURL(blob);
			window.open(url, '_blank');
		} catch (err: any) {
			console.error(err);
			toast.error(
				err.response?.data?.message || 'Failed to generate quote',
			);
		} finally {
			setQuoteLoading(false);
		}
	};

	return (
		<div className='hidden lg:flex flex-col w-96 border-l border-border bg-background h-[calc(100vh-64px)] fixed right-0 top-16'>
			<div className='p-4 border-b border-border bg-muted/30'>
				<h2 className='font-bold gap-2 flex items-center text-lg'>
					<ShoppingCart className='h-5 w-5' /> Current Order
				</h2>
			</div>

			{/* Customer Selection */}
			<div
				className='p-3 border-b border-border'
				ref={dropdownRef}
			>
				{selectedCustomer ? (
					<div className='flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2'>
						<div className='flex items-center gap-2 min-w-0'>
							<User className='h-4 w-4 text-zinc-500 shrink-0' />
							<div className='min-w-0'>
								<p className='text-sm font-medium truncate'>
									{selectedCustomer.name}
								</p>
								{selectedCustomer.phone && (
									<p className='text-xs text-muted-foreground'>
										{selectedCustomer.phone}
									</p>
								)}
							</div>
						</div>
						<Button
							variant='ghost'
							size='icon'
							className='h-6 w-6 shrink-0'
							onClick={() => setSelectedCustomer(null)}
						>
							<X className='h-3 w-3' />
						</Button>
					</div>
				) : (
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
						<Input
							type='text'
							placeholder='Search customer (optional)...'
							value={customerSearch}
							onChange={(e) => setCustomerSearch(e.target.value)}
							className='pl-9 h-9 text-sm bg-zinc-50 border-zinc-200'
						/>
						{showCustomerDropdown && customerResults.length > 0 && (
							<div className='absolute z-50 top-full left-0 right-0 bg-white border border-zinc-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto'>
								{customerResults.map((c) => (
									<button
										key={c._id}
										className='w-full text-left px-3 py-2 hover:bg-zinc-50 transition-colors text-sm border-b border-zinc-100 last:border-b-0'
										onClick={() => handleSelectCustomer(c)}
									>
										<p className='font-medium'>{c.name}</p>
										{c.phone && (
											<p className='text-xs text-muted-foreground'>
												{c.phone}
											</p>
										)}
									</button>
								))}
							</div>
						)}
					</div>
				)}
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
				{/* Discount Controls */}
				<div className='flex items-center gap-2'>
					<Button
						variant={
							discountType === 'percentage'
								? 'default'
								: 'outline'
						}
						size='sm'
						className='w-12 h-9 px-0 disabled:opacity-50'
						disabled={cart.length === 0}
						onClick={() =>
							setDiscount(
								discountType === 'percentage'
									? null
									: 'percentage',
								discountType === 'percentage'
									? 0
									: discountValue,
							)
						}
					>
						%
					</Button>
					<Button
						variant={
							discountType === 'fixed' ? 'default' : 'outline'
						}
						size='sm'
						className='w-12 h-9 px-0 disabled:opacity-50'
						disabled={cart.length === 0}
						onClick={() =>
							setDiscount(
								discountType === 'fixed' ? null : 'fixed',
								discountType === 'fixed' ? 0 : discountValue,
							)
						}
					>
						Rs
					</Button>
					<Input
						type='number'
						min='0'
						placeholder='Discount value'
						value={discountValue || ''}
						onChange={(e) =>
							setDiscount(
								discountType || 'percentage',
								Number(e.target.value),
							)
						}
						disabled={cart.length === 0 || !discountType}
						className='h-9 disabled:opacity-50'
					/>
				</div>

				<div className='space-y-1.5'>
					<div className='flex justify-between items-center text-sm text-muted-foreground'>
						<span>Subtotal</span>
						<span>රු{subtotal.toFixed(2)}</span>
					</div>
					{discountAmount > 0 && (
						<div className='flex justify-between items-center text-sm text-green-600 font-medium'>
							<span>Discount</span>
							<span>-රු{discountAmount.toFixed(2)}</span>
						</div>
					)}
					{taxBreakdown.length > 0 ? (
						taxBreakdown.map(([rate, amount]) => (
							<div
								key={rate}
								className='flex justify-between items-center text-sm text-muted-foreground'
							>
								<span>Tax ({rate}%)</span>
								<span>රු{amount.toFixed(2)}</span>
							</div>
						))
					) : taxAmount > 0 ? (
						<div className='flex justify-between items-center text-sm text-muted-foreground'>
							<span>Tax</span>
							<span>රු{taxAmount.toFixed(2)}</span>
						</div>
					) : null}
					<div className='flex justify-between items-center text-lg font-bold pt-2 border-t border-border/50'>
						<span>Total</span>
						<span>රු{total.toFixed(2)}</span>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Button
						variant={
							paymentMethod === 'cash' ? 'default' : 'outline'
						}
						className='flex-1 h-10 touch-manipulation'
						onClick={() => setPaymentMethod('cash')}
					>
						Cash
					</Button>
					<Button
						variant={
							paymentMethod === 'card' ? 'default' : 'outline'
						}
						className='flex-1 h-10 touch-manipulation'
						onClick={() => setPaymentMethod('card')}
					>
						Card
					</Button>
					<Button
						variant={
							paymentMethod === 'credit' ? 'default' : 'outline'
						}
						className='flex-1 h-10 touch-manipulation'
						onClick={() => setPaymentMethod('credit')}
					>
						Credit
					</Button>
				</div>
				{/* <div className='flex justify-between items-center text-lg font-bold'>
					<span>Total</span>
					<span>රු{total.toFixed(2)}</span>
				</div> */}
				<div className='space-y-2'>
					<Button
						className='w-full min-h-[48px] text-lg font-bold touch-manipulation'
						size='lg'
						disabled={cart.length === 0 || loading || !session}
						onClick={handleCheckout}
					>
						{loading
							? 'Processing...'
							: `Charge රු${total.toFixed(2)}`}
					</Button>
					<Button
						variant='outline'
						className='w-full h-10 touch-manipulation'
						disabled={cart.length === 0 || quoteLoading || !session}
						onClick={handleGenerateQuote}
					>
						{quoteLoading
							? 'Generating quote...'
							: 'Generate Quote'}
					</Button>
				</div>
			</div>
		</div>
	);
}
