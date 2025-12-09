'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  Database, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ArrowRight,
  Download,
  Upload,
  Settings
} from 'lucide-react';

interface NotionSyncProps {
  agents: any[];
  onSyncComplete?: (result: any) => void;
}

export default function NotionSyncManager({ agents, onSyncComplete }: NotionSyncProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [config, setConfig] = useState({
    token: '',
    databaseId: '',
    autoSync: false,
    syncInterval: 3600 // 1 hour in seconds
  });
  const [activeTab, setActiveTab] = useState('sync');

  const handleSync = useCallback(async () => {
    setIsLoading(true);
    setSyncResult(null);

    try {
      // Sync agents to Notion
      const response = await fetch('/api/notion-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync',
          agents,
          config: {
            token: config.token,
            databaseId: config.databaseId
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSyncResult({
          type: 'success',
          message: result.message,
          agentsCount: agents.length,
          timestamp: new Date().toISOString()
        });
        onSyncComplete?.(result);
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (error) {
      setSyncResult({
        type: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  }, [agents, config, onSyncComplete]);

  const handleCreateStore = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/notion-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-store',
          agents,
          config: {
            token: config.token,
            databaseId: config.databaseId
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSyncResult({
          type: 'success',
          message: `Store page created successfully! Page ID: ${result.pageId}`,
          pageId: result.pageId,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error(result.error || 'Store creation failed');
      }
    } catch (error) {
      setSyncResult({
        type: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  }, [agents, config]);

  const exportIndex = useCallback(() => {
    const dataStr = JSON.stringify(agents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-index-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [agents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notion Sync Manager</h2>
          <p className="text-muted-foreground">
            Sync your agent index to Notion for web-based store display
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportIndex}>
            <Download className="h-4 w-4 mr-2" />
            Export Index
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold">{agents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {agents.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Beta</p>
                <p className="text-2xl font-bold">
                  {agents.filter(a => a.status === 'beta').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Deprecated</p>
                <p className="text-2xl font-bold">
                  {agents.filter(a => a.status === 'deprecated').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sync">Sync Settings</TabsTrigger>
          <TabsTrigger value="store">Create Store</TabsTrigger>
          <TabsTrigger value="status">Sync Status</TabsTrigger>
        </TabsList>

        {/* Sync Settings Tab */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notion Configuration</CardTitle>
              <CardDescription>
                Configure your Notion integration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notion-token">Notion Integration Token</Label>
                <Input
                  id="notion-token"
                  type="password"
                  placeholder="secret_xxx..."
                  value={config.token}
                  onChange={(e) => setConfig(prev => ({ ...prev, token: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  Get your token from{' '}
                  <a 
                    href="https://www.notion.so/my-integrations" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Notion Integrations
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="database-id">Database ID</Label>
                <Input
                  id="database-id"
                  placeholder="Database ID from your Notion database"
                  value={config.databaseId}
                  onChange={(e) => setConfig(prev => ({ ...prev, databaseId: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-sync"
                  checked={config.autoSync}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoSync: checked }))}
                />
                <Label htmlFor="auto-sync">Enable auto-sync</Label>
              </div>

              <Button 
                onClick={handleSync} 
                disabled={isLoading || !config.token || !config.databaseId}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Syncing...' : 'Sync to Notion'}
              </Button>
            </CardContent>
          </Card>

          {/* Database Schema */}
          <Card>
            <CardHeader>
              <CardTitle>Required Database Properties</CardTitle>
              <CardDescription>
                Your Notion database should have these properties:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Text Properties</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <code>Agent ID</code> (Rich Text)</li>
                    <li>• <code>Version</code> (Rich Text)</li>
                    <li>• <code>Description</code> (Rich Text)</li>
                    <li>• <code>Author</code> (Rich Text)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Select Properties</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <code>Category</code> (Select)</li>
                    <li>• <code>Language</code> (Select)</li>
                    <li>• <code>Status</code> (Select)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Multi-Select Properties</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <code>Tools</code> (Multi-Select)</li>
                    <li>• <code>Tags</code> (Multi-Select)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Other Properties</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <code>Name</code> (Title)</li>
                    <li>• <code>Endpoint</code> (URL)</li>
                    <li>• <code>Last Updated</code> (Date)</li>
                    <li>• <code>Created</code> (Date)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Store Tab */}
        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Public Store Page</CardTitle>
              <CardDescription>
                Generate a public-facing store page in Notion for your agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What this creates:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• A public Notion page showcasing all your agents</li>
                  <li>• Organized by categories with detailed descriptions</li>
                  <li>• Includes version info, tools, and tags</li>
                  <li>• Shareable link for external users</li>
                </ul>
              </div>

              <Button 
                onClick={handleCreateStore} 
                disabled={isLoading || !config.token || !config.databaseId}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Creating Store...' : 'Create Store Page'}
              </Button>
            </CardContent>
          </Card>

          {/* Store Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Store Preview</CardTitle>
              <CardDescription>
                Preview of how your store will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.slice(0, 3).map((agent, index) => (
                  <div key={agent.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{agent.name}</h4>
                      <Badge variant="outline">{agent.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.tools.slice(0, 3).map(tool => (
                        <Badge key={tool} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                      {agent.tools.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{agent.tools.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {agents.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    ...and {agents.length - 3} more agents
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Status Tab */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sync Activity</CardTitle>
              <CardDescription>
                Check the status of your latest sync operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {syncResult ? (
                <Alert className={syncResult.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  {syncResult.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={syncResult.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    <div className="space-y-1">
                      <p className="font-semibold">{syncResult.message}</p>
                      {syncResult.agentsCount && (
                        <p>Synced {syncResult.agentsCount} agents</p>
                      )}
                      {syncResult.pageId && (
                        <p>Page ID: {syncResult.pageId}</p>
                      )}
                      <p className="text-xs opacity-70">
                        {new Date(syncResult.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No sync activity yet. Start a sync to see results here.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Auto-sync Status */}
          <Card>
            <CardHeader>
              <CardTitle>Auto-sync Status</CardTitle>
              <CardDescription>
                Configure automatic synchronization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Auto-sync Enabled</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync agents every {Math.floor(config.syncInterval / 3600)} hour(s)
                  </p>
                </div>
                <Switch checked={config.autoSync} />
              </div>
              
              {config.autoSync && (
                <div className="text-sm text-muted-foreground">
                  <p>Next sync scheduled: {new Date(Date.now() + config.syncInterval * 1000).toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}