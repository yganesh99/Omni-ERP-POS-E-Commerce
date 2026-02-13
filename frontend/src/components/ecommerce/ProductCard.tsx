import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
}

const ProductCard = ({ id, name, price, originalPrice, image, category, badge }: ProductCardProps) => (
  <Link to={`/product/${id}`} className="group">
    <div className="bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {badge && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0 text-xs">
            {badge}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{category}</p>
        <h3 className="font-medium text-foreground text-sm leading-snug mb-2 group-hover:text-primary transition-colors">{name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
            )}
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </Link>
);

export default ProductCard;
