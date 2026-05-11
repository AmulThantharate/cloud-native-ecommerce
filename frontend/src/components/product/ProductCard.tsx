"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isLiked, setIsLiked] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
    >
      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.images[0] || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.isNew && <Badge className="bg-blue-600">New</Badge>}
          {product.isBestseller && <Badge className="bg-amber-500">Bestseller</Badge>}
          {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
        </div>
        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 text-xs text-muted-foreground">{product.category.name}</div>
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold transition-colors hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <div className="text-lg font-bold">{formatPrice(product.price)}</div>
            {product.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
          <Button
            size="sm"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => addItem(product)}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
