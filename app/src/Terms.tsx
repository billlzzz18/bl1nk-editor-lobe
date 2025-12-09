import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";

export default function Terms() {
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Terms of Service</h1>
        <p className="text-lg text-muted-foreground">Last updated: January 2025</p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using the Bl1nkOS application and website, you accept and agree to be bound by and comply with
              these terms and conditions. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Bl1nkOS
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
              and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on Bl1nkOS</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The materials on Bl1nkOS are provided on an "as is" basis. Bl1nkOS makes no warranties, expressed or implied,
              and hereby disclaims and negates all other warranties including, without limitation, implied warranties or
              conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property
              or other violation of rights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitations</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall Bl1nkOS or its suppliers be liable for any damages (including, without limitation, damages
              for loss of data or profit, or due to business interruption) arising out of the use or inability to use the
              materials on Bl1nkOS, even if Bl1nkOS or a Bl1nkOS authorized representative has been notified orally or in
              writing of the possibility of such damage.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Accuracy of Materials</h2>
            <p className="text-muted-foreground mb-4">
              The materials appearing on Bl1nkOS could include technical, typographical, or photographic errors. Bl1nkOS does
              not warrant that any of the materials on Bl1nkOS are accurate, complete, or current. Bl1nkOS may make changes
              to the materials contained on Bl1nkOS at any time without notice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Links</h2>
            <p className="text-muted-foreground mb-4">
              Bl1nkOS has not reviewed all of the sites linked to its website and is not responsible for the contents of any
              such linked site. The inclusion of any link does not imply endorsement by Bl1nkOS of the site. Use of any such
              linked website is at the user's own risk.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Modifications</h2>
            <p className="text-muted-foreground mb-4">
              Bl1nkOS may revise these terms of service for Bl1nkOS at any time without notice. By using this website, you
              are agreeing to be bound by the then current version of these terms of service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which
              Bl1nkOS operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-muted-foreground">
              Email: <a href="mailto:legal@bl1nkos.com" className="text-primary hover:underline">legal@bl1nkos.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8 mt-20">
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
