import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Checkout = () => {
  const subtotal = 268.97;
  const tax = 21.52;
  const total = 290.49;

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>First Name</Label><Input placeholder="John" /></div>
              <div className="space-y-2"><Label>Last Name</Label><Input placeholder="Doe" /></div>
              <div className="col-span-2 space-y-2"><Label>Email</Label><Input type="email" placeholder="john@example.com" /></div>
              <div className="col-span-2 space-y-2"><Label>Address</Label><Input placeholder="123 Main Street" /></div>
              <div className="space-y-2"><Label>City</Label><Input placeholder="New York" /></div>
              <div className="space-y-2"><Label>ZIP Code</Label><Input placeholder="10001" /></div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Payment Method</h2>
            <RadioGroup defaultValue="card" className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer"><CreditCard className="h-4 w-4" /> Credit / Debit Card</Label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <RadioGroupItem value="qr" id="qr" />
                <Label htmlFor="qr" className="cursor-pointer">QR Payment</Label>
              </div>
            </RadioGroup>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 space-y-2"><Label>Card Number</Label><Input placeholder="4242 4242 4242 4242" /></div>
              <div className="space-y-2"><Label>Expiry</Label><Input placeholder="MM/YY" /></div>
              <div className="space-y-2"><Label>CVC</Label><Input placeholder="123" /></div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl border border-border p-6 h-fit">
          <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
            <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full mt-6 gap-2" size="lg">
            <Lock className="h-4 w-4" /> Place Order
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">Your payment info is securely encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
