import './globals.css'
import Navbar from '@/components/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>FocusPal</title>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="min-h-screen backdrop-blur-sm bg-white/30">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  )
}