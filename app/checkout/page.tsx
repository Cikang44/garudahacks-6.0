"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  if (id === "") {
    // return the homepage / librarypage / whatever you put in
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Full Name" required />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="Delivery Address" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" placeholder="Phone Number" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" placeholder="Email Address" required />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Payment Options</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="credit_card" className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card">Credit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank_transfer" id="bank_transfer" />
              <Label htmlFor="bank_transfer">Bank Transfer</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-4">Total: <span className="font-bold">IDR 20.000.000,00</span></div>
          <Button className="w-full">Place Order</Button>
        </CardContent>
      </Card>
    </div>
  );
}
