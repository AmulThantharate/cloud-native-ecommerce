"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
        <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button onClick={reset} className="mt-6 gap-2">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </motion.div>
    </div>
  );
}
