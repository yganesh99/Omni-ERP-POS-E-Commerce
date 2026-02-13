import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ecommerce/ProductCard";
import { products, categories } from "@/data/mockData";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = products.filter(p => p.visibility !== "POS Only").filter(p => activeCategory === "All" || p.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Shop All Products</h1>
        <p className="text-muted-foreground text-sm mt-1">{filtered.length} products available</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className="shrink-0"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
