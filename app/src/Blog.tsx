import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_TITLE } from "@/const";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "Introducing Bl1nkOS: The Future of Local-First Editing",
      excerpt: "We are excited to announce the launch of Bl1nkOS, a revolutionary markdown editor built on local-first principles.",
      date: "2025-01-15",
      author: "Alex Johnson",
      category: "Announcement",
    },
    {
      id: 2,
      title: "Understanding Local-First Computing",
      excerpt: "Learn what local-first computing means and why it matters for your data privacy and security.",
      date: "2025-01-10",
      author: "Sarah Chen",
      category: "Technology",
    },
    {
      id: 3,
      title: "Building Better Collaboration Tools",
      excerpt: "Exploring the principles behind building collaboration tools that respect user privacy.",
      date: "2025-01-05",
      author: "Mike Rodriguez",
      category: "Design",
    },
    {
      id: 4,
      title: "Bl1nkOS v1.0 Release: What's New",
      excerpt: "A comprehensive overview of the features and improvements in Bl1nkOS v1.0.",
      date: "2024-12-28",
      author: "Alex Johnson",
      category: "Release",
    },
  ];

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
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Stay updated with the latest news, tips, and insights about Bl1nkOS.
        </p>
      </section>

      {/* Featured Post */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 border-2 border-primary">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">Featured</span>
            <span className="text-muted-foreground text-sm">January 15, 2025</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Introducing Bl1nkOS: The Future of Local-First Editing</h2>
          <p className="text-lg text-muted-foreground mb-6">
            We are excited to announce the launch of Bl1nkOS, a revolutionary markdown editor built on local-first principles.
            Learn about the vision behind Bl1nkOS and how it can transform the way you work with documents.
          </p>
          <Button>Read More</Button>
        </Card>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-foreground mb-8">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.slice(1).map((post) => (
            <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-muted text-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  {post.category}
                </span>
                <span className="text-muted-foreground text-sm">{post.date}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{post.title}</h3>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">By {post.author}</span>
                <Button variant="ghost" size="sm">Read More →</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Announcement", "Technology", "Design", "Release", "Tutorial", "Tips"].map((category) => (
              <Button key={category} variant="outline">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-foreground mb-6">Subscribe to Our Newsletter</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get the latest updates and insights delivered to your inbox.
        </p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded border border-border bg-background text-foreground"
          />
          <Button>Subscribe</Button>
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
