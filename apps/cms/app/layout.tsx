'use client'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log(process.env)
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
