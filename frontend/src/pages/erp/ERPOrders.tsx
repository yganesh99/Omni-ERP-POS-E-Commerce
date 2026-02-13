import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { orders } from "@/data/mockData";

const statusColors: Record<string, string> = {
  Confirmed: "bg-success/10 text-success",
  Processing: "bg-info/10 text-info",
  Shipped: "bg-primary/10 text-primary",
  Delivered: "bg-success/10 text-success",
  Returned: "bg-destructive/10 text-destructive",
  Pending: "bg-warning/10 text-warning",
  Cancelled: "bg-muted text-muted-foreground",
};

const ERPOrders = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground">Orders</h1>
      <p className="text-sm text-muted-foreground">Manage POS and Ecommerce orders</p>
    </div>

    <div className="flex gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search orders..." className="pl-10" />
      </div>
      <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
    </div>

    <Card>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Order #</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Customer</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Channel</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Store</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium">Items</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                <td className="py-3 px-4 font-medium text-foreground font-mono text-xs">{order.id}</td>
                <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                <td className="py-3 px-4 text-foreground">{order.customer}</td>
                <td className="py-3 px-4"><Badge variant="secondary" className="text-[10px]">{order.type}</Badge></td>
                <td className="py-3 px-4 text-muted-foreground">{order.store}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{order.items}</td>
                <td className="py-3 px-4 text-right font-medium">${order.total.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[order.status] || ""}`}>
                    {order.status}
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

export default ERPOrders;
