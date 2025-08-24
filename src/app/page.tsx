"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Palette, Vote, BookOpen, Droplets, Gift, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const,
    },
  },
};

const features = [
  {
    title: "NFT Minting",
    description: "Create and mint unique NFTs on the Sui blockchain",
    icon: Palette,
    href: "/mint",
    color: "from-primary/10 to-primary/5",
  },
  {
    title: "On-Chain Voting",
    description: "Participate in decentralized governance with secure voting",
    icon: Vote,
    href: "/voting",
    color: "from-primary/10 to-primary/5",
  },
  {
    title: "Guestbook",
    description: "Leave messages on the blockchain for eternity",
    icon: BookOpen,
    href: "/guestbook",
    color: "from-primary/10 to-primary/5",
  },
  {
    title: "Token Faucet",
    description: "Get test SUI tokens for development and testing",
    icon: Droplets,
    href: "/faucet",
    color: "from-primary/10 to-primary/5",
  },
  {
    title: "Tip Jar",
    description: "Send tips and support creators on the blockchain",
    icon: Gift,
    href: "/tipjar",
    color: "from-primary/10 to-primary/5",
  },
  {
    title: "Object Explorer",
    description: "Explore and manage your blockchain objects",
    icon: Search,
    href: "/objects",
    color: "from-primary/10 to-primary/5",
  },
];

export default function HomePage() {
  const account = useCurrentAccount();

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                nexuSUI
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover a collection of innovative dApps built on nexuSUI
            </p>

            {!account && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <ConnectButton className="btn-primary text-lg px-8 py-4" />
                <p className="text-muted-foreground text-sm">
                  Connect your wallet to get started
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        className="py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Our Ecosystem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover a collection of innovative dApps built on NEXUSUI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={cardVariants}
                  whileHover="hover"
                  className="group"
                >
                  <Link href={feature.href}>
                    <div
                      className={`card card-hover h-full bg-gradient-to-br ${feature.color} border-border/50`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-primary">
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        className="mt-4 flex items-center text-primary text-sm font-medium"
                        initial={{ x: -10, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        Explore →
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      {account && (
        <motion.section
          className="py-20 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container">
            <div className="card text-center">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Your Wallet Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    Connected
                  </div>
                  <div className="text-muted-foreground">Wallet Status</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">Testnet</div>
                  <div className="text-muted-foreground">Network</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-mono text-muted-foreground break-all">
                    {account.address}
                  </div>
                  <div className="text-muted-foreground">Address</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      <Footer />
    </div>
  );
}
