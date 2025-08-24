"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const footerLinks = {
  dApps: [
    { name: "NFT Mint", href: "/mint" },
    { name: "Voting", href: "/voting" },
    { name: "Guestbook", href: "/guestbook" },
    { name: "Faucet", href: "/faucet" },
    { name: "Tip Jar", href: "/tipjar" },
    { name: "Objects", href: "/objects" },
  ],
  Resources: [
    { name: "Tech Stack", href: "/tech-stack" },
    { name: "About", href: "/about" },
    { name: "Contributors", href: "/contributors" },
    { name: "Documentation", href: "https://docs.sui.io/", external: true },
    { name: "Sui Explorer", href: "https://suiexplorer.com/", external: true },
  ],
  Developer: [
    {
      name: "GitHub Profile",
      href: "https://github.com/mericcintosun",
      external: true,
    },
    {
      name: "This Repository",
      href: "https://github.com/mericcintosun/assignment-sui-workshop",
      external: true,
    },
    {
      name: "Sui dApp Kit",
      href: "https://sdk.mystenlabs.com/dapp-kit",
      external: true,
    },
    {
      name: "Enoki",
      href: "https://portal.enoki.mystenlabs.com/",
      external: true,
    },
  ],
};

export default function Footer() {
  return (
    <motion.footer
      className="bg-card/50 border-t border-border/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <motion.div
              className="flex items-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <img
                  src="/logo.png"
                  alt="nexuSUI"
                  className="w-8 h-8 rounded-full"
                />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-foreground">nexuSUI</h3>
                <p className="text-sm text-muted-foreground">
                  Next-gen blockchain platform
                </p>
              </div>
            </motion.div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              A comprehensive ecosystem of innovative dApps built on the Sui
              blockchain, connecting the future of decentralized applications.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/mericcintosun/assignment-sui-workshop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* dApps Links */}
          <div className="bg-card/30 rounded-lg p-6 border border-border/30">
            <h4 className="text-foreground font-semibold mb-4 text-base">
              dApps
            </h4>
            <ul className="space-y-3">
              {footerLinks.dApps.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="bg-card/30 rounded-lg p-6 border border-border/30">
            <h4 className="text-foreground font-semibold mb-4 text-base">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.Resources.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm block py-1"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Links */}
          <div className="bg-card/30 rounded-lg p-6 border border-border/30 sm:col-span-2 lg:col-span-1">
            <h4 className="text-foreground font-semibold mb-4 text-base">
              Developer
            </h4>
            <ul className="space-y-3">
              {footerLinks.Developer.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm block py-1"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                © 2025 nexuSUI. Built with ❤️ on the Sui blockchain.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground text-sm">
                  Open Source
                </span>
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>

              <a
                href="https://github.com/mericcintosun/assignment-sui-workshop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center space-x-1"
              >
                <span>View on GitHub</span>
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
