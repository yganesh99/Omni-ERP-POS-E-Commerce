import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/mockData";

const cartItems = [
  { product: products[0], quantity: 2 },
  { product: products[1], quantity: 1 },
  { product: products[4], quantity: 1 },
];

const Cart = () => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </Link>

      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 bg-card rounded-xl border border-border p-4">
              <img src={product.image} alt={product.name} className="w-24 h-24 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{product.category}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Minus className="h-3 w-3" /></Button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="h-3 w-3" /></Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">${(product.price * quantity).toFixed(2)}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border p-6 h-fit">
          <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span className="text-foreground">${tax.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
            <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout">
            <Button className="w-full mt-6" size="lg">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
