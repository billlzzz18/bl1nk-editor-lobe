"use client"

import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'
import { useEffect } from 'react'

/**
 * Global error boundary component for the App Router. When an unhandled
 * exception bubbles up to the root, this component renders instead of your
 * page. It captures the exception with Sentry and then renders Next.js's
 * default error page. See Sentry docs for more information【207018396183717†L295-L327】.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Send the error to Sentry for monitoring
    Sentry.captureException(error)
  }, [error])

  // Render Next.js's default error page. We pass 0 because the App Router
  // doesn't expose status codes for errors【207018396183717†L315-L327】.
  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
