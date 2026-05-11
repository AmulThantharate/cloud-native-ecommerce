"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, Grid3X3, LayoutList, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/api";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("default");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productApi.categories().then((r) => r.data),
  });

  const category = categories?.find((c: any) => c.slug === slug);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "category", category?.id, searchQuery],
    queryFn: () =>
      productApi
        .list({ category: category?.id, q: searchQuery || undefined, limit: 50 })
        .then((r) => r.data),
    enabled: !!category?.id,
  });

  let sortedProducts = products?.products || [];
  if (sortBy === "price-low") sortedProducts = [...sortedProducts].sort((a: any, b: any) => a.price - b.price);
  if (sortBy === "price-high") sortedProducts = [...sortedProducts].sort((a: any, b: any) => b.price - a.price);
  if (sortBy === "name") sortedProducts = [...sortedProducts].sort((a: any, b: any) => a.name.localeCompare(b.name));
  if (sortBy === "rating") sortedProducts = [...sortedProducts].sort((a: any, b: any) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-2">
          <Link href="/categories" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Categories
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">{category?.name || slug}</h1>
          <p className="mt-1 text-muted-foreground">
            {category?.description || `Browse products in ${slug}`}
            {" · "}{products?.total || 0} products
          </p>
        </motion.div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <Input
              placeholder={`Search in ${category?.name || slug}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
              <option value="rating">Top Rated</option>
            </select>
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none rounded-l-lg"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none rounded-r-lg"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : sortedProducts.length > 0 ? (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid grid-cols-1 gap-4"
            }
          >
            {sortedProducts.map((product: any, i: number) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No products found in this category.</p>
            <Link href="/products">
              <Button className="mt-4">Browse All Products</Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
