"use client";

import { motion } from "framer-motion";
import { User, Github, ExternalLink } from "lucide-react";
import Navbar from "../../components/Navbar";

const skills = [
  { name: "React & Next.js", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Blockchain Development", level: 85 },
  { name: "Smart Contracts", level: 80 },
  { name: "UI/UX Design", level: 85 },
  { name: "Node.js & Backend", level: 80 },
];

const experiences = [
  {
    title: "Full Stack Developer",
    company: "Freelance",
    period: "2023 - Present",
    description:
      "Building modern web applications with React, Next.js, and blockchain technologies.",
    technologies: ["React", "Next.js", "TypeScript", "Sui", "Solidity"],
  },
  {
    title: "Blockchain Developer",
    company: "Personal Projects",
    period: "2022 - Present",
    description:
      "Developing smart contracts and dApps on various blockchain platforms.",
    technologies: ["Move", "Solidity", "Web3.js", "Ethers.js"],
  },
  {
    title: "Frontend Developer",
    company: "Open Source",
    period: "2021 - Present",
    description:
      "Contributing to open source projects and building developer tools.",
    technologies: ["React", "Vue.js", "Tailwind CSS", "Framer Motion"],
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

export default function AboutPage() {
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
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                About the
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {" "}
                  Developer
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Passionate about building the future of web applications with
                blockchain technology
              </p>
            </motion.div>

            {/* Developer Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={itemVariants}>
                <div className="card p-8">
                  <div className="text-center mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/60 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                      <img
                        src="/contributors/meric.jpeg"
                        alt="Meriç Cintosun"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Meriç Cintosun
                    </h2>
                    <p className="text-primary font-medium">
                      Lead Developer & nexuSUI Creator
                    </p>
                  </div>

                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      I'm a passionate developer focused on creating modern,
                      scalable web applications that leverage the power of
                      blockchain technology. With expertise in React, Next.js,
                      and various blockchain platforms, I build applications
                      that bridge the gap between traditional web development
                      and the decentralized future.
                    </p>
                    <p>
                      nexuSUI represents my commitment to sharing knowledge and
                      building innovative solutions in the blockchain space.
                      This platform serves as both a showcase of technical
                      expertise and a practical resource for developers
                      exploring the Sui ecosystem.
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {[
                      "React",
                      "Next.js",
                      "TypeScript",
                      "Sui",
                      "Move",
                      "Web3",
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="card p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    Skills & Expertise
                  </h3>
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-foreground font-medium">
                            {skill.name}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Experience Section */}
      <motion.section
        className="py-20 px-4 bg-card/50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Experience & Projects
              </h2>
              <p className="text-lg text-muted-foreground">
                My journey in software development and blockchain technology
              </p>
            </div>

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {exp.title}
                      </h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                    <span className="text-muted-foreground text-sm mt-2 md:mt-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-background text-foreground rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Let's Connect
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Interested in blockchain development or want to collaborate on a
              project?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/mericcintosun"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center space-x-2"
              >
                <Github className="w-5 h-5" />
                <span>GitHub Profile</span>
              </a>
              <a
                href="https://github.com/mericcintosun/assignment-sui-workshop"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>View This Project</span>
              </a>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
