import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next.js Backend Template',
  description:
    'Next.js 16+ API backend template with MongoDB, dynamic OpenAPI generation, and type-safe auto-documentation. Features route-centric architecture with co-located types and zero-configuration API discovery.',
  keywords: [
    'Next.js',
    'API',
    'Backend',
    'MongoDB',
    'OpenAPI',
    'TypeScript',
    'Template',
  ],
  authors: [{ name: 'Yousif Abozid', url: 'https://github.com/YousifAbozid' }],
  creator: 'Yousif Abozid',
  openGraph: {
    title: 'Next.js Backend Template',
    description:
      'Next.js 16+ API backend template with MongoDB, dynamic OpenAPI generation, and type-safe auto-documentation.',
    url: 'https://github.com/YousifAbozid/template-nextjs-backend',
    siteName: 'Next.js Backend Template',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Backend Template',
    description:
      'Next.js 16+ API backend template with MongoDB, dynamic OpenAPI generation, and type-safe auto-documentation.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
