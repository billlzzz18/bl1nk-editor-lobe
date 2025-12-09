import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_TITLE } from "@/const";

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-foreground hover:opacity-80">{APP_TITLE}</a>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <a className="text-muted-foreground hover:text-foreground transition">Home</a>
            </Link>
            <Link href="/pricing">
              <a className="text-muted-foreground hover:text-foreground transition">Pricing</a>
            </Link>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn how to use Bl1nkOS and integrate it with your applications.
        </p>
      </section>

      {/* Documentation Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Getting Started",
              description: "Learn the basics of Bl1nkOS and how to set up your first project.",
              items: ["Installation", "Configuration", "First Steps", "Best Practices"],
            },
            {
              title: "API Reference",
              description: "Complete API documentation for developers.",
              items: ["Authentication", "Documents", "Sync", "Webhooks"],
            },
            {
              title: "Guides",
              description: "In-depth guides for common tasks and workflows.",
              items: ["Markdown Syntax", "Collaboration", "Backup & Restore", "Migration"],
            },
            {
              title: "Plugin Development",
              description: "Build custom plugins and extensions for Bl1nkOS.",
              items: ["Plugin Architecture", "API Hooks", "Examples", "Publishing"],
            },
          ].map((section, idx) => (
            <Card key={idx} className="p-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">{section.title}</h3>
              <p className="text-muted-foreground mb-6">{section.description}</p>
              <ul className="space-y-2">
                {section.items.map((item, iidx) => (
                  <li key={iidx} className="flex items-center gap-2 text-foreground">
                    <span className="text-primary">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* API Endpoint Example */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl font-bold text-foreground mb-8">API Endpoints</h2>
        <Card className="p-8 bg-muted">
          <div className="space-y-6">
            {[
              {
                method: "GET",
                path: "/api/documents",
                description: "List all documents",
              },
              {
                method: "POST",
                path: "/api/documents",
                description: "Create a new document",
              },
              {
                method: "GET",
                path: "/api/documents/:id",
                description: "Get a specific document",
              },
              {
                method: "PUT",
                path: "/api/documents/:id",
                description: "Update a document",
              },
              {
                method: "DELETE",
                path: "/api/documents/:id",
                description: "Delete a document",
              },
            ].map((endpoint, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-6 border-b border-border last:border-b-0">
                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    endpoint.method === "GET" ? "bg-blue-100 text-blue-800" :
                    endpoint.method === "POST" ? "bg-green-100 text-green-800" :
                    endpoint.method === "PUT" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {endpoint.method}
                  </span>
                </div>
                <div className="flex-grow">
                  <code className="text-foreground font-mono">{endpoint.path}</code>
                  <p className="text-muted-foreground text-sm mt-1">{endpoint.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Code Examples */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl font-bold text-foreground mb-8">Code Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              language: "JavaScript",
              code: `const response = await fetch('/api/documents');
const documents = await response.json();
console.log(documents);`,
            },
            {
              language: "Python",
              code: `import requests
response = requests.get('/api/documents')
documents = response.json()
print(documents)`,
            },
          ].map((example, idx) => (
            <Card key={idx} className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{example.language}</h3>
              <pre className="bg-background p-4 rounded border border-border overflow-auto">
                <code className="text-sm text-foreground font-mono">{example.code}</code>
              </pre>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-foreground mb-6">Need Help?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Check out our FAQ or reach out to our support team.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">GitHub Issues</Button>
          </a>
          <a href="mailto:support@bl1nkos.com">
            <Button>Contact Support</Button>
          </a>
        </div>
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
