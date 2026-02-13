import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { suppliers } from "@/data/mockData";

const ERPSuppliers = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Suppliers</h1>
        <p className="text-sm text-muted-foreground">{suppliers.length} suppliers</p>
      </div>
      <Button className="gap-2"><Plus className="h-4 w-4" /> Add Supplier</Button>
    </div>

    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search suppliers..." className="pl-10" />
    </div>

    <Card>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Supplier</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Contact</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium">Lead Time</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Balance (AP)</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                <td className="py-3 px-4 font-medium text-foreground">{supplier.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{supplier.contact}</td>
                <td className="py-3 px-4 text-muted-foreground">{supplier.email}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{supplier.leadTime} days</td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-medium ${supplier.balance > 0 ? "text-warning" : "text-success"}`}>
                    ${supplier.balance.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
);

export default ERPSuppliers;
