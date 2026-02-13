import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, Package, Users, Truck } from "lucide-react";

const reportCards = [
  { title: "Sales by Store", desc: "Revenue breakdown by store location", icon: BarChart3, value: "$42,850" },
  { title: "Sales by Product", desc: "Top performing products by revenue", icon: TrendingUp, value: "248 SKUs" },
  { title: "Sales by Cashier", desc: "POS performance per cashier", icon: Users, value: "12 cashiers" },
  { title: "Low Stock Alerts", desc: "Products below reorder threshold", icon: Package, value: "3 alerts" },
  { title: "Customer Credit Exposure", desc: "Outstanding AR balances", icon: DollarSign, value: "$6,460" },
  { title: "Supplier Payables", desc: "Outstanding AP balances", icon: Truck, value: "$16,700" },
];

const ERPReports = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground">Reports & Analytics</h1>
      <p className="text-sm text-muted-foreground">Business intelligence and performance metrics</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reportCards.map(({ title, desc, icon: Icon, value }) => (
        <Card key={title} className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">{value}</span>
            </div>
            <h3 className="font-medium text-foreground mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Placeholder chart area */}
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-dashed border-border">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Revenue chart will appear here</p>
            <p className="text-xs">Connect to backend for live data</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ERPReports;
