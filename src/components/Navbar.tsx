"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Palette,
  Vote,
  BookOpen,
  Droplets,
  Gift,
  Search,
  Code2,
  User,
  Users,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "NFT Mint", href: "/mint", icon: Palette },
  { name: "Voting", href: "/voting", icon: Vote },
  { name: "Guestbook", href: "/guestbook", icon: BookOpen },
  { name: "Faucet", href: "/faucet", icon: Droplets },
  { name: "Tip Jar", href: "/tipjar", icon: Gift },
  { name: "Objects", href: "/objects", icon: Search },
  { name: "Tech Stack", href: "/tech-stack", icon: Code2 },
  { name: "About", href: "/about", icon: User },
  { name: "Contributors", href: "/contributors", icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b-2 border-border/50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2 lg:space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/"
              className="flex items-center space-x-2 lg:space-x-3 group"
            >
              <motion.div
                className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center overflow-hidden rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <img
                  src="/logo.png"
                  alt="nexuSUI"
                  className="w-10 h-10 lg:w-12 lg:h-12 aspect-square object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-base lg:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  <span className="block sm:hidden">nexuSUI</span>
                  <span className="hidden sm:block">nexuSUI</span>
                </h1>
                <p className="hidden sm:block text-xs text-muted-foreground">
                  Next-gen blockchain platform
                </p>
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.slice(0, 6).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group"
                >
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </span>
                  {/* Hover underline */}
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                      isActive ? "w-full" : ""
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* More Menu for Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                <span>More</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  {navItems.slice(6).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-4 py-2 text-sm transition-colors hover:bg-muted ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <ConnectButton className="btn-primary-mobile lg:btn-primary" />

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 lg:p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              ) : (
                <Menu className="w-5 h-5 lg:w-6 lg:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 py-4"
          >
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
