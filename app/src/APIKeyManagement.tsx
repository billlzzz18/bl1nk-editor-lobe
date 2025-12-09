import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { Loader2, Copy, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function APIKeyManagement() {
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDescription, setNewKeyDescription] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);

  // Fetch API keys
  const { data: apiKeys = [], isLoading: keysLoading } = trpc.developer.listApiKeys.useQuery();

  // Create API key mutation
  const createKeyMutation = trpc.developer.createApiKey.useMutation({
    onSuccess: () => {
      setNewKeyName('');
      setNewKeyDescription('');
      setShowNewKeyForm(false);
    },
  });

  // Revoke API key mutation
  const revokeKeyMutation = trpc.developer.revokeApiKey.useMutation();

  // Delete API key mutation
  const deleteKeyMutation = trpc.developer.deleteApiKey.useMutation();

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    await createKeyMutation.mutateAsync({
      name: newKeyName,
      description: newKeyDescription,
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-foreground">Bl1nkOS</a>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dev-docs">
              <a className="text-muted-foreground hover:text-foreground transition">Dev Docs</a>
            </Link>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">API Keys</h1>
              <p className="text-muted-foreground mt-2">
                Manage your API keys for programmatic access
              </p>
            </div>
            <Button
              onClick={() => setShowNewKeyForm(!showNewKeyForm)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Key
            </Button>
          </div>
        </div>

        {/* Create New Key Form */}
        {showNewKeyForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Create New API Key</h2>
            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production Server"
                  className="w-full px-4 py-2 rounded border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newKeyDescription}
                  onChange={(e) => setNewKeyDescription(e.target.value)}
                  placeholder="What will you use this key for?"
                  className="w-full px-4 py-2 rounded border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createKeyMutation.isPending || !newKeyName}
                >
                  {createKeyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Key'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewKeyForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* API Keys List */}
        <div className="space-y-4">
          {keysLoading ? (
            <Card className="p-6 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground mt-2">Loading API keys...</p>
            </Card>
          ) : apiKeys.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No API keys yet. Create one to get started.</p>
            </Card>
          ) : (
            apiKeys.map((key) => (
              <Card key={key.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{key.name}</h3>
                    {key.description && (
                      <p className="text-sm text-muted-foreground mt-1">{key.description}</p>
                    )}
                  </div>
                  {key.isRevoked && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Revoked
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">API Key</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-muted rounded font-mono text-sm text-foreground">
                        {visibleKeyId === key.id ? key.id : '••••••••••••••••••••'}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setVisibleKeyId(visibleKeyId === key.id ? null : key.id)
                        }
                      >
                        {visibleKeyId === key.id ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyKey(key.id)}
                      >
                        {copiedId === key.id ? (
                          <span className="text-xs">Copied!</span>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-foreground">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {key.lastUsedAt && (
                      <div>
                        <p className="text-xs text-muted-foreground">Last Used</p>
                        <p className="text-foreground">
                          {new Date(key.lastUsedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => revokeKeyMutation.mutate({ id: key.id })}
                    disabled={key.isRevoked || revokeKeyMutation.isPending}
                  >
                    {revokeKeyMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Revoking...
                      </>
                    ) : (
                      'Revoke'
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteKeyMutation.mutate({ id: key.id })}
                    disabled={deleteKeyMutation.isPending}
                  >
                    {deleteKeyMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Info Box */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Keep Your Keys Safe</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Never commit API keys to version control</li>
            <li>• Use environment variables to store keys</li>
            <li>• Rotate keys regularly for security</li>
            <li>• Revoke keys immediately if compromised</li>
          </ul>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2025 Bl1nkOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
