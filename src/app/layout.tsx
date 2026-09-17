import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

export const metadata: Metadata = {
  title: {
    default: 'GachPala (গাছপালা) — Discover. Identify. Learn.',
    template: '%s | GachPala',
  },
  description:
    'AI-powered tree identification and botanical knowledge platform. Discover trees, identify them using AI, explore botanical information, and contribute to our growing database.',
  keywords: [
    'tree identification',
    'AI tree detection',
    'botanical database',
    'tree knowledge',
    'plant identification',
    'tree encyclopedia',
    'GachPala',
    'গাছপালা',
    'গাছ চেনা',
    'বৃক্ষ',
  ],
  openGraph: {
    title: 'GachPala (গাছপালা) — Discover. Identify. Learn.',
    description:
      'AI-powered tree identification and botanical knowledge platform. Discover trees, identify them using AI, and explore botanical information.',
    url: '/',
    siteName: 'GachPala',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GachPala (গাছপালা) — Discover. Identify. Learn.',
    description:
      'AI-powered tree identification and botanical knowledge platform.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-[rgb(250,250,245)] dark:bg-[rgb(15,26,20)] transition-colors duration-300">
        <ThemeProvider>
          <ToastProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
