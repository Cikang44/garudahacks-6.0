"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CreditCard, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would send this data to your backend
    console.log("Order submitted:", {
      items: state.items,
      total: state.total,
      customerInfo: formData,
      timestamp: new Date().toISOString(),
    });

    // Clear the cart
    clearCart();
    
    // Redirect to success page
    router.push("/checkout/success");
    
    setIsProcessing(false);
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h2 className="text-2xl font-bold">No items to checkout</h2>
          <p className="text-muted-foreground">Add some items to your cart first!</p>
          <Link href="/">
            <Button className="mt-4">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold mt-4">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="province">Province *</Label>
                  <Input
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special delivery instructions..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full text-lg py-6"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Place Order - {state.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.img_src}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 text-xs"
                      >
                        {item.quantity}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {(item.price * item.quantity).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{state.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{state.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
