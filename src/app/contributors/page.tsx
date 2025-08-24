"use client";

import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  Users,
  Building2,
  Sparkles,
  Award,
  CircleDot,
  Building,
} from "lucide-react";

const contributors = [
  {
    name: "Meriç Cintosun",
    role: "Lead Developer & Project Creator",
    avatar: "/contributors/meric.jpeg",
    description:
      "Full-stack developer passionate about blockchain technology and modern web applications. Creator of NEXUSUI platform.",
    skills: ["React", "Next.js", "TypeScript", "Sui", "Move"],
    links: {
      github: "https://github.com/mericcintosun",
      linkedin: "#",
      twitter: "#",
    },
  },
];

const partners = [
  {
    name: "Sui",
    logo: CircleDot,
    description:
      "Layer 1 blockchain designed to make digital asset ownership fast, private, secure, and accessible to everyone.",
    website: "https://sui.io",
    type: "Blockchain Platform",
  },
  {
    name: "OverBlock",
    logo: Building,
    description:
      "Innovative blockchain solutions company focused on DeFi and smart contract development.",
    website: "https://overblock.io",
    type: "Development Company",
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

export default function ContributorsPage() {
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
              Meet Our
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {" "}
                Team
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              The brilliant minds behind NEXUSUI, working together to build the
              future of decentralized applications.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contributors Section */}
      <motion.section
        className="py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Core Contributors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The talented developers and innovators driving NEXUSUI forward
            </p>
          </div>

          {/* Meriç - Lead Developer - Top Center */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <div className="card p-8 text-center">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-3 border-primary/30 shadow-xl mx-auto mb-6 image-container">
                <img
                  src={contributors[0].avatar}
                  alt={contributors[0].name}
                  className="w-full h-full contributor-image"
                  loading="lazy"
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {contributors[0].name}
              </h3>
              <p className="text-primary font-medium mb-4 text-lg">
                {contributors[0].role}
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {contributors[0].description}
              </p>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Skills & Expertise
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {contributors[0].skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 justify-center">
                <a
                  href={contributors[0].links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={contributors[0].links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={contributors[0].links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Partners Section */}
      <motion.section
        className="py-20 px-4 bg-card/50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Strategic Partners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Working with industry leaders to build the future of blockchain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {partners.map((partner, index) => {
              const LogoIcon = partner.logo;
              return (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="card p-8 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LogoIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-primary font-medium mb-4">
                    {partner.type}
                  </p>
                  <p className="text-muted-foreground mb-6">
                    {partner.description}
                  </p>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Join Us Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Join the NEXUSUI Community
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Interested in contributing to NEXUSUI? We're always looking for
              talented developers, designers, and blockchain enthusiasts to join
              our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/mericcintosun/assignment-sui-workshop"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Github className="w-4 h-4 mr-2" />
                Contribute on GitHub
              </a>
              <a href="/about" className="btn-secondary">
                <Award className="w-4 h-4 mr-2" />
                Learn More
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
