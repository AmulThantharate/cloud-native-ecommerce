"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { cart, isOpen, toggleCart, removeItem, updateQuantity } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shopping Cart ({cart.itemCount})
              </h2>
              <Button variant="ghost" size="icon" onClick={toggleCart}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {cart.items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Looks like you haven&apos;t added anything yet.
                </p>
                <Button onClick={toggleCart} className="mt-4">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 py-4">
                    {cart.items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4 rounded-lg border p-3"
                      >
                        <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={item.product.images[0] || "/placeholder.jpg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t p-6 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatPrice(cart.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                  </div>
                  <Link href="/checkout" onClick={toggleCart}>
                    <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600" size="lg">
                      Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
