import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { stores } from "@/data/mockData";

const ERPSettings = () => (
  <div className="space-y-6 max-w-4xl">
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground">Settings</h1>
      <p className="text-sm text-muted-foreground">Business and store configuration</p>
    </div>

    {/* Business Info */}
    <Card>
      <CardHeader><CardTitle className="text-base">Business Information</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Business Name</Label><Input defaultValue="OmniStore Inc." /></div>
          <div className="space-y-2"><Label>Slug</Label><Input defaultValue="omnistore" /></div>
          <div className="space-y-2"><Label>Email</Label><Input defaultValue="admin@omnistore.com" /></div>
          <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+1 555-0000" /></div>
          <div className="space-y-2"><Label>Tax ID</Label><Input defaultValue="US-TAX-12345" /></div>
          <div className="space-y-2"><Label>Default Currency</Label><Input defaultValue="USD" /></div>
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>

    {/* Tax Config */}
    <Card>
      <CardHeader><CardTitle className="text-base">Tax Configuration</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { name: "Sales Tax", rate: "8%", isDefault: true },
            { name: "VAT", rate: "20%", isDefault: false },
          ].map(tax => (
            <div key={tax.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <span className="font-medium text-foreground text-sm">{tax.name}</span>
                {tax.isDefault && <Badge className="ml-2 text-[10px]" variant="secondary">Default</Badge>}
              </div>
              <span className="font-medium text-foreground text-sm">{tax.rate}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Stores */}
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Stores</CardTitle>
        <Button size="sm" variant="outline">Add Store</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stores.map(store => (
            <div key={store.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground text-sm">{store.name}</p>
                <p className="text-xs text-muted-foreground">{store.code} · {store.address}</p>
              </div>
              <Badge variant={store.active ? "default" : "secondary"} className="text-[10px]">
                {store.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ERPSettings;
