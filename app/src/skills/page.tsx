"use client"

import { SkillsHub } from "@/components/skills/skills-hub"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Zap, Users, Github } from "lucide-react"

export default function SkillsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Skills</h1>
          <p className="text-muted-foreground">
            Manage and create agent skills that extend AI model capabilities
          </p>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Available skills
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Official</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Verified skills
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              User contributed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repository</CardTitle>
            <Github className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="outline">GitHub</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Open source
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Skills Hub */}
      <SkillsHub />

      {/* Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>What are Agent Skills?</CardTitle>
            <CardDescription>
              Agent Skills are packages of code, configurations, and resources that extend AI model capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Key Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Code execution in secure containers</li>
                <li>• Virtual file system for Monaco editor integration</li>
                <li>• Version management and publishing</li>
                <li>• Provider-agnostic (works with any LLM)</li>
                <li>• Real-time execution monitoring</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>
              Get started with agent skills in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Steps:</h4>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Browse available skills or create new ones</li>
                <li>2. Upload or create skill with SKILL.md manifest</li>
                <li>3. Edit code using the integrated Monaco editor</li>
                <li>4. Test and publish your skill</li>
                <li>5. Use skills in chat conversations</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}