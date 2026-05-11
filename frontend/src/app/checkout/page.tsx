"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { CreditCard, Truck, Check, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "", firstName: "", lastName: "", address: "",
    city: "", state: "", zipCode: "", country: "US",
    cardNumber: "", expiry: "", cvc: "",
  });

  const handleSubmit = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Order placed successfully!");
    clearCart();
    router.push("/orders");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24">
          <Lock className="h-16 w-16 text-muted-foreground/30" />
          <h1 className="mt-4 text-2xl font-bold">Please sign in</h1>
          <p className="text-muted-foreground">You need to be logged in to checkout.</p>
          <Button className="mt-4" onClick={() => router.push("/login")}>Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const steps = [
    { num: 1, label: "Shipping", icon: Truck },
    { num: 2, label: "Payment", icon: CreditCard },
    { num: 3, label: "Review", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="mb-8 flex items-center justify-center">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                step >= s.num ? "border-blue-600 bg-blue-600 text-white" : "border-muted-foreground/30 text-muted-foreground"
              }`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`mx-4 h-0.5 w-16 ${step > s.num ? "bg-blue-600" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium mb-1.5 block">First Name</label>
                      <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} /></div>
                    <div><label className="text-sm font-medium mb-1.5 block">Last Name</label>
                      <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} /></div>
                  </div>
                  <div><label className="text-sm font-medium mb-1.5 block">Email</label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                  <div><label className="text-sm font-medium mb-1.5 block">Address</label>
                    <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="text-sm font-medium mb-1.5 block">City</label>
                      <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} /></div>
                    <div><label className="text-sm font-medium mb-1.5 block">State</label>
                      <Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} /></div>
                    <div><label className="text-sm font-medium mb-1.5 block">ZIP</label>
                      <Input value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} /></div>
                  </div>
                </div>
                <Button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => setStep(2)}>Continue to Payment</Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border p-4 bg-blue-50/50 dark:bg-blue-900/10 border-blue-200">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Credit / Debit Card</span>
                    <span className="ml-auto text-xs text-muted-foreground">Mock Payment</span>
                  </div>
                  <div><label className="text-sm font-medium mb-1.5 block">Card Number</label>
                    <Input placeholder="4242 4242 4242 4242" value={formData.cardNumber} onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium mb-1.5 block">Expiry</label>
                      <Input placeholder="MM/YY" value={formData.expiry} onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} /></div>
                    <div><label className="text-sm font-medium mb-1.5 block">CVC</label>
                      <Input placeholder="123" value={formData.cvc} onChange={(e) => setFormData({ ...formData, cvc: e.target.value })} /></div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => setStep(3)}>Review Order</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Review Your Order</h2>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="font-medium mb-2">Shipping to:</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.firstName} {formData.lastName}<br />{formData.address}<br />{formData.city}, {formData.state} {formData.zipCode}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="font-medium mb-2">Payment:</h3>
                    <p className="text-sm text-muted-foreground">Card ending in {formData.cardNumber.slice(-4) || "4242"}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                  <Button className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600" onClick={handleSubmit} isLoading={isProcessing}>
                    <Lock className="h-4 w-4" />Place Order
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={item.product.images[0] || "/placeholder.jpg"} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(cart.tax)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</span></div>
                <Separator />
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPrice(cart.total)}</span></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-green-600" />Secure checkout with 256-bit encryption
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
