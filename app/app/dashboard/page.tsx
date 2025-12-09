'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/">
            <Button variant="outline">← Home</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Projects</h3>
            <p className="text-3xl font-bold">12</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">AI Skills Used</h3>
            <p className="text-3xl font-bold">45</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Time Saved</h3>
            <p className="text-3xl font-bold">28h</p>
          </Card>
        </div>
        
        <Card className="p-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">AI</span>
              </div>
              <div>
                <p className="font-medium">Code optimization completed</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">✓</span>
              </div>
              <div>
                <p className="font-medium">Project deployed successfully</p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
