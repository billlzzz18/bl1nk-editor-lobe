'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const skills = [
  { id: 1, name: 'Code Analyzer', status: 'active', uses: 1245 },
  { id: 2, name: 'Data Visualization', status: 'active', uses: 892 },
  { id: 3, name: 'API Documentation', status: 'active', uses: 756 },
  { id: 4, name: 'Security Scanner', status: 'beta', uses: 334 },
  { id: 5, name: 'Knowledge Base', status: 'active', uses: 2103 },
  { id: 6, name: 'Chat Assistant', status: 'active', uses: 1876 },
];

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Skills Library</h1>
            <p className="text-gray-600">Pre-built AI skills for various development tasks</p>
          </div>
          <Link href="/">
            <Button variant="outline">← Home</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Card key={skill.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <Badge variant={skill.status === 'active' ? 'default' : 'secondary'}>
                  {skill.status}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Used {skill.uses.toLocaleString()} times
              </p>
              
              <Button className="w-full" size="sm">
                Use Skill
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
