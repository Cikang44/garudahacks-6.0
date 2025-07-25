"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-6">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order has been successfully placed and will be processed soon.
          </p>
        </div>

        {/* Order Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Package className="w-5 h-5 mr-2" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p>✅ Order confirmation email sent</p>
              <p>📦 Processing will begin within 24 hours</p>
              <p>🚚 Estimated delivery: 3-7 business days</p>
              <p>📱 Track your order via email updates</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          <Link href="/profile" className="block">
            <Button variant="outline" className="w-full">
              View Order History
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Questions about your order?</p>
          <p>Contact our support team for assistance.</p>
        </div>
      </div>
    </div>
  );
}
