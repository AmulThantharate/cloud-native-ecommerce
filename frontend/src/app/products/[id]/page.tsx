"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => productApi.get(params.id as string).then((r) => r.data),
    enabled: !!params.id,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["products", "related", params.id],
    queryFn: () => productApi.list({ category: product?.category?.id, limit: 4 }).then((r) => r.data),
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-xl bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
              <div className="h-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <span>Home</span> <span className="mx-2">/</span>
          <span>{product.category.name}</span> <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <Image
                src={product.images[selectedImage] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.isNew && (
                <Badge className="absolute left-4 top-4 bg-blue-600">New Arrival</Badge>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === i ? "border-blue-600" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge variant="destructive">Save {discount}%</Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
              <div className="text-center">
                <Truck className="mx-auto h-5 w-5 text-blue-600" />
                <p className="mt-1 text-xs font-medium">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto h-5 w-5 text-green-600" />
                <p className="mt-1 text-xs font-medium">2-Year Warranty</p>
              </div>
              <div className="text-center">
                <RotateCcw className="mx-auto h-5 w-5 text-amber-600" />
                <p className="mt-1 text-xs font-medium">30-Day Returns</p>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-lg border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none rounded-l-lg"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none rounded-r-lg"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) addItem(product);
                }}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => setIsLiked(!isLiked)}>
                <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Separator />

            {/* Specifications */}
            {product.specifications && (
              <div>
                <h3 className="font-semibold mb-2">Specifications</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-dashed">
                      <dt className="text-muted-foreground">{key}</dt>
                      <dd className="font-medium">{value as string}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts?.products?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.products.map((p: any, i: number) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
