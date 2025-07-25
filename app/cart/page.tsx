"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { format } from "date-fns";

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <ShoppingBag className="w-24 h-24 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">Add some items to get started!</p>
          <Link href="/">
            <Button className="mt-4">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
          
          <div className="space-y-4">
            {state.items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.img_src}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created on {format(new Date(item.createdAt), "MMMM do, yyyy")}
                      </p>
                      <p className="text-lg font-medium">
                        {item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="w-12 text-center font-medium text-lg">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right space-y-2">
                      <p className="text-lg font-semibold">
                        {(item.price * item.quantity).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Clear Cart Button */}
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Item Details */}
              <div className="space-y-2">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>
                      {(item.price * item.quantity).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </span>
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
              </div>
              
              <hr />
              
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{state.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
              </div>
              
              {/* Checkout Button */}
              <div className="space-y-3 pt-4">
                <Link href="/checkout">
                  <Button className="w-full text-lg py-6">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
