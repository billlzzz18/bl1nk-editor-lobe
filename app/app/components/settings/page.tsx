// Main Settings Page
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Palette, 
  Cpu, 
  Bell,
  Key,
  Database,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const settingsCategories = [
  {
    title: 'Profile',
    description: 'Manage your personal information and avatar',
    icon: User,
    href: '/settings/profile',
    color: 'text-blue-500',
  },
  {
    title: 'Preferences',
    description: 'Customize your experience and app behavior',
    icon: SettingsIcon,
    href: '/settings/preferences',
    color: 'text-purple-500',
  },
  {
    title: 'Security',
    description: 'Password, 2FA, and security settings',
    icon: Shield,
    href: '/settings/security',
    color: 'text-green-500',
  },
  {
    title: 'Appearance',
    description: 'Theme, colors, and visual customization',
    icon: Palette,
    href: '/settings/appearance',
    color: 'text-pink-500',
  },
  {
    title: 'AI Models',
    description: 'Configure AI agents and model settings',
    icon: Cpu,
    href: '/settings/ai-models',
    color: 'text-orange-500',
  },
  {
    title: 'Notifications',
    description: 'Manage notification preferences',
    icon: Bell,
    href: '/settings/notifications',
    color: 'text-yellow-500',
  },
  {
    title: 'API Keys',
    description: 'Manage API keys and integrations',
    icon: Key,
    href: '/settings/api-keys',
    color: 'text-cyan-500',
  },
  {
    title: 'Data & Storage',
    description: 'Data management and storage settings',
    icon: Database,
    href: '/settings/data',
    color: 'text-indigo-500',
  },
  {
    title: 'Language & Region',
    description: 'Language, timezone, and regional settings',
    icon: Globe,
    href: '/settings/region',
    color: 'text-red-500',
  },
]

export default function SettingsPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Settings Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {settingsCategories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={category.href}>
              <Card className="blinkos-card hover:shadow-lg transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-muted group-hover:scale-110 transition-transform`}>
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="blinkos-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common settings and tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/settings/profile">
                Edit Profile
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/settings/security">
                Change Password
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/settings/appearance">
                Change Theme
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/settings/data">
                Export Data
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="blinkos-card">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{session.user?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{session.user?.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Account Type:</span>
              <span className="font-medium">Pro</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Member Since:</span>
              <span className="font-medium">January 2024</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
