import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, QrCode, Users, ArrowLeft, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/mockData";

interface CartItem {
  product: typeof products[0];
  quantity: number;
}

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const posProducts = products.filter(p => p.visibility !== "Ecommerce Only");
  const filteredProducts = posProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id !== productId) return item;
      const newQty = item.quantity + delta;
      return newQty <= 0 ? item : { ...item, quantity: newQty };
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="bg-foreground px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-background/60 hover:text-background transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">O</span>
            </div>
            <span className="font-display font-bold text-background">POS Terminal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-background/10 text-background/80 border-0">Main Store</Badge>
          <Link to="/erp">
            <Button size="sm" variant="ghost" className="text-background/60 hover:text-background hover:bg-background/10 text-xs">
              ERP Backend
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Products grid */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-card rounded-lg border border-border p-3 text-left hover:border-primary/50 hover:shadow-sm transition-all group"
              >
                <div className="aspect-square rounded-md overflow-hidden bg-muted mb-2">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <p className="text-xs text-muted-foreground">{product.sku}</p>
                <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-semibold text-primary text-sm">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">{product.stock} qty</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart panel */}
        <div className="w-96 border-l border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4" /> Current Sale
            </h2>
            <Badge variant="secondary">{cart.length} items</Badge>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-12">
                Tap products to add to sale
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <img src={product.image} alt="" className="h-10 w-10 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">${product.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(product.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(product.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-sm font-semibold w-16 text-right">${(product.price * quantity).toFixed(2)}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(product.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Totals & payment */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button className="gap-2" disabled={cart.length === 0}><Banknote className="h-4 w-4" /> Cash</Button>
              <Button className="gap-2" disabled={cart.length === 0}><CreditCard className="h-4 w-4" /> Card</Button>
              <Button variant="outline" className="gap-2" disabled={cart.length === 0}><QrCode className="h-4 w-4" /> QR Pay</Button>
              <Button variant="outline" className="gap-2" disabled={cart.length === 0}><Users className="h-4 w-4" /> Credit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
