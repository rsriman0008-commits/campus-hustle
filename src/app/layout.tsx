import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Campus Hustle — Pondicherry University Campus Marketplace',
  description: 'Verified Pondicherry University-only marketplace for buying, selling, swapping, and offering student services safely.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F8FAFC] text-[#172033] min-h-screen flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900`}>
        <Navbar />
        <main className="flex-1 pb-20 sm:pb-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
