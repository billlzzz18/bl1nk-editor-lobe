'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  MessageSquare, 
  Zap, 
  ArrowRight, 
  Sparkles,
  Brain,
  Database,
  Globe,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Star,
  Github,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = [
    {
      icon: Code,
      title: "Advanced Code Editor",
      description: "Write, edit, and execute code with our intelligent Monaco-based editor",
      color: "blue"
    },
    {
      icon: Brain,
      title: "AI-Powered Skills",
      description: "Leverage pre-built AI skills for code analysis, data visualization, and more",
      color: "purple"
    },
    {
      icon: Database,
      title: "Knowledge Base",
      description: "Built-in RAG system with embedding models for intelligent document search",
      color: "green"
    },
    {
      icon: MessageSquare,
      title: "Persistent Chat",
      description: "Chat that remembers context and supports Markdown with syntax highlighting",
      color: "orange"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <motion.section 
        className="relative px-6 py-20 lg:py-32"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div 
            className="text-center space-y-8"
            variants={fadeInUp}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200"
            >
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Next-Generation Development Environment</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold tracking-tight"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-gray-900">Development Studio</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Experience the future of coding with our integrated IDE, AI skills system, 
              knowledge base, and intelligent chat assistant. Build faster, smarter, and more efficiently.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a href="/ide">
                  Launch IDE
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-white/50 transition-all duration-300"
                asChild
              >
                <a href="#features">
                  Explore Features
                </a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16"
              variants={fadeInUp}
            >
              {[
                { number: "50+", label: "AI Skills" },
                { number: "99%", label: "Uptime" },
                { number: "10k+", label: "Users" },
                { number: "24/7", label: "Support" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm lg:text-base text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features"
        className="px-6 py-20 bg-white/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Modern Development
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to build, deploy, and scale your applications with AI assistance
            </p>
          </motion.div>

          <motion.div 
            className="grid lg:grid-cols-2 gap-8 items-center"
            variants={staggerContainer}
          >
            {/* Feature Cards */}
            <motion.div className="space-y-4" variants={fadeInUp}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = index === currentFeature;
                const colorMap = {
                  blue: 'border-blue-200 bg-blue-50 text-blue-900',
                  purple: 'border-purple-200 bg-purple-50 text-purple-900',
                  green: 'border-green-200 bg-green-50 text-green-900',
                  orange: 'border-orange-200 bg-orange-50 text-orange-900'
                };
                
                return (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      isActive 
                        ? colorMap[feature.color as keyof typeof colorMap] + ' shadow-lg scale-105'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => setCurrentFeature(index)}
                    whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        isActive ? 'bg-white shadow-md' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          isActive ? 'text-current' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-2 ${
                          isActive ? 'text-current' : 'text-gray-900'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className={`text-sm ${
                          isActive ? 'text-current opacity-80' : 'text-gray-600'
                        }`}>
                          {feature.description}
                        </p>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-current"
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Interactive Demo */}
            <motion.div 
              className="relative"
              variants={fadeInUp}
            >
              <Card className="overflow-hidden border-2 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <CardTitle className="text-lg">
                      {features[currentFeature].title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {(() => {
                          const Icon = features[currentFeature].icon;
                          return <Icon className="h-5 w-5 text-blue-600" />;
                        })()}
                      </div>
                      <Badge variant="secondary">{features[currentFeature].title}</Badge>
                    </div>
                    <p className="text-gray-600">{features[currentFeature].description}</p>
                    
                    {/* Mock Content */}
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <div className="opacity-60">$ npm run dev</div>
                      <div className="text-blue-400">Starting development server...</div>
                      <div className="opacity-60">✓ AI Skills loaded</div>
                      <div className="opacity-60">✓ Knowledge base indexed</div>
                      <div className="opacity-60">✓ Chat initialized</div>
                      <div className="text-green-400">✓ Ready!</div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* AI Skills Showcase */}
      <motion.section 
        className="px-6 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Extensive AI Skills Library
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pre-built AI skills for code analysis, data visualization, documentation generation, and more
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
          >
            {[
              {
                icon: Code,
                title: "Code Analyzer",
                description: "Real-time code quality analysis with security scanning",
                status: "active",
                tools: ["ESLint", "TypeScript", "Security"]
              },
              {
                icon: TrendingUp,
                title: "Data Visualization",
                description: "Generate interactive charts from your data",
                status: "active",
                tools: ["D3.js", "Chart.js", "Plotly"]
              },
              {
                icon: Database,
                title: "API Documentation",
                description: "Auto-generate API docs from OpenAPI specs",
                status: "active",
                tools: ["Swagger", "OpenAPI", "Markdown"]
              },
              {
                icon: Shield,
                title: "Security Scanner",
                description: "Comprehensive security vulnerability assessment",
                status: "beta",
                tools: ["Semgrep", "Bandit", "OWASP"]
              },
              {
                icon: Globe,
                title: "Knowledge Base",
                description: "RAG-powered document search and retrieval",
                status: "active",
                tools: ["Embeddings", "Vector DB", "Search"]
              },
              {
                icon: MessageSquare,
                title: "Chat Assistant",
                description: "Context-aware chat with Markdown support",
                status: "active",
                tools: ["LLM", "Memory", "Markdown"]
              }
            ].map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <Badge 
                          variant={skill.status === 'active' ? 'default' : 'secondary'}
                          className={skill.status === 'beta' ? 'bg-yellow-100 text-yellow-800' : ''}
                        >
                          {skill.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{skill.title}</CardTitle>
                      <CardDescription>{skill.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {skill.tools.map((tool, toolIndex) => (
                          <Badge key={toolIndex} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            variants={fadeInUp}
          >
            <Button size="lg" variant="outline" asChild>
              <a href="/skills">
                Explore All Skills
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="px-6 py-20 bg-gradient-to-r from-blue-600 to-indigo-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Development?
            </h2>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              Join thousands of developers using AI-powered tools to build better software faster
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl"
                asChild
              >
                <a href="/ide">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl"
                asChild
              >
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">AI Dev Studio</h3>
              <p className="text-gray-400 text-sm">
                Next-generation development environment powered by AI
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/ide" className="hover:text-white transition-colors">Code Editor</a></li>
                <li><a href="/skills" className="hover:text-white transition-colors">AI Skills</a></li>
                <li><a href="/chat" className="hover:text-white transition-colors">Chat Assistant</a></li>
                <li><a href="/knowledge" className="hover:text-white transition-colors">Knowledge Base</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/examples" className="hover:text-white transition-colors">Examples</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 AI Dev Studio. Built with ❤️ by MiniMax Agent.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}