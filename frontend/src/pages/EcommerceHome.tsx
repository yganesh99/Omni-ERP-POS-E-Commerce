import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ecommerce/ProductCard";
import { products } from "@/data/mockData";

const EcommerceHome = () => {
  const featured = products.filter(p => p.visibility !== "POS Only").slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-dark text-primary-foreground">
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-6">
              New Season Collection
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
              Discover Products <br />
              <span className="text-gradient-primary">You'll Love</span>
            </h1>
            <p className="text-lg text-primary-foreground/60 mb-8 max-w-lg">
              Shop the latest trends across all categories. Fast shipping, easy returns, and exceptional quality.
            </p>
            <div className="flex gap-3">
              <Link to="/shop">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/shop?category=sale">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  View Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary blur-[100px]" />
          <div className="absolute bottom-10 right-1/3 w-96 h-96 rounded-full bg-accent blur-[120px]" />
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
            { icon: Shield, title: "Secure Payments", desc: "100% protected checkout" },
            { icon: Headphones, title: "24/7 Support", desc: "We're here to help" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Featured Products</h2>
            <p className="text-muted-foreground text-sm mt-1">Handpicked for you</p>
          </div>
          <Link to="/shop" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-2xl gradient-primary p-12 md:p-16 text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            Get exclusive offers and early access to new arrivals.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-2.5 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary-foreground/30" />
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceHome;
