'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

const tools = [
  {
    id: 1,
    name: 'AI Auto-Optimizer',
    description: 'Automatically optimizes your code for better performance',
    category: 'Performance',
    installed: false,
  },
  {
    id: 2,
    name: 'UI Builder Pro',
    description: 'Generate beautiful UI components instantly',
    category: 'Design',
    installed: true,
  },
  {
    id: 3,
    name: 'Backend Flow Agent',
    description: 'Manages backend logic and API integrations',
    category: 'Backend',
    installed: false,
  },
  {
    id: 4,
    name: 'Data Sync Pro',
    description: 'Synchronize data across multiple platforms',
    category: 'Data',
    installed: false,
  },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
            <p className="text-gray-600">Discover and install AI tools and extensions</p>
          </div>
          <Link href="/">
            <Button variant="outline">← Home</Button>
          </Link>
        </div>
        
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search tools, agents, extensions..." 
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
                </div>
                {tool.installed && (
                  <Badge variant="secondary">Installed</Badge>
                )}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline">{tool.category}</Badge>
                <Button size="sm" variant={tool.installed ? 'outline' : 'default'}>
                  {tool.installed ? 'Manage' : 'Install'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">My Installed Tools</h2>
          <div className="space-y-3">
            {tools.filter(t => t.installed).map((tool) => (
              <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{tool.name}</p>
                  <p className="text-sm text-gray-500">Version 1.0</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
