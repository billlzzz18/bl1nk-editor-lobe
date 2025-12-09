'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function IDEPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>
        
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-4">AI-Powered IDE</h1>
          <p className="text-gray-600 mb-8">
            Your intelligent development environment is loading...
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Code Editor</h3>
              <p className="text-sm text-gray-600">Monaco-based editor with AI assistance</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Terminal</h3>
              <p className="text-sm text-gray-600">Integrated terminal for command execution</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-2">AI Assistant</h3>
              <p className="text-sm text-gray-600">Context-aware coding help</p>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
}
