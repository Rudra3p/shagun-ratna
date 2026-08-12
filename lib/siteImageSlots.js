// Single source of truth for every admin-editable image slot on the public site.
// `key` must match what each section component passes to useSiteImage().
export const SITE_IMAGE_SLOTS = [
  { key: 'home-hero', label: 'Hero Section', page: 'Home', defaultSrc: '/hero_sec_hand.webp' },
  { key: 'home-story', label: 'Our Story', page: 'Home', defaultSrc: '/story-image.webp' },
  { key: 'home-featured-diamond', label: 'Featured: Certified Diamonds', page: 'Home', defaultSrc: '/diamond-section.webp' },
  { key: 'home-featured-gemstone', label: 'Featured: Rare Gemstones', page: 'Home', defaultSrc: '/gemstone-section.webp' },
  { key: 'home-featured-gold', label: 'Featured: Gold Artistry', page: 'Home', defaultSrc: '/gold-section.webp' },
  { key: 'cert-bis-hallmark', label: 'Certificate Sample: BIS Hallmark', page: 'Home', defaultSrc: '/certificates/bis-hallmark-sample.svg' },
  { key: 'cert-gemstone', label: 'Certificate Sample: Gemstone Lab Report', page: 'Home', defaultSrc: '/certificates/gemstone-lab-report-sample.svg' },
  { key: 'cert-gia-igi', label: 'Certificate Sample: GIA / IGI Report', page: 'Home', defaultSrc: '/certificates/gia-igi-report-sample.svg' },
  // Former slide 1 (about-hero-1 / about-1.webp) showed storefront signage reading
  // "EST. 1921", contradicting the site's "Founded in 1980" copy — removed from
  // rotation in AboutHero.jsx. Keys below are left as-is (not renumbered) so any
  // existing admin-uploaded photos stay attached to the same slide.
  { key: 'about-hero-2', label: 'About Hero — Slide 1', page: 'About', defaultSrc: '/about-2.webp' },
  { key: 'about-hero-3', label: 'About Hero — Slide 2', page: 'About', defaultSrc: '/about-3.webp' },
  { key: 'about-hero-4', label: 'About Hero — Slide 3', page: 'About', defaultSrc: '/about-4.webp' },
  { key: 'about-hero-5', label: 'About Hero — Slide 4', page: 'About', defaultSrc: '/about-5.webp' },
  { key: 'about-heritage-tall', label: 'Heritage: Main Image', page: 'About', defaultSrc: '/heritage-tall.webp' },
  { key: 'about-heritage-square-1', label: 'Heritage: Detail 1', page: 'About', defaultSrc: '/heritage-square-1.webp' },
  { key: 'about-heritage-square-2', label: 'Heritage: Detail 2', page: 'About', defaultSrc: '/heritage-square-2.webp' },
  { key: 'about-philosophy', label: 'Philosophy Image', page: 'About', defaultSrc: '/philosophy-main.webp' },
  { key: 'about-certification', label: 'Certification Photo', page: 'About', defaultSrc: '/new-launch.webp' },
  { key: 'about-boutique', label: 'Boutique Visit Image', page: 'About', defaultSrc: '/boutique-interior.webp' },
];
