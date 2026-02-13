import { Link } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, Store, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const EcommerceHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = 3;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-end gap-4 py-1.5 text-xs text-muted-foreground border-b border-border/50">
          <Link to="/pos" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Store className="h-3 w-3" /> POS Terminal
          </Link>
          <Link to="/erp" className="flex items-center gap-1 hover:text-primary transition-colors">
            <LayoutDashboard className="h-3 w-3" /> ERP Backend
          </Link>
        </div>

        {/* Main nav */}
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">O</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">OmniStore</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Shop</Link>
            <Link to="/shop?category=new" className="text-sm font-medium text-foreground hover:text-primary transition-colors">New Arrivals</Link>
            <Link to="/shop?category=sale" className="text-sm font-medium text-accent transition-colors">Sale</Link>
          </nav>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10 bg-muted/50 border-0 focus-visible:ring-1" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-foreground">
              <User className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-foreground">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground border-2 border-card">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3 animate-fade-in">
            <Link to="/" className="block px-2 py-2 text-sm font-medium text-foreground">Home</Link>
            <Link to="/shop" className="block px-2 py-2 text-sm font-medium text-foreground">Shop</Link>
            <Link to="/pos" className="block px-2 py-2 text-sm font-medium text-muted-foreground">POS Terminal</Link>
            <Link to="/erp" className="block px-2 py-2 text-sm font-medium text-muted-foreground">ERP Backend</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default EcommerceHeader;
