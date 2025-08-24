"use client";

import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";

const techCategories = [
  {
    title: "Frontend Framework",
    technologies: [
      {
        name: "Next.js 15",
        description: "React framework with App Router",
        icon: "⚡",
        color: "from-blue-500/20 to-purple-500/20",
      },
      {
        name: "React 19",
        description: "Latest React with concurrent features",
        icon: "⚛️",
        color: "from-cyan-500/20 to-blue-500/20",
      },
      {
        name: "TypeScript",
        description: "Type-safe JavaScript development",
        icon: "📘",
        color: "from-blue-600/20 to-blue-400/20",
      },
    ],
  },
  {
    title: "Styling & UI",
    technologies: [
      {
        name: "Tailwind CSS 4",
        description: "Utility-first CSS framework",
        icon: "🎨",
        color: "from-teal-500/20 to-cyan-500/20",
      },
      {
        name: "Framer Motion",
        description: "Production-ready motion library",
        icon: "🎬",
        color: "from-purple-500/20 to-pink-500/20",
      },
      {
        name: "React Hot Toast",
        description: "Elegant toast notifications",
        icon: "🍞",
        color: "from-orange-500/20 to-red-500/20",
      },
    ],
  },
  {
    title: "Blockchain & Web3",
    technologies: [
      {
        name: "Sui dApp Kit",
        description: "Official Sui development toolkit",
        icon: "🔗",
        color: "from-green-500/20 to-emerald-500/20",
      },
      {
        name: "Sui SDK",
        description: "Sui blockchain SDK",
        icon: "⚡",
        color: "from-yellow-500/20 to-orange-500/20",
      },
      {
        name: "Move Language",
        description: "Safe and secure smart contracts",
        icon: "🛡️",
        color: "from-indigo-500/20 to-purple-500/20",
      },
    ],
  },
  {
    title: "State Management",
    technologies: [
      {
        name: "TanStack Query",
        description: "Powerful data synchronization",
        icon: "🔄",
        color: "from-pink-500/20 to-rose-500/20",
      },
      {
        name: "React Hooks",
        description: "Modern React state management",
        icon: "🎣",
        color: "from-blue-500/20 to-indigo-500/20",
      },
    ],
  },
  {
    title: "Infrastructure",
    technologies: [
      {
        name: "Enoki",
        description: "Gasless transaction sponsorship",
        icon: "🚀",
        color: "from-violet-500/20 to-purple-500/20",
      },
      {
        name: "Vercel",
        description: "Deployment and hosting platform",
        icon: "☁️",
        color: "from-gray-500/20 to-slate-500/20",
      },
    ],
  },
];

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
      ease: "easeOut",
    },
  },
};

export default function TechStackPage() {
  return (
    <div className="min-h-screen bg-background">
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
              Tech
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {" "}
                Stack
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Modern technologies powering the next generation of blockchain applications in 2025.
              Built with cutting-edge tools for optimal performance and developer experience.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Tech Categories */}
      <motion.section
        className="py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          <div className="space-y-16">
            {techCategories.map((category, categoryIndex) => (
              <motion.div key={category.title} variants={itemVariants}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    {category.title}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.technologies.map((tech, techIndex) => (
                    <motion.div
                      key={tech.name}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="group"
                    >
                      <div
                        className={`card card-hover h-full bg-gradient-to-br ${tech.color} border-border/50`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="text-4xl">{tech.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {tech.name}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {tech.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Architecture Overview */}
      <motion.section
        className="py-20 px-4 bg-card/50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Architecture Overview
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modern full-stack architecture designed for scalability and performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Frontend Layer
              </h3>
              <p className="text-muted-foreground">
                React-based UI with modern styling and animations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Blockchain Layer
              </h3>
              <p className="text-muted-foreground">
                Sui blockchain integration with smart contracts
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Infrastructure
              </h3>
              <p className="text-muted-foreground">
                Gasless transactions and cloud deployment
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
