import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Cormorant_Garamond } from 'next/font/google';
import os from 'os';

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['400', '600'],
  variable: '--font-brand' 
});

export const metadata = {
  // 1. Browser Tab Branding
  title: {
    default: 'Shagun Ratna | Premium Jewelry & Authentic Collections',
    template: '%s | Shagun Ratna', // This adds the brand name to sub-pages automatically
  },
  description: 'Exquisite, handcrafted jewelry for every occasion. Shagun Ratna offers a premium collection of authentic gold and diamond pieces.',
  keywords: ['Shagun Ratna', 'Premium Jewelry', 'Authentic Gold', 'Diamond Jewelry India', 'Jewelry Shop'],

  // 2. SEO (Google Search)
  metadataBase: new URL('https://shagunratna.com'), // Replace with your real domain
  robots: {
    index: true,
    follow: true,
  },

  // 3. Social Media (WhatsApp/Instagram Previews)
  openGraph: {
    title: 'Shagun Ratna | Handcrafted Luxury Jewelry',
    description: 'Shop our latest authentic jewelry collections.',
    url: 'https://shagunratna.com',
    siteName: 'Shagun Ratna Jewelry',
    images: [
      {
        url: '/og-jewelry.jpg', // Put a high-quality photo in your /public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },

  // 4. Mobile App Identity
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// 2. Define the monitoring function
export const logMemoryStatus = () => {
  const total = Math.round(os.totalmem() / 1024 / 1024);
  const used = Math.round(process.memoryUsage().rss / 1024 / 1024);
  const percentage = Math.round((used / total) * 100);
  
  console.log(`[RAM STATUS]: ${used}MB used / ${total}MB total (${percentage}%)`);
};

export default function RootLayout({ children }) {
  logMemoryStatus();
  // 2. Add the variable to the className
  return (
    <html lang="en" className={`${cormorant.variable}`}>
      <body className="bg-[#faf3e5] font-sans">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}