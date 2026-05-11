"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Truck, Headphones, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/api";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: Shield, title: "Secure Payment", desc: "256-bit SSL encryption" },
  { icon: Zap, title: "Fast Delivery", desc: "2-3 business days" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

export default function HomePage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productApi.list({ featured: true, limit: 8 }).then((r) => r.data),
  });

  const { data: trendingProducts } = useQuery({
    queryKey: ["products", "trending"],
    queryFn: () => productApi.list({ trending: true, limit: 4 }).then((r) => r.data),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/10 dark:to-indigo-950/10">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                Cloud-Native E-Commerce
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Built for{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Scale
                </span>{" "}
                & Performance
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                A production-grade microservices platform with Redis caching, 
                Kubernetes orchestration, and real-time observability.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button size="lg" variant="outline">
                    View Architecture
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">4.9</span>
                  <span>Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-foreground">50K+</span>
                  <span>Orders</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 p-8 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-white/80 shadow-lg dark:bg-slate-800/80"
                    >
                      <div className="flex h-full items-center justify-center">
                        <PackageIcon index={i} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked for you</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products?.products?.map((product: any, i: number) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className="border-t bg-muted/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Badge className="mb-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30">
              <TrendingUp className="mr-1 h-3 w-3" /> Trending Now
            </Badge>
            <h2 className="text-2xl font-bold">What Everyone&apos;s Buying</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trendingProducts?.products?.map((product: any, i: number) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-16 text-center text-white sm:px-16"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold sm:text-4xl">Ready to Experience Microservices?</h2>
              <p className="mx-auto mt-4 max-w-xl text-blue-100">
                Explore our architecture, run chaos experiments, and see real-time metrics 
                from our distributed systems.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/products">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Start Shopping <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PackageIcon({ index }: { index: number }) {
  const icons = ["📦", "🛒", "💳", "🚀"];
  return <span className="text-4xl">{icons[index - 1]}</span>;
}
