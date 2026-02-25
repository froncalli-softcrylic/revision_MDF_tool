import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'MDF Simulator — Marketing Data Foundation',
  description: 'Visualize how raw marketing data flows through an enterprise Marketing Data Foundation, gets cleaned, identity-resolved, and emerges as Golden Records for downstream MarTech activation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="bg-mesh" />
        {children}
      </body>
    </html>
  );
}
