import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { data: apiKeys, refetch } = trpc.apiKeys.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createKeyMutation = trpc.apiKeys.create.useMutation({
    onSuccess: () => {
      setNewKeyName("");
      refetch();
    },
  });

  const revokeKeyMutation = trpc.apiKeys.revoke.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    await createKeyMutation.mutateAsync({ name: newKeyName });
  };

  const handleRevokeKey = async (keyId: number) => {
    if (confirm("Are you sure you want to revoke this API key?")) {
      await revokeKeyMutation.mutateAsync({ keyId });
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Developer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your API keys and integrate Bl1nkOS with your applications
          </p>
        </div>

        {/* API Keys Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">API Keys</h2>
            <Button
              onClick={handleCreateKey}
              disabled={!newKeyName.trim() || createKeyMutation.isPending}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Key
            </Button>
          </div>

          {/* Create New Key Form */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex gap-2">
              <Input
                placeholder="Enter API key name (e.g., 'Production API')"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleCreateKey();
                }}
              />
              <Button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim() || createKeyMutation.isPending}
              >
                Add
              </Button>
            </div>
          </div>

          {/* API Keys List */}
          <div className="space-y-3">
            {apiKeys && apiKeys.length > 0 ? (
              apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{key.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {key.key}
                      {key.lastUsedAt && (
                        <span className="ml-2">
                          Last used: {new Date(key.lastUsedAt).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyKey(key.key)}
                    >
                      <Copy className="w-4 h-4" />
                      {copiedKey === key.key ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeKey(key.id)}
                      disabled={revokeKeyMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No API keys yet. Create one to get started.
              </p>
            )}
          </div>
        </Card>

        {/* Documentation Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Start</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Get Your API Key</h3>
              <p className="text-muted-foreground">
                Create an API key above to authenticate your requests.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Read the Documentation</h3>
              <p className="text-muted-foreground">
                Visit our{" "}
                <a href="/docs" className="text-primary hover:underline">
                  API documentation
                </a>{" "}
                to learn how to use our endpoints.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Start Building</h3>
              <p className="text-muted-foreground">
                Use your API key to integrate Bl1nkOS into your application.
              </p>
            </div>
          </div>
        </Card>

        {/* Code Example */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Example Usage</h2>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`curl -X GET https://api.bl1nk.app/v1/memory \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
          </pre>
        </Card>
      </div>
    </DashboardLayout>
  );
}
