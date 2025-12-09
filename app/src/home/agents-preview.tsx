'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Code2, 
  Paintbrush, 
  Database, 
  Shield, 
  Server, 
  TestTube,
  FileText,
  TrendingUp,
  Bot,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  }
}

export function AgentsPreview() {
  const agents = [
    {
      name: "Code Specialist",
      description: "Expert in code generation, optimization, and debugging across multiple programming languages.",
      icon: Code2,
      status: "active",
      specialty: "Development"
    },
    {
      name: "Design Agent",
      description: "UI/UX design assistance with modern design principles and accessibility standards.",
      icon: Paintbrush,
      status: "active",
      specialty: "Design"
    },
    {
      name: "Database Expert",
      description: "Database design, optimization, and query generation for various database systems.",
      icon: Database,
      status: "active",
      specialty: "Data"
    },
    {
      name: "Security Analyst",
      description: "Security audits, vulnerability assessment, and security best practices recommendations.",
      icon: Shield,
      status: "active",
      specialty: "Security"
    },
    {
      name: "DevOps Engineer",
      description: "CI/CD pipeline setup, deployment automation, and infrastructure management.",
      icon: Server,
      status: "active",
      specialty: "Operations"
    },
    {
      name: "Testing Specialist",
      description: "Test generation, quality assurance, and automated testing strategies.",
      icon: TestTube,
      status: "active",
      specialty: "Quality"
    }
  ]

  return (
    <section className="py-20">
      <div className="blinkos-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Meet Your AI Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized AI agents ready to help you with every aspect of your development workflow
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {agents.map((agent, index) => (
            <motion.div key={agent.name} variants={itemVariants}>
              <Card className="blinkos-card h-full group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <agent.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {agent.specialty}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-muted-foreground capitalize">
                        {agent.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {agent.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">
              <Bot className="w-5 h-5 mr-2" />
              Explore All Agents
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
