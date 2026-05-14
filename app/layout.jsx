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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}