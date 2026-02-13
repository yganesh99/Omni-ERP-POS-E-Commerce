import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { orders } from "@/data/mockData";

const stats = [
  { label: "Today's Revenue", value: "$4,285.00", change: "+12.5%", trend: "up", icon: DollarSign },
  { label: "Total Orders", value: "156", change: "+8.2%", trend: "up", icon: ShoppingCart },
  { label: "Products", value: "248", change: "+3", trend: "up", icon: Package },
  { label: "Customers", value: "1,024", change: "+18", trend: "up", icon: Users },
];

const statusColors: Record<string, string> = {
  Confirmed: "bg-success/10 text-success",
  Processing: "bg-info/10 text-info",
  Shipped: "bg-primary/10 text-primary",
  Delivered: "bg-success/10 text-success",
  Returned: "bg-destructive/10 text-destructive",
  Pending: "bg-warning/10 text-warning",
};

const ERPDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
      <p className="text-sm text-muted-foreground">Overview of your business performance</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, change, trend, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${trend === "up" ? "text-success" : "text-destructive"}`}>
                {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Recent Orders */}
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Order</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Customer</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Channel</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Store</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Total</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{order.id}</td>
                  <td className="py-3 px-2 text-foreground">{order.customer}</td>
                  <td className="py-3 px-2">
                    <Badge variant="secondary" className="text-[10px]">{order.type}</Badge>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{order.store}</td>
                  <td className="py-3 px-2 text-right font-medium text-foreground">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ERPDashboard;
