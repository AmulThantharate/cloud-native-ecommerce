"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/api";

export default function NewArrivalsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productApi.list({ limit: 50 }).then((r) => r.data),
  });

  const newArrivals = products?.products?.filter((p: any) => p.isNew) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              <Sparkles className="mr-1 h-3 w-3" /> Just Landed
            </Badge>
            <h1 className="text-4xl font-extrabold">New Arrivals</h1>
            <p className="mt-2 text-white/80 text-lg">
              {newArrivals.length} fresh products just arrived
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newArrivals.map((product: any, i: number) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg text-muted-foreground">New arrivals coming soon!</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
