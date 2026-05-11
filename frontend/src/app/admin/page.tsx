"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DollarSign, Users, ShoppingCart, Package, TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { useAuthStore } from "@/store/useAuthStore";

const stats = [
  { label: "Total Revenue", value: "$124,592", change: "+12.5%", trend: "up", icon: DollarSign },
  { label: "Total Orders", value: "1,429", change: "+8.2%", trend: "up", icon: ShoppingCart },
  { label: "Total Users", value: "8,549", change: "+15.3%", trend: "up", icon: Users },
  { label: "Products", value: "342", change: "-2.1%", trend: "down", icon: Package },
];

const recentOrders = [
  { id: "ORD-001", customer: "John Doe", total: "$249.99", status: "delivered", date: "2024-01-15" },
  { id: "ORD-002", customer: "Jane Smith", total: "$129.50", status: "processing", date: "2024-01-15" },
  { id: "ORD-003", customer: "Bob Johnson", total: "$599.00", status: "shipped", date: "2024-01-14" },
  { id: "ORD-004", customer: "Alice Brown", total: "$79.99", status: "pending", date: "2024-01-14" },
  { id: "ORD-005", customer: "Charlie Wilson", total: "$349.99", status: "delivered", date: "2024-01-13" },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) router.push("/");
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of your e-commerce platform</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className={`flex items-center text-xs mt-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {stat.change} from last month
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Revenue Overview</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 px-4">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                    <div key={i} className="w-full bg-blue-600/20 rounded-t-sm relative group">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground px-4">
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => <span key={m}>{m}</span>)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Recent Orders</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{order.total}</p>
                        <Badge variant={order.status === "delivered" ? "success" : order.status === "processing" ? "warning" : order.status === "shipped" ? "info" : "default"} className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "API Gateway", latency: "12ms" },
                  { name: "User Service", latency: "8ms" },
                  { name: "Product Service", latency: "15ms" },
                  { name: "Order Service", latency: "22ms" },
                  { name: "Payment Service", latency: "45ms" },
                  { name: "Cart Service", latency: "5ms" },
                  { name: "Redis Cache", latency: "2ms" },
                  { name: "PostgreSQL", latency: "18ms" },
                ].map((service) => (
                  <div key={service.name} className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{service.latency} latency</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
