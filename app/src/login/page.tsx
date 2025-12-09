import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Github, Mail } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  if (isAuthenticated && user) {
    setLocation("/dashboard");
    return null;
  }

  const githubMutation = trpc.oauth.github.useMutation({
    onSuccess: (data) => {
      setMessage(`✓ ${data.message}`);
      // In a real app, redirect to GitHub OAuth
    },
  });

  const googleMutation = trpc.oauth.google.useMutation({
    onSuccess: (data) => {
      setMessage(`✓ ${data.message}`);
      // In a real app, redirect to Google OAuth
    },
  });

  const emailMutation = trpc.oauth.email.useMutation({
    onSuccess: (data) => {
      setMessage(`✓ ${data.message}`);
      setEmail("");
    },
  });

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    await githubMutation.mutateAsync({});
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await googleMutation.mutateAsync({});
    setIsLoading(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    await emailMutation.mutateAsync({ email });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Bl1nkOS</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* OAuth Login Options */}
        <div className="space-y-3 mb-6">
          <Button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </Button>

          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        {/* Email Login */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Send Magic Link
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <a href="/" className="text-primary hover:underline">
            Learn more
          </a>
        </p>
      </Card>
    </div>
  );
}
