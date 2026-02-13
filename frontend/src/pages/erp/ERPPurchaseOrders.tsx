import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { purchaseOrders } from "@/data/mockData";

const statusColors: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Approved: "bg-info/10 text-info",
  Sent: "bg-primary/10 text-primary",
  "Partial Received": "bg-warning/10 text-warning",
  Closed: "bg-success/10 text-success",
  Cancelled: "bg-destructive/10 text-destructive",
};

const ERPPurchaseOrders = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Purchase Orders</h1>
        <p className="text-sm text-muted-foreground">Manage procurement</p>
      </div>
      <Button className="gap-2"><Plus className="h-4 w-4" /> Create PO</Button>
    </div>

    <div className="flex gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search purchase orders..." className="pl-10" />
      </div>
      <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
    </div>

    <Card>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">PO #</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Supplier</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium">Items</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map(po => (
              <tr key={po.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                <td className="py-3 px-4 font-medium text-foreground font-mono text-xs">{po.id}</td>
                <td className="py-3 px-4 text-muted-foreground">{po.date}</td>
                <td className="py-3 px-4 text-foreground">{po.supplier}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{po.items}</td>
                <td className="py-3 px-4 text-right font-medium">${po.total.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[po.status] || ""}`}>
                    {po.status}
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

export default ERPPurchaseOrders;
