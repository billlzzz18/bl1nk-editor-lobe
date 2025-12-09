import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_TITLE } from "@/const";

export default function About() {
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
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">About Bl1nkOS</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Building the future of collaborative editing with privacy and simplicity at its core.
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              We believe that everyone deserves a powerful, privacy-first editing tool that puts them in control of their data.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Bl1nkOS is built on the principles of local-first computing, where your data stays on your device by default.
              We provide seamless sync capabilities without compromising on privacy or performance.
            </p>
            <p className="text-lg text-muted-foreground">
              Our goal is to create an editing experience that is both powerful and intuitive, suitable for individuals,
              teams, and enterprises alike.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Privacy First</h3>
                <p className="text-muted-foreground">Your data is yours. We never sell or share your information.</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Open Source</h3>
                <p className="text-muted-foreground">Bl1nkOS is open source and community-driven.</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Cross-Platform</h3>
                <p className="text-muted-foreground">Works seamlessly on Desktop, Mobile, and Web.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl font-bold text-foreground text-center mb-12">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Alex Johnson",
              role: "Founder & CEO",
              bio: "10+ years in software development with a passion for building tools that matter.",
            },
            {
              name: "Sarah Chen",
              role: "CTO",
              bio: "Expert in distributed systems and privacy-preserving technologies.",
            },
            {
              name: "Mike Rodriguez",
              role: "Head of Design",
              bio: "Dedicated to creating intuitive and beautiful user experiences.",
            },
          ].map((member, idx) => (
            <Card key={idx} className="p-6 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
              <p className="text-primary font-semibold mb-3">{member.role}</p>
              <p className="text-muted-foreground">{member.bio}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Privacy",
                description: "We prioritize user privacy above all else.",
              },
              {
                title: "Simplicity",
                description: "We believe in building simple, elegant solutions.",
              },
              {
                title: "Transparency",
                description: "We are open about our practices and decisions.",
              },
              {
                title: "Community",
                description: "We build with and for our community.",
              },
            ].map((value, idx) => (
              <Card key={idx} className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-foreground mb-6">Get in Touch</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Have questions or feedback? We would love to hear from you.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="mailto:hello@bl1nkos.com">
            <Button>Email Us</Button>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Follow on Twitter</Button>
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
