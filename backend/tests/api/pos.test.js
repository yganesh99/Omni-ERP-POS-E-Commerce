/**
 * tests/api/pos.test.js
 *
 * Endpoint-level tests for the POS API:
 *   POST /api/pos/order   — Create a POS order
 *   POST /api/pos/refund  — Refund a POS order
 *
 * POS is the most complex endpoint:
 *   - Requires products and (optionally) customers to exist
 *   - Split payments must sum to order total
 *   - Allowed roles: admin only
 */

'use strict';

require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const db = require('../helpers/db');
const { createUserAndLogin } = require('../helpers/auth');
const { createApiClient } = require('../helpers/apiClient');

// ─── DB Lifecycle ────────────────────────────────────────────────────────────

beforeAll(async () => {
	await db.connect();
});

beforeEach(async () => {
	await db.clearCollections();
});

afterAll(async () => {
	await db.disconnect();
});

// ─── Shared fixtures ─────────────────────────────────────────────────────────

/** Create a product and stock it up using /inventory/adjust, return storeId + productId */
async function createPrerequisites(api) {
	const Store = require('../../src/models/store.model');
	const Inventory = require('../../src/models/inventory.model');

	// Insert store directly (avoids needing to know the exact Joi schema for stores)
	const store = await Store.create({
		name: 'Test Store',
		code: 'TST',
		isActive: true,
	});
	const storeId = store._id.toHexString();

	// Create a product via API
	const prodRes = await api.post('/api/products').send({
		sku: `POS-${Date.now()}`,
		name: 'POS Product',
		posPrice: 20,
		ecommercePrice: 22,
		visibility: 'pos_only',
	});
	if (prodRes.status !== 201) {
		throw new Error(
			`Seed product failed: ${prodRes.status} ${JSON.stringify(prodRes.body)}`,
		);
	}
	const productId = prodRes.body._id || prodRes.body.id;

	// Seed inventory directly so the POS order has stock to draw from
	await Inventory.create({ storeId, productId, quantity: 100 });

	return { storeId, productId };
}

// ─── POST /api/pos/order — Cash payment ──────────────────────────────────────

describe('POST /api/pos/order', () => {
	it('201 — valid cash order with single item', async () => {
		const { accessToken } = await createUserAndLogin({ role: 'admin' });
		const api = createApiClient(accessToken);
		const { storeId, productId } = await createPrerequisites(api);

		const res = await api.post('/api/pos/order').send({
			storeId,
			items: [{ productId, quantity: 2 }],
			paymentMethod: 'cash',
		});

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('_id');
		expect(res.body).toHaveProperty('total');
	});

	it('201 — valid order with optional customerId and notes', async () => {
		const { accessToken } = await createUserAndLogin({ role: 'admin' });
		const api = createApiClient(accessToken);
		const { storeId, productId } = await createPrerequisites(api);

		// Create customer
		const custRes = await api
			.post('/api/customers')
			.send({ name: 'POS Customer' });
		const customerId = custRes.body._id || custRes.body.id;

		const res = await api.post('/api/pos/order').send({
			storeId,
			customerId,
			items: [{ productId, quantity: 1 }],
			paymentMethod: 'card',
			notes: 'Test order note',
		});

		expect(res.status).toBe(201);
	});

	it('201 — split payment order', async () => {
		const { accessToken } = await createUserAndLogin({ role: 'admin' });
		const api = createApiClient(accessToken);
		const { storeId, productId } = await createPrerequisites(api);

		const res = await api.post('/api/pos/order').send({
			storeId,
			items: [{ productId, quantity: 2 }],
			paymentMethod: 'split',
			payments: [
				{ method: 'cash', amount: 20 },
				{ method: 'card', amount: 20 },
			],
		});

		expect(res.status).toBe(201);
	});

	// Validation failures
	const invalidOrderCases = [
		{
			label: 'missing storeId',
			body: (ids) => ({
				items: [{ productId: ids.productId, quantity: 1 }],
				paymentMethod: 'cash',
			}),
			expectedStatus: 400,
		},
		{
			label: 'missing items array',
			body: (ids) => ({ storeId: ids.storeId, paymentMethod: 'cash' }),
			expectedStatus: 400,
		},
		{
			label: 'empty items array (min: 1)',
			body: (ids) => ({
				storeId: ids.storeId,
				items: [],
				paymentMethod: 'cash',
			}),
			expectedStatus: 400,
		},
		{
			label: 'missing paymentMethod',
			body: (ids) => ({
				storeId: ids.storeId,
				items: [{ productId: ids.productId, quantity: 1 }],
			}),
			expectedStatus: 400,
		},
		{
			label: 'invalid paymentMethod enum',
			body: (ids) => ({
				storeId: ids.storeId,
				items: [{ productId: ids.productId, quantity: 1 }],
				paymentMethod: 'bitcoin',
			}),
			expectedStatus: 400,
		},
		{
			label: 'item quantity = 0 (boundary: min 1)',
			body: (ids) => ({
				storeId: ids.storeId,
				items: [{ productId: ids.productId, quantity: 0 }],
				paymentMethod: 'cash',
			}),
			expectedStatus: 400,
		},
		{
			label: 'invalid productId format (not 24-char hex)',
			body: (ids) => ({
				storeId: ids.storeId,
				items: [{ productId: 'short', quantity: 1 }],
				paymentMethod: 'cash',
			}),
			expectedStatus: 400,
		},
		{
			label: 'invalid storeId format (not 24-char hex)',
			body: (ids) => ({
				storeId: 'bad',
				items: [{ productId: ids.productId, quantity: 1 }],
				paymentMethod: 'cash',
			}),
			expectedStatus: 400,
		},
	];

	test.each(invalidOrderCases)(
		'$expectedStatus — $label',
		async ({ body, expectedStatus }) => {
			const { accessToken } = await createUserAndLogin({ role: 'admin' });
			const api = createApiClient(accessToken);
			const ids = await createPrerequisites(api);

			const res = await api.post('/api/pos/order').send(body(ids));
			expect(res.status).toBe(expectedStatus);
		},
	);

	it('4xx — non-existent productId (valid ObjectId format)', async () => {
		const { accessToken } = await createUserAndLogin({ role: 'admin' });
		const api = createApiClient(accessToken);
		const { storeId } = await createPrerequisites(api);

		const fakeProductId = new mongoose.Types.ObjectId().toHexString();
		const res = await api.post('/api/pos/order').send({
			storeId,
			items: [{ productId: fakeProductId, quantity: 1 }],
			paymentMethod: 'cash',
		});

		expect(res.status).toBeGreaterThanOrEqual(400);
		expect(res.status).toBeLessThan(500);
	});

	// RBAC
	it('401 — no token', async () => {
		const res = await request(app).post('/api/pos/order').send({});
		expect(res.status).toBe(401);
	});

	it('403 — cashier role is not allowed on this route', async () => {
		const { accessToken } = await createUserAndLogin({ role: 'cashier' });
		const api = createApiClient(accessToken);
		const res = await api.post('/api/pos/order').send({
			storeId: new mongoose.Types.ObjectId(),
			items: [{ productId: new mongoose.Types.ObjectId(), quantity: 1 }],
			paymentMethod: 'cash',
		});
		expect(res.status).toBe(403);
	});
});

// ─── POST /api/pos/refund ─────────────────────────────────────────────────────

describe('POST /api/pos/refund', () => {
	/** Helper: create an order and return its ID */
	async function placeOrder(api, storeId, productId) {
		const res = await api.post('/api/pos/order').send({
			storeId,
			items: [{ productId, quantity: 3 }],
			paymentMethod: 'cash',
		});
		if (res.status !== 201) {
			throw new Error(
				`placeOrder failed: ${res.status} — ${JSON.stringify(res.body)}`,
			);
		}
		return res.body._id || res.body.id;
	}

	it('201 — valid refund for an existing order', async () => {
		const { accessToken } = await createUserAndLogin({ role: 'admin' });
		const api = createApiClient(accessToken);
		const { storeId, productId } = await createPrerequisites(api);
		const orderId = await placeOrder(api, storeId, productId);

		const res = await api.post('/api/pos/refund').send({
			orderId,
			items: [{ productId, quantity: 1 }],
			reason: 'Customer changed mind',
		});

		expect(res.status).toBe(201);
	});

	// Validation failures
	const invalidRefundCases = [
		{
			label: 'missing orderId',
			body: {
				items: [
					{ productId: new mongoose.Types.ObjectId(), quantity: 1 },
				],
			},
			expectedStatus: 400,
		},
		{
			label: 'missing items',
			body: { orderId: new mongoose.Types.ObjectId() },
			expectedStatus: 400,
		},
		{
			label: 'empty items array',
			body: { orderId: new mongoose.Types.ObjectId(), items: [] },
			expectedStatus: 400,
		},
		{
			label: 'item quantity = 0 (min: 1)',
			body: {
				orderId: new mongoose.Types.ObjectId(),
				items: [
					{ productId: new mongoose.Types.ObjectId(), quantity: 0 },
				],
			},
			expectedStatus: 400,
		},
		{
			label: 'invalid orderId format',
			body: {
				orderId: 'not-an-id',
				items: [
					{ productId: new mongoose.Types.ObjectId(), quantity: 1 },
				],
			},
			expectedStatus: 400,
		},
	];

	test.each(invalidRefundCases)(
		'$expectedStatus — $label',
		async ({ body, expectedStatus }) => {
			const { accessToken } = await createUserAndLogin({ role: 'admin' });
			const api = createApiClient(accessToken);
			const res = await api.post('/api/pos/refund').send(body);
			expect(res.status).toBe(expectedStatus);
		},
	);

	it('4xx — refund for non-existent orderId', async () => {
		const { accessToken } = await createUserAndLogin({ role: 'admin' });
		const api = createApiClient(accessToken);

		const res = await api.post('/api/pos/refund').send({
			orderId: new mongoose.Types.ObjectId().toHexString(),
			items: [
				{
					productId: new mongoose.Types.ObjectId().toHexString(),
					quantity: 1,
				},
			],
		});

		expect(res.status).toBeGreaterThanOrEqual(400);
		expect(res.status).toBeLessThan(500);
	});

	it('401 — no token', async () => {
		const res = await request(app).post('/api/pos/refund').send({});
		expect(res.status).toBe(401);
	});

	it('403 — cashier role is not allowed', async () => {
		const { accessToken } = await createUserAndLogin({ role: 'cashier' });
		const api = createApiClient(accessToken);
		const res = await api.post('/api/pos/refund').send({
			orderId: new mongoose.Types.ObjectId(),
			items: [{ productId: new mongoose.Types.ObjectId(), quantity: 1 }],
		});
		expect(res.status).toBe(403);
	});
});
