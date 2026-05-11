"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Grid3X3, LayoutList, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/api";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", searchQuery, selectedCategory],
    queryFn: () =>
      productApi
        .list({
          q: searchQuery || undefined,
          category: selectedCategory || undefined,
          limit: 50,
        })
        .then((r) => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productApi.categories().then((r) => r.data),
  });

  const filteredAndSorted = useMemo(() => {
    let items = products?.products || [];

    // Price filter
    items = items.filter(
      (p: any) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    if (sortBy === "price-low") items = [...items].sort((a: any, b: any) => a.price - b.price);
    if (sortBy === "price-high") items = [...items].sort((a: any, b: any) => b.price - a.price);
    if (sortBy === "name") items = [...items].sort((a: any, b: any) => a.name.localeCompare(b.name));
    if (sortBy === "rating") items = [...items].sort((a: any, b: any) => b.rating - a.rating);
    if (sortBy === "newest") items = [...items].sort((a: any, b: any) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return items;
  }, [products, sortBy, priceRange]);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="mt-1 text-muted-foreground">
            {filteredAndSorted.length} products available
          </p>
        </motion.div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={filterOpen ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="name">Name: A-Z</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest First</option>
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

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null);
                      setPriceRange([0, 1000]);
                      setSortBy("default");
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0] || ""}
                        onChange={(e) =>
                          setPriceRange([Number(e.target.value) || 0, priceRange[1]])
                        }
                        className="h-9"
                      />
                      <span className="text-muted-foreground">—</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1] === 1000 ? "" : priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Number(e.target.value) || 1000])
                        }
                        className="h-9"
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {[
                        { label: "Under $50", range: [0, 50] as [number, number] },
                        { label: "$50-$100", range: [50, 100] as [number, number] },
                        { label: "$100-$300", range: [100, 300] as [number, number] },
                        { label: "$300+", range: [300, 1000] as [number, number] },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setPriceRange(preset.range)}
                          className={`rounded-full px-3 py-1 text-xs transition-colors ${
                            priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1]
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating filter placeholder */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                    >
                      <option value="default">Default</option>
                      <option value="price-low">Price: Low → High</option>
                      <option value="price-high">Price: High → Low</option>
                      <option value="name">Name: A-Z</option>
                      <option value="rating">Top Rated</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Nav - Inline Filter */}
        {categories && (
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            {categories.map((category: any) => (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {isLoading ? (
          <ProductGridSkeleton count={12} />
        ) : filteredAndSorted.length > 0 ? (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid grid-cols-1 gap-4"
            }
          >
            {filteredAndSorted.map((product: any, i: number) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No products match your filters.</p>
            <Button
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setPriceRange([0, 1000]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
