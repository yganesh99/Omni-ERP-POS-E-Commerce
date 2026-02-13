import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus, Star, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/mockData";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-muted-foreground">Product not found</p>
      <Link to="/shop"><Button variant="outline" className="mt-4">Back to Shop</Button></Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">{product.category}</Badge>
            {product.badge && <Badge className="bg-accent text-accent-foreground border-0 text-xs">{product.badge}</Badge>}
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">{product.name}</h1>

          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-accent text-accent" : "text-border"}`} />
            ))}
            <span className="text-sm text-muted-foreground ml-1">(42 reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">
            Premium quality product crafted with attention to detail. Perfect for everyday use with lasting durability and timeless style. SKU: {product.sku}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border rounded-lg">
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
          </div>

          <div className="flex gap-3 mb-8">
            <Button size="lg" className="flex-1 gap-2">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
            <Link to="/checkout">
              <Button size="lg" variant="outline">Buy Now</Button>
            </Link>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" /> Free shipping on orders over $50
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <RotateCcw className="h-4 w-4" /> Easy 30-day returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
