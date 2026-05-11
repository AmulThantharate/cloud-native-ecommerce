"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Category } from "@/types";

interface CategoryNavProps {
  categories: Category[];
  activeCategory?: string;
}

export function CategoryNav({ categories, activeCategory }: CategoryNavProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        href="/products"
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !activeCategory
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === category.slug
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
