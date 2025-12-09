import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_TITLE } from "@/const";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">{APP_TITLE}</div>
          <div className="flex items-center gap-4">
            <Link href="/pricing">
              <a className="text-muted-foreground hover:text-foreground transition">Pricing</a>
            </Link>
            <Link href="/docs">
              <a className="text-muted-foreground hover:text-foreground transition">Docs</a>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Link href="/magic-link-login">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            The Future of Collaborative Editing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bl1nkOS is a powerful, open-source markdown editor with local-first sync,
            built for teams and individuals who value privacy and control.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/pricing">
              <Button size="lg" className="flex items-center gap-2">
                Get Started →
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                Read Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">Why Choose Bl1nkOS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Local-First Architecture",
                description: "Your data stays on your device. Sync only when you want to.",
              },
              {
                title: "Lightning Fast",
                description: "Optimized performance with instant sync across your devices.",
              },
              {
                title: "Developer Friendly",
                description: "Open API and plugin system for unlimited extensibility.",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already using Bl1nkOS to manage their notes and documents.
        </p>
        <Link href="/pricing">
          <Button size="lg" className="flex items-center gap-2 mx-auto">
            View Pricing →
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/pricing"><a className="hover:text-foreground">Pricing</a></Link></li>
                <li><Link href="/docs"><a className="hover:text-foreground">Documentation</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about"><a className="hover:text-foreground">About</a></Link></li>
                <li><Link href="/blog"><a className="hover:text-foreground">Blog</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/privacy"><a className="hover:text-foreground">Privacy</a></Link></li>
                <li><Link href="/terms"><a className="hover:text-foreground">Terms</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Bl1nkOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
