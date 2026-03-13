'use client';

import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	refundPosOrder,
	getOrderReturns,
	type Order,
	type OrderReturnsResponse,
} from '@/lib/orderApi';

interface RefundModalProps {
	order: Order | null;
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function RefundModal({
	order,
	open,
	onClose,
	onSuccess,
}: RefundModalProps) {
	const [returnInfo, setReturnInfo] = useState<OrderReturnsResponse | null>(null);
	const [loadingReturnInfo, setLoadingReturnInfo] = useState(false);
	const [quantities, setQuantities] = useState<Record<string, number>>({});
	const [reason, setReason] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch order return info when modal opens (remaining quantities)
	useEffect(() => {
		if (!order || !open) {
			setReturnInfo(null);
			return;
		}
		let cancelled = false;
		setLoadingReturnInfo(true);
		setError(null);
		getOrderReturns(order._id)
			.then((data) => {
				if (!cancelled) {
					setReturnInfo(data);
					const initial: Record<string, number> = {};
					data.order.items.forEach((item) => {
						const id = String(item.productId);
						initial[id] = 0;
					});
					setQuantities(initial);
					setReason('');
				}
			})
			.catch((err) => {
				if (!cancelled)
					setError(
						err?.response?.data?.message ?? 'Failed to load return info.',
					);
			})
			.finally(() => {
				if (!cancelled) setLoadingReturnInfo(false);
			});
		return () => {
			cancelled = true;
		};
	}, [order?._id, open]);

	const getRemaining = (productId: string): number => {
		if (!returnInfo) return 0;
		const item = returnInfo.order.items.find(
			(i) => String(i.productId) === String(productId),
		);
		if (!item) return 0;
		const returned = returnInfo.returnedByProduct[String(productId)] ?? 0;
		return Math.max(0, item.quantity - returned);
	};

	const setQty = (productId: string, value: number) => {
		const num = Math.max(0, Math.min(value, getRemaining(productId)));
		setQuantities((prev) => ({ ...prev, [productId]: num }));
	};

	const totalRemaining = returnInfo
		? returnInfo.order.items.reduce(
				(sum, item) => sum + getRemaining(String(item.productId)),
				0,
			)
		: 0;
	const totalSelected = Object.values(quantities).reduce((a, b) => a + b, 0);
	const isFullRefund = totalRemaining > 0 && totalSelected >= totalRemaining;

	const handleSubmit = async () => {
		if (!order) return;
		const items = Object.entries(quantities)
			.filter(([, qty]) => qty > 0)
			.map(([productId, quantity]) => ({ productId, quantity }));
		if (items.length === 0) {
			setError('Select at least one item and quantity to return.');
			return;
		}
		setError(null);
		setSubmitting(true);
		try {
			await refundPosOrder(order._id, items, reason.trim() || undefined);
			onSuccess();
			onClose();
		} catch (err: unknown) {
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response
					?.data?.message ?? 'Return/refund failed. Please try again.';
			setError(msg);
		} finally {
			setSubmitting(false);
		}
	};

	if (!order) return null;

	const displayOrder = returnInfo?.order ?? order;

	const formatAmount = (amount: number) =>
		`රු ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Return / Refund</DialogTitle>
					<DialogDescription>
						Select items and quantities to return for order{' '}
						<strong>{displayOrder.orderNumber}</strong>. Partial returns are
						allowed; refund is when the whole order is returned. Inventory will
						be restocked.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-2">
					{loadingReturnInfo ? (
						<div className="py-6 text-center text-zinc-500 text-sm">
							Loading…
						</div>
					) : totalRemaining === 0 ? (
						<div className="py-4 text-center text-zinc-600 bg-zinc-100 rounded-lg">
							This order is fully refunded. No items left to return.
						</div>
					) : (
						<div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
							{displayOrder.items.map((item) => {
								const id = String(item.productId);
								const remaining = getRemaining(id);
								const maxQty = remaining;
								const qty = quantities[id] ?? 0;
								if (remaining === 0) return null;
								return (
									<div
										key={id}
										className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50/50 p-3"
									>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-zinc-900 truncate">
												{item.name}
											</p>
											<p className="text-sm text-zinc-500">
												{formatAmount(item.unitPrice)} × {remaining} returnable
												{returnInfo &&
													(returnInfo.returnedByProduct[id] ?? 0) > 0 && (
														<span className="text-zinc-400">
															{' '}
															(already returned{' '}
															{returnInfo.returnedByProduct[id]})
														</span>
													)}
											</p>
										</div>
										<div className="flex items-center gap-2 flex-shrink-0">
											<label className="text-sm text-zinc-600">Qty:</label>
											<Input
												type="number"
												min={0}
												max={maxQty}
												value={qty}
												onChange={(e) =>
													setQty(id, parseInt(e.target.value, 10) || 0)
												}
												className="w-16 h-8 text-center"
											/>
											<span className="text-xs text-zinc-400">/ {maxQty}</span>
										</div>
									</div>
								);
							})}
						</div>
					)}

					<div>
						<label className="text-sm font-medium text-zinc-700">
							Reason (optional)
						</label>
						<Input
							placeholder="e.g. Customer request, defective"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							className="mt-1"
						/>
					</div>

					{error && (
						<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
							{error}
						</p>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={submitting}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleSubmit}
						disabled={
							submitting ||
							loadingReturnInfo ||
							totalRemaining === 0 ||
							totalSelected === 0
						}
					>
						{submitting
							? 'Processing…'
							: isFullRefund
								? 'Refund order'
								: 'Process return'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
