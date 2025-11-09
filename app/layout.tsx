import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ScrollControls } from '@/components/scroll-controls';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'ICUNi Scholarships Atlas',
  description:
    'Discover curated global scholarships with immersive visuals, refined storytelling, and effortless filtering tailored for ambitious scholars.',
  metadataBase: new URL('https://scholarships.icuni.org')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon_active.png" type="image/png" />
        <link rel="alternate icon" href="/favicon_active.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('visibilitychange', () => {
                const link = document.querySelector("link[rel~='icon']");
                if (!link) return;
                link.href = document.visibilityState === 'visible' ? '/favicon_active.png' : '/favicon_inactive.png';
              });
            `
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
          <ScrollControls />
        </ThemeProvider>
      </body>
    </html>
  );
}
