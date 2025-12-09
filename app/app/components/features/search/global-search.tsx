// Global Search Component (⌘K / Ctrl+K)
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  FileText,
  Settings,
  Home,
  Bot,
  ShoppingCart,
  CheckSquare,
  User,
  Search,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SearchResult {
  id: string
  title: string
  description?: string
  category: string
  icon: React.ReactNode
  href: string
  keywords?: string[]
}

export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  // Define searchable items
  const searchableItems: SearchResult[] = [
    // Pages
    {
      id: 'home',
      title: 'Home',
      description: 'Go to home page',
      category: 'Pages',
      icon: <Home className="h-4 w-4" />,
      href: '/',
      keywords: ['home', 'start', 'main'],
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View your dashboard',
      category: 'Pages',
      icon: <TrendingUp className="h-4 w-4" />,
      href: '/dashboard',
      keywords: ['dashboard', 'overview', 'stats'],
    },
    {
      id: 'agents',
      title: 'AI Agents',
      description: 'Manage AI agents',
      category: 'Pages',
      icon: <Bot className="h-4 w-4" />,
      href: '/agents',
      keywords: ['agents', 'ai', 'bots'],
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Browse tools and extensions',
      category: 'Pages',
      icon: <ShoppingCart className="h-4 w-4" />,
      href: '/marketplace',
      keywords: ['marketplace', 'tools', 'extensions'],
    },
    {
      id: 'editor',
      title: 'Markdown Editor',
      description: 'Create and edit markdown',
      category: 'Pages',
      icon: <FileText className="h-4 w-4" />,
      href: '/editor',
      keywords: ['editor', 'markdown', 'write'],
    },
    {
      id: 'todos',
      title: 'Todos',
      description: 'Manage your tasks',
      category: 'Pages',
      icon: <CheckSquare className="h-4 w-4" />,
      href: '/todos',
      keywords: ['todos', 'tasks', 'checklist'],
    },

    // Settings
    {
      id: 'settings',
      title: 'Settings',
      description: 'App settings and preferences',
      category: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      href: '/settings',
      keywords: ['settings', 'preferences', 'config'],
    },
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Edit your profile',
      category: 'Settings',
      icon: <User className="h-4 w-4" />,
      href: '/settings/profile',
      keywords: ['profile', 'account', 'user'],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      category: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      href: '/settings/preferences',
      keywords: ['preferences', 'customize', 'options'],
    },
  ]

  // Handle keyboard shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Search logic
  useEffect(() => {
    if (!search) {
      setResults([])
      return
    }

    const searchLower = search.toLowerCase()
    const filtered = searchableItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(searchLower)
      const descMatch = item.description?.toLowerCase().includes(searchLower)
      const keywordMatch = item.keywords?.some(k => k.includes(searchLower))
      return titleMatch || descMatch || keywordMatch
    })

    setResults(filtered)
  }, [search])

  // Handle selection
  const handleSelect = useCallback((href: string) => {
    setOpen(false)
    setSearch('')
    router.push(href)
  }, [router])

  // Group results by category
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = []
    }
    acc[result.category].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search pages, settings, and more..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          {!search && (
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-6">
                <Search className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Start typing to search...
                </p>
              </div>
            </CommandEmpty>
          )}

          {search && results.length === 0 && (
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-6">
                <Search className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No results found for "{search}"
                </p>
              </div>
            </CommandEmpty>
          )}

          {Object.entries(groupedResults).map(([category, items], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={category}>
                {items.map(item => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleSelect(item.href)}
                    className="flex items-center gap-3 py-3 cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </motion.div>
          ))}

          {/* Recent Searches (placeholder) */}
          {!search && (
            <CommandGroup heading="Recent">
              <CommandItem disabled className="text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                No recent searches
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
