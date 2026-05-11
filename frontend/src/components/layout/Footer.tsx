"use client";

import Link from "next/link";
import { Package, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  const footerLinks = {
    Shop: ["All Products", "New Arrivals", "Best Sellers", "Deals"],
    Support: ["Help Center", "Shipping Info", "Returns", "Contact Us"],
    Company: ["About Us", "Careers", "Blog", "Press"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  };

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">
                Nex<span className="text-blue-600">Store</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              A cloud-native e-commerce platform built with microservices architecture.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold">{category}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NexStore. Built for cloud-native excellence.
        </div>
      </div>
    </footer>
  );
}
