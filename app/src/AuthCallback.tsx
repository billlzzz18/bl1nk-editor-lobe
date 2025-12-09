import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the token from URL hash or query params
        const hash = window.location.hash;
        const params = new URLSearchParams(window.location.search);
        
        // Extract token from hash (format: #access_token=...&token_type=bearer)
        const hashParams = new URLSearchParams(hash.substring(1));
        const token = hashParams.get('access_token');
        
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        // Verify the token with backend
        const response = await fetch('/api/auth/verify-magic-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Failed to verify token');
        }

        const data = await response.json();
        
        if (data.success) {
          // Redirect to dashboard after successful authentication
          setLocation('/dashboard');
        } else {
          setError('Authentication failed');
        }
      } catch (err) {
        console.error('[Auth Callback] Error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setLoading(false);
      }
    };

    handleCallback();
  }, [setLocation]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Authentication Failed</h1>
          <p className="text-muted-foreground">{error}</p>
          <a href="/magic-link-login" className="text-primary hover:underline">
            ← Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Verifying your authentication...</p>
      </div>
    </div>
  );
}
