import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sam's Triune OS",
  description: 'Personal AI training, business tracking and operating system — sam.triunedynamic.com',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#07070a' }}>{children}</body>
    </html>
  )
}
