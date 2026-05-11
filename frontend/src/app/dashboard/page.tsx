"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, MapPin, CreditCard, Settings, LogOut, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

const menuItems = [
  { icon: ShoppingBag, label: "My Orders", href: "/orders", desc: "View order history" },
  { icon: Heart, label: "Wishlist", href: "/wishlist", desc: "Saved items" },
  { icon: MapPin, label: "Addresses", href: "/addresses", desc: "Manage shipping addresses" },
  { icon: CreditCard, label: "Payment Methods", href: "/payment-methods", desc: "Cards & wallets" },
  { icon: Settings, label: "Settings", href: "/settings", desc: "Account preferences" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">12</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Wishlist Items</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">5</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Member Since</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">2024</div></CardContent></Card>
          </div>

          <div className="grid gap-3">
            {menuItems.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={item.href}>
                  <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-accent cursor-pointer">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: menuItems.length * 0.05 }}>
              <button onClick={logout} className="flex w-full items-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 transition-colors hover:bg-destructive/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <LogOut className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-destructive">Sign Out</h3>
                  <p className="text-sm text-destructive/70">Log out of your account</p>
                </div>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
