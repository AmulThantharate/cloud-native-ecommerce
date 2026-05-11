"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice, formatDate } from "@/lib/utils";

const mockOrders = [
  { id: "ORD-2024-001", items: [{ name: "Wireless Headphones", qty: 1, price: 249.99 }], status: "delivered", total: 249.99, date: "2024-01-10", tracking: "1Z999AA10123456784" },
  { id: "ORD-2024-002", items: [{ name: "Smart Watch", qty: 1, price: 399.00 }], status: "shipped", total: 399.00, date: "2024-01-12", tracking: "1Z999AA10123456785" },
  { id: "ORD-2024-003", items: [{ name: "USB-C Cable", qty: 2, price: 19.99 }, { name: "Phone Case", qty: 1, price: 29.99 }], status: "processing", total: 69.97, date: "2024-01-14", tracking: null },
];

const statusConfig = {
  pending: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Pending" },
  processing: { icon: Clock, color: "bg-blue-100 text-blue-800", label: "Processing" },
  shipped: { icon: Truck, color: "bg-purple-100 text-purple-800", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Delivered" },
  cancelled: { icon: Clock, color: "bg-red-100 text-red-800", label: "Cancelled" },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground mb-8">Track and manage your orders</p>

          <div className="space-y-4">
            {mockOrders.map((order, i) => {
              const status = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              return (
                <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl border bg-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div><p className="text-sm text-muted-foreground">Order ID</p><p className="font-semibold">{order.id}</p></div>
                    <div className="text-right"><p className="text-sm text-muted-foreground">Order Date</p><p className="font-medium">{formatDate(order.date)}</p></div>
                    <div className="text-right"><p className="text-sm text-muted-foreground">Total</p><p className="font-bold text-lg">{formatPrice(order.total)}</p></div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <StatusIcon className={`h-4 w-4 ${status.color.split(" ")[1]}`} />
                    <Badge className={status.color}>{status.label}</Badge>
                    {order.tracking && <span className="text-xs text-muted-foreground ml-2">Tracking: {order.tracking}</span>}
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x{item.qty}</span>
                        <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    {order.status === "shipped" && <Button variant="outline" size="sm" className="gap-1"><MapPin className="h-3 w-3" /> Track</Button>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
