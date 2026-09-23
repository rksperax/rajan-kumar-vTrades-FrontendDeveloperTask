import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'vTrades - Frontend Developer Task',
  description: 'vTrades Frontend Developer Task - Built with Next.js, Tailwind CSS and TypeScript.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variable must live on <html> so that `:root` defines it before
    // globals.css maps it onto Tailwind's --font-sans.
    <html lang="en" className={sourceSans.variable}>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
