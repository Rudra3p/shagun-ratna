import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Cormorant_Garamond } from 'next/font/google';
import os from 'os';
import Script from 'next/script'; // 1. Imported Next.js Script component

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['400', '600'],
  variable: '--font-brand' 
});

export const metadata = {
  // 1. Browser Tab Branding
  title: {
    default: 'Shagun Ratna | Premium Jewelry & Authentic Collections',
    template: '%s | Shagun Ratna', 
  },
  description: 'Exquisite, handcrafted jewelry for every occasion. Shagun Ratna offers a premium collection of authentic gold and diamond pieces.',
  keywords: ['Shagun Ratna', 'Premium Jewelry', 'Authentic Gold', 'Diamond Jewelry India', 'Jewelry Shop'],

  // 2. SEO (Google Search)
  metadataBase: new URL('https://shagunratna.com'), 
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
        url: '/og-jewelry.jpg', 
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

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "Shagun Ratna",
  description: 'Premium handcrafted gold, diamond, and gemstone jewelry boutique in Ahmedabad, founded in 1980. BIS hallmarked gold, lab-certified gemstones, and GIA/IGI-referenced diamonds.',
  url: 'https://shagunratna.com',
  image: 'https://shagunratna.com/og-jewelry.jpg',
  telephone: '+91-22-2282-9800',
  priceRange: '₹₹₹',
  foundingDate: '1980',
  address: {
    "@type": "PostalAddress",
    streetAddress: 'GF/9, Akshar Complex, Beside Harit Zaveri, Shivranjani Cross Road, Satellite',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    postalCode: '380015',
    addressCountry: 'IN',
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.0245069,
    longitude: 72.5288626,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '11:00',
      closes: '20:00',
    },
  ],
};

export default function RootLayout({ children }) {
  logMemoryStatus();

  return (
    <html lang="en" className={`${cormorant.variable}`}>
      <body className="bg-[#FDFBF7] font-sans">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />

        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        {/* 2. Added your Microsoft Clarity Tracking Code safely */}
        <Script id="microsoft-clarity-inline" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xcjzi06xak");
          `}
        </Script>
      </body>
    </html>
  );
}