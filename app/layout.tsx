import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import { APP_DESCRIPTION, APP_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full antialiased text-brand-foreground bg-brand-background font-dm-sans">
        <ToastProvider>
          <div className="flex flex-col min-h-screen relative overflow-x-hidden">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
