import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { customers } from "@/data/mockData";

const ERPCustomers = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Customers</h1>
        <p className="text-sm text-muted-foreground">{customers.length} customers</p>
      </div>
      <Button className="gap-2"><Plus className="h-4 w-4" /> Add Customer</Button>
    </div>

    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search customers..." className="pl-10" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map(customer => (
        <Card key={customer.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-foreground">{customer.name}</h3>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              </div>
              <Badge variant="secondary" className="text-[10px]">{customer.orders} orders</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credit Limit</span>
                <span className="font-medium">${customer.creditLimit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance</span>
                <span className={`font-medium ${customer.balance > 0 ? "text-warning" : "text-success"}`}>
                  ${customer.balance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available Credit</span>
                <span className="font-medium text-success">${(customer.creditLimit - customer.balance).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default ERPCustomers;
