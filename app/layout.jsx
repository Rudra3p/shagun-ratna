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
    default: 'Shagun Ratna | Premium Gemstones & Jewelry in Ahmedabad',
    template: '%s | Shagun Ratna',
  },
  description: 'Shagun Ratna offers certified, natural gemstones and handcrafted gold and diamond jewellery in Ahmedabad — including ruby, emerald, sapphire, and diamond alternatives — since 1980.',
  keywords: [
    'Shagun Ratna',
    'Premium Jewelry',
    'Authentic Gold',
    'Diamond Jewelry India',
    'Jewelry Shop',
    'Premium Gemstones Ahmedabad',
    'Certified Gemstones',
    'Natural Gemstones',
    'Gemstone Jewellery',
    'Ruby Jewelry',
    'Emerald Jewelry',
    'Sapphire Jewelry',
    'Diamond Alternatives',
    'Ahmedabad Jewelry Shop',
  ],

  // 2. SEO (Google Search)
  metadataBase: new URL('https://shagunratna.com'), 
  robots: {
    index: true,
    follow: true,
  },

  // 3. Social Media (WhatsApp/Instagram Previews)
  openGraph: {
    title: 'Shagun Ratna | Certified Gemstones & Handcrafted Luxury Jewelry',
    description: 'Shop certified natural gemstones — ruby, emerald, sapphire, and more — plus our latest authentic gold and diamond jewelry collections.',
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
  // 4. Mobile App Identity — favicon/apple-touch-icon come from app/icon.png and
  // app/apple-icon.png (cropped straight from the real logo's "S") via Next's
  // file-convention metadata, not this key.
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
  description: 'Premium handcrafted gold, diamond, and certified natural gemstone jewelry boutique in Ahmedabad, founded in 1980. BIS hallmarked gold, lab-certified natural gemstones (ruby, emerald, sapphire, and more), and GIA/IGI-referenced diamonds.',
  url: 'https://shagunratna.com',
  image: 'https://shagunratna.com/og-jewelry.jpg',
  telephone: '+91-22-2282-9800',
  priceRange: '₹₹₹',
  foundingDate: '1980',
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Gemstone & Jewelry Categories",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Certified Natural Ruby Jewelry" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Certified Natural Emerald Jewelry" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Certified Natural Sapphire Jewelry" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Diamond Alternative Gemstone Jewelry" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Bridal & Wedding Sets" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Gold Heirlooms & Necklaces" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Astrological & Rashi Gems" } },
    ],
  },
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