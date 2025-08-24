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
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                className="flex h-10 w-10 items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <motion.img
                  src="/logo.png"
                  alt="NEXUSUI"
                  className="w-10 h-10"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  NEXUSUI
                </h1>
                <p className="text-xs text-muted-foreground">
                  Next-gen blockchain platform
                </p>
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.slice(0, 6).map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group flex items-center space-x-1"
                >
                  <IconComponent className="w-4 h-4" />
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
              <button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <span>More</span>
                <svg
                  className="w-4 h-4"
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
              <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {navItems.slice(6).map((item) => {
                    const isActive = pathname === item.href;
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <div className="flex items-center space-x-4">
            <ConnectButton className="btn-primary-mobile lg:btn-primary" />

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
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
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-4 h-4" />
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
