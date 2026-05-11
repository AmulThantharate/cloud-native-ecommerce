"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/api";

const categoryImages: Record<string, string> = {
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600",
  clothing: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
  "home-living": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
  sports: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600",
  books: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600",
};

const categoryGradients = [
  "from-blue-600 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
];

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productApi.categories().then((r) => r.data),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold">Shop by Category</h1>
          <p className="mt-1 text-muted-foreground">
            Find what you need across our curated collections
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories?.map((category: any, i: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border transition-all hover:shadow-xl">
                    {categoryImages[category.slug] ? (
                      <Image
                        src={categoryImages[category.slug]}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-br ${categoryGradients[i % categoryGradients.length]}`} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
                      {category.description && (
                        <p className="mt-1 text-sm text-white/70">{category.description}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-white/60">
                          {category.productCount || 0} products
                        </span>
                        <span className="flex items-center gap-1 text-sm font-medium text-white group-hover:gap-2 transition-all">
                          Browse <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
