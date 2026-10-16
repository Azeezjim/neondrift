import type { Metadata, Viewport } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'Neon Drift — Start.ng Arcade', description: 'A neon endless runner built for the start.ng arcade.' }
export const viewport: Viewport = { themeColor: '#080719', colorScheme: 'dark', userScalable: false }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html> }
