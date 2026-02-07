import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pitch Deck Generator',
  description: 'Generate Google Slides pitch decks from a form',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
