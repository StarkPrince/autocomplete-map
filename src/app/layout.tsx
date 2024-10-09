import { Metadata } from 'next'
import { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chain Breaker',
  description: 'Break bad habits and build good ones',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
})
{
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
