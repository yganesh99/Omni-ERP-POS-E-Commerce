import api from './api';

export interface OrderItem {
	productId: string;
	sku: string;
	name: string;
	quantity: number;
	unitPrice: number;
	taxRate: number;
	taxAmount: number;
	lineTotal: number;
}

export interface PaymentDetail {
	method: 'cash' | 'card' | 'qr' | 'credit';
	amount: number;
	reference?: string;
}

export interface Order {
	_id: string;
	storeId: any;
	customerId?: any;
	orderNumber: string;
	channel: 'pos' | 'ecommerce';
	status:
		| 'pending'
		| 'confirmed'
		| 'processing'
		| 'shipped'
		| 'delivered'
		| 'cancelled'
		| 'returned'
		| 'partially_returned'
		| 'refunded';
	items: OrderItem[];
	subtotal: number;
	taxAmount: number;
	totalAmount: number;
	paymentMethod: 'cash' | 'card' | 'qr' | 'split' | 'credit';
	payments: PaymentDetail[];
	creditUsed: number;
	notes?: string;
	sessionId?: string;
	createdBy?: string;
	createdAt: string;
	updatedAt: string;
}

export interface OrderListResponse {
	items: Order[];
	total: number;
	page: number;
	limit: number;
}

export async function getOrders(params?: {
	channel?: string;
	status?: string;
	customerId?: string;
	sessionId?: string;
	page?: number;
	limit?: number;
}): Promise<OrderListResponse> {
	const res = await api.get<OrderListResponse>('/orders', { params });
	return res.data;
}

export async function getOrderById(id: string): Promise<Order> {
	const res = await api.get<Order>(`/orders/${id}`);
	return res.data;
}

export async function updateOrderStatus(
	id: string,
	status: string,
): Promise<Order> {
	const res = await api.patch<Order>(`/orders/${id}/status`, { status });
	return res.data;
}

/** Request body for POS refund (POST /api/pos/refund). */
export interface RefundPosRequest {
	orderId: string;
	items: { productId: string; quantity: number }[];
	reason?: string;
}

/** Response from POS refund/return. */
export interface RefundPosResponse {
	orderId: string;
	refundTotal: number;
	returnId?: string;
	orderStatus?: string;
	isFullRefund?: boolean;
}

/** Return document (partial return) for an order. */
export interface OrderReturn {
	_id: string;
	type: string;
	orderId: string;
	storeId: string;
	items: { productId: string; quantity: number; unitPrice: number; lineTotal: number }[];
	totalAmount: number;
	reason?: string;
	status: string;
	createdAt: string;
}

/** Response from GET /pos/orders/:orderId/returns. */
export interface OrderReturnsResponse {
	order: Order;
	returns: OrderReturn[];
	returnedByProduct: Record<string, number>;
}

/**
 * Get order and its return history for computing remaining returnable quantities.
 */
export async function getOrderReturns(orderId: string): Promise<OrderReturnsResponse> {
	const res = await api.get<OrderReturnsResponse>(`/pos/orders/${orderId}/returns`);
	return res.data;
}

/**
 * Return or refund items from a POS order (register session).
 * Partial return: creates a return record, order status becomes partially_returned.
 * Full refund: when all items are returned, order status becomes refunded.
 * Admin and cashier can process returns/refunds.
 */
export async function refundPosOrder(
	orderId: string,
	items: { productId: string; quantity: number }[],
	reason?: string,
): Promise<RefundPosResponse> {
	const res = await api.post<RefundPosResponse>('/pos/refund', {
		orderId,
		items,
		...(reason && { reason }),
	});
	return res.data;
}
