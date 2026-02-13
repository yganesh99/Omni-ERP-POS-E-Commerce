import { Link } from "react-router-dom";

const EcommerceFooter = () => (
  <footer className="bg-foreground text-background/80 mt-20">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">O</span>
            </div>
            <span className="font-display font-bold text-xl text-background">OmniStore</span>
          </div>
          <p className="text-sm text-background/60 leading-relaxed">
            Your omnichannel retail platform for seamless shopping experiences.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-background mb-4">Shop</h4>
          <div className="space-y-2.5 text-sm">
            <Link to="/shop" className="block hover:text-background transition-colors">All Products</Link>
            <Link to="/shop?category=new" className="block hover:text-background transition-colors">New Arrivals</Link>
            <Link to="/shop?category=sale" className="block hover:text-background transition-colors">Sale</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-background mb-4">Support</h4>
          <div className="space-y-2.5 text-sm">
            <a href="#" className="block hover:text-background transition-colors">Contact Us</a>
            <a href="#" className="block hover:text-background transition-colors">Shipping & Returns</a>
            <a href="#" className="block hover:text-background transition-colors">FAQ</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-background mb-4">Platform</h4>
          <div className="space-y-2.5 text-sm">
            <Link to="/pos" className="block hover:text-background transition-colors">POS Terminal</Link>
            <Link to="/erp" className="block hover:text-background transition-colors">ERP Backend</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 mt-12 pt-8 text-center text-sm text-background/40">
        &copy; 2026 OmniStore. All rights reserved.
      </div>
    </div>
  </footer>
);

export default EcommerceFooter;
