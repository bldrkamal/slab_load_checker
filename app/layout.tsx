import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import Header from "@/components/Header"

export const metadata: Metadata = {
  title: "Matrix Section - Tributary Area Calculator",
  description: "Tools that help construction practitioners validate structural analyses and design — fast.",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-SD334RY920" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SD334RY920');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="afterInteractive" />
        <Script id="netlify-identity-init" strategy="afterInteractive">
          {`
            window.netlifyIdentity = window.netlifyIdentity || {};
            window.netlifyIdentity.on('init', (user) => {
              if (!user) {
                const token = new URLSearchParams(window.location.hash.substring(1)).get('invite_token');
                if (token) {
                  window.netlifyIdentity.gotrue.confirm(token)
                    .then(() => {
                      alert('Invite accepted! Please log in at /admin.');
                      window.location.href = '/admin';
                    })
                    .catch((error) => {
                      console.error('Error confirming invite:', error);
                      alert('Failed to accept invite. Please try again.');
                    });
                }
              }
            });
          `}
        </Script>
      </head>
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  )
}
