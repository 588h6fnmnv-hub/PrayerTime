import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kahaba - Islamic Prayer Times',
  description: 'Minimal Islamic prayer-time and notification app optimized for iPhone.',
  icons: {
    icon: [
      { url: '/icons/kahaba.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kahaba',
    startupImage: [],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Kahaba',
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#050505]">
      <body className="bg-[#050505] text-zinc-100 antialiased min-h-screen selection:bg-amber-500/20 selection:text-amber-200">
        <div className="mx-auto max-w-md min-h-screen relative flex flex-col justify-between pb-24 shadow-2xl bg-[#050505]">
          {children}
        </div>
      </body>
    </html>
  );
}
