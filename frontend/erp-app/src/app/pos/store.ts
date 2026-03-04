import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
	id: string;
	name: string;
	price: number;
	image: string;
	barcode: string;
	category: string;
}

export interface CartItem extends Product {
	quantity: number;
}

export interface Register {
	_id: string;
	name: string;
	storeId: string;
}

export interface RegisterSession {
	_id: string;
	registerId: string;
	storeId: string;
	status: string;
}

interface PosState {
	cart: CartItem[];
	register: Register | null;
	session: RegisterSession | null;
	addItem: (product: Product) => void;
	removeItem: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
	setRegister: (register: Register | null) => void;
	setSession: (session: RegisterSession | null) => void;
}

export const usePosStore = create<PosState>()(
	persist(
		(set, get) => ({
			cart: [],
			register: null,
			session: null,
			addItem: (product) => {
				const { cart } = get();
				const existingItem = cart.find(
					(item) => item.id === product.id,
				);
				if (existingItem) {
					set({
						cart: cart.map((item) =>
							item.id === product.id
								? { ...item, quantity: item.quantity + 1 }
								: item,
						),
					});
				} else {
					set({ cart: [...cart, { ...product, quantity: 1 }] });
				}
			},
			removeItem: (productId) => {
				set({
					cart: get().cart.filter((item) => item.id !== productId),
				});
			},
			updateQuantity: (productId, quantity) => {
				if (quantity <= 0) {
					get().removeItem(productId);
					return;
				}
				set({
					cart: get().cart.map((item) =>
						item.id === productId ? { ...item, quantity } : item,
					),
				});
			},
			clearCart: () => set({ cart: [] }),
			setRegister: (register) => set({ register }),
			setSession: (session) => set({ session }),
		}),
		{
			name: 'pos-cart-storage',
		},
	),
);
