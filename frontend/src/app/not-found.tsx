"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-9xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => window.history.back()} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          <Link href="/">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
              <Home className="h-4 w-4" /> Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
