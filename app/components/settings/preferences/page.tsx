// Preferences Settings Page
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useNotifications } from '@/hooks/use-notifications'

export default function PreferencesPage() {
  const { data: session } = useSession()
  const { success } = useNotifications()
  
  // State for preferences
  const [preferences, setPreferences] = useState({
    autoSave: true,
    showLineNumbers: true,
    enableSyntaxHighlight: true,
    autoComplete: true,
    editorFontSize: '14',
    tabSize: '2',
    wordWrap: true,
    minimap: true,
    compactMode: false,
    animations: true,
    soundEffects: false,
    showPresence: true,
    autoUpdateApps: true,
    telemetry: false,
  })

  if (!session) {
    redirect('/auth/login')
  }

  const handleSave = () => {
    // Save preferences to API
    success('Preferences saved', 'Your preferences have been updated successfully')
  }

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold gradient-text">Preferences</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>

      {/* Editor Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="blinkos-card">
          <CardHeader>
            <CardTitle>Editor</CardTitle>
            <CardDescription>Markdown editor preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">Auto Save</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save changes while typing
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={preferences.autoSave}
                onCheckedChange={(checked) => updatePreference('autoSave', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="line-numbers">Show Line Numbers</Label>
                <p className="text-sm text-muted-foreground">
                  Display line numbers in the editor
                </p>
              </div>
              <Switch
                id="line-numbers"
                checked={preferences.showLineNumbers}
                onCheckedChange={(checked) => updatePreference('showLineNumbers', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="syntax-highlight">Syntax Highlighting</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight code syntax in markdown
                </p>
              </div>
              <Switch
                id="syntax-highlight"
                checked={preferences.enableSyntaxHighlight}
                onCheckedChange={(checked) => updatePreference('enableSyntaxHighlight', checked)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Select
                value={preferences.editorFontSize}
                onValueChange={(value) => updatePreference('editorFontSize', value)}
              >
                <SelectTrigger id="font-size">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12px</SelectItem>
                  <SelectItem value="14">14px</SelectItem>
                  <SelectItem value="16">16px</SelectItem>
                  <SelectItem value="18">18px</SelectItem>
                  <SelectItem value="20">20px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tab-size">Tab Size</Label>
              <Select
                value={preferences.tabSize}
                onValueChange={(value) => updatePreference('tabSize', value)}
              >
                <SelectTrigger id="tab-size">
                  <SelectValue placeholder="Select tab size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                  <SelectItem value="8">8 spaces</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interface Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="blinkos-card">
          <CardHeader>
            <CardTitle>Interface</CardTitle>
            <CardDescription>UI and display preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-mode">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce spacing and use compact layouts
                </p>
              </div>
              <Switch
                id="compact-mode"
                checked={preferences.compactMode}
                onCheckedChange={(checked) => updatePreference('compactMode', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations">Enable Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Show smooth transitions and animations
                </p>
              </div>
              <Switch
                id="animations"
                checked={preferences.animations}
                onCheckedChange={(checked) => updatePreference('animations', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound-effects">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds for notifications and actions
                </p>
              </div>
              <Switch
                id="sound-effects"
                checked={preferences.soundEffects}
                onCheckedChange={(checked) => updatePreference('soundEffects', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-presence">Show User Presence</Label>
                <p className="text-sm text-muted-foreground">
                  Display online users and collaboration features
                </p>
              </div>
              <Switch
                id="show-presence"
                checked={preferences.showPresence}
                onCheckedChange={(checked) => updatePreference('showPresence', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="blinkos-card">
          <CardHeader>
            <CardTitle>System</CardTitle>
            <CardDescription>System and performance settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-update">Auto Update Apps</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically update installed apps
                </p>
              </div>
              <Switch
                id="auto-update"
                checked={preferences.autoUpdateApps}
                onCheckedChange={(checked) => updatePreference('autoUpdateApps', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="telemetry">Usage Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Help improve Bl1nkOS by sending anonymous usage data
                </p>
              </div>
              <Switch
                id="telemetry"
                checked={preferences.telemetry}
                onCheckedChange={(checked) => updatePreference('telemetry', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
