'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Bot, 
  FileText, 
  CheckCircle2, 
  Palette, 
  Shield, 
  Zap,
  Database,
  Settings,
  Users
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export function FeaturesSection() {
  const features = [
    {
      title: "AI Agents",
      description: "10+ specialized AI agents working for you including Code Specialist, Design Agent, and more.",
      icon: Bot,
      color: "text-blue-500"
    },
    {
      title: "Marketplace",
      description: "Install and manage AI tools and extensions from our comprehensive marketplace.",
      icon: Database,
      color: "text-green-500"
    },
    {
      title: "Markdown Editor",
      description: "Advanced markdown editor with real-time preview and syntax highlighting.",
      icon: FileText,
      color: "text-purple-500"
    },
    {
      title: "Todo System",
      description: "Dynamic Island-inspired todo system with beautiful macOS-like interface.",
      icon: CheckCircle2,
      color: "text-orange-500"
    },
    {
      title: "Modern UI",
      description: "Beautiful, accessible components with smooth animations and responsive design.",
      icon: Palette,
      color: "text-pink-500"
    },
    {
      title: "Multi-Auth",
      description: "Support for multiple authentication methods including Google and GitHub.",
      icon: Shield,
      color: "text-red-500"
    },
    {
      title: "Real-time",
      description: "Live dashboard with real-time updates and performance monitoring.",
      icon: Zap,
      color: "text-yellow-500"
    },
    {
      title: "Team Ready",
      description: "Built for both individual developers and collaborative teams.",
      icon: Users,
      color: "text-indigo-500"
    },
    {
      title: "Customizable",
      description: "Highly customizable with theme support and extensible architecture.",
      icon: Settings,
      color: "text-teal-500"
    }
  ]

  return (
    <section id="features" className="py-20 bg-muted/20">
      <div className="blinkos-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete AI desktop application platform with all the tools you need to build the future
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="blinkos-card h-full hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
