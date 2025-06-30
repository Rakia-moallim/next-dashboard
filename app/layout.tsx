// importing Stylesheet file from the UI folder.
import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata ={
  title: '%S | Acme Dashboard',
  description:'The offical Next.js Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboad.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
