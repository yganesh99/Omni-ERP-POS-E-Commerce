import { Search, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/data/mockData";

const visibilityColors: Record<string, string> = {
  Both: "bg-success/10 text-success",
  "POS Only": "bg-info/10 text-info",
  "Ecommerce Only": "bg-primary/10 text-primary",
};

const ERPProducts = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Products</h1>
        <p className="text-sm text-muted-foreground">{products.length} products in catalogue</p>
      </div>
      <Button className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
    </div>

    <div className="flex gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." className="pl-10" />
      </div>
    </div>

    <Card>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Product</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">SKU</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">POS Price</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Ecom Price</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Stock</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Visibility</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt="" className="h-10 w-10 rounded-md object-cover" />
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{product.sku}</td>
                <td className="py-3 px-4 text-right font-medium">${product.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-right font-medium">${product.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-right">
                  <span className={product.stock < 30 ? "text-destructive font-medium" : "text-foreground"}>{product.stock}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${visibilityColors[product.visibility] || ""}`}>
                    {product.visibility}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
);

export default ERPProducts;
