<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SHAGUN RATNA (शगुन रत्न) — MASTER PROJECT CACHE & ARCHITECTURE KNOWLEDGE BASE
> **Universal Agent Cache**: This document is automatically loaded by Antigravity and available to ALL models (Claude, GPT, Gemini). All models MUST read and follow these rules before inspecting or modifying code, saving API tokens and request limits.

---

## 1. ABSOLUTE RULES & USER SAFETY MANDATE
- **Zero Accidental Deletions**: Never delete existing functions, fields, or comments. Edits must be surgical, precise, and non-destructive.
- **Dual-Write Requirement**: Any creation, update, or deletion of a `Product` MUST simultaneously update the `SearchIndex` collection. Never decouple them.
- **Next.js 16 Compatibility**: Follow App Router rules in `node_modules/next/dist/docs/`. Do NOT use deprecated Next.js 13/14 patterns.
- **Formula Price Consistency**: Products support `FIXED` and `FORMULA` pricing. Catalog reads calculate live prices using current gold/silver rates from `models/metalRate.ts`.
- **Preserve Comments & Docstrings**: Keep all developer notes and architectural comments intact.

---

## 2. BRAND PSYCHOLOGY, DESIGN SYSTEM & LUXURY STANDARDS
- **Brand Purpose**: Shagun Ratna is a premium Indian luxury jewelry and certified Vedic gemstone boutique combining royal aesthetic heritage with astrological precision (Jyotish / Kundli / Navamsha analysis).
- **Luxury Color Palette**:
  - **Royal Crimson / Maroon**: `#90060C` (primary brand accent, buttons, badges), hover `#730509`, subtle tint `#90060C/5`
  - **Champagne Gold**: `#C5A880`, `#D4AF37` (borders, shimmer, highlights, luxury trims)
  - **Muted Slate / Gold Accent**: `#A8A196` (secondary labels, subtitle text, icons)
  - **Dark Charcoal / Deep Onyx**: `#1A1A1A`, `#2D2926` (headings, body typography)
  - **Warm Ivory / Royal Cream**: `#FDFBF7` (page background), `#F5EFE6`, `#FAF7F2` (card backgrounds)
  - **Delicate Border Trim**: `#EBE3D5`
- **Typography & Aesthetics**:
  - Serif / Brand: Cormorant Garamond / Luxury serif styling for headings and product titles.
  - Sans-Serif: Clean, elegant sans-serif for prices, weights, specifications, and UI controls.
- **Motion & Experience**: Subtle, fluid Framer Motion transitions and GSAP stagger animations. Never jarring or abrupt.

---

## 3. TECH STACK SPECIFICATIONS
- **Framework**: Next.js 16.2.6 (App Router, standalone deployment mode)
- **UI Library**: React 19.2.6, Framer Motion 12.40.0, GSAP 3.15.0, Lucide React icons
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Database**: MongoDB with Mongoose 9.6.2 (Atlas Search aggregation enabled)
- **Storage**: AWS S3 / Cloudflare R2 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- **Validation**: Zod 4.4.3
- **Authentication**: JWT (`jose` 6.2.3, `jsonwebtoken` 9.0.3), bcryptjs 3.0.3, HTTP-only secure cookies
- **Emails & Sync**: Resend 6.12.4 for customer inquiry emails; Apify Client 2.25.0 for Google Reviews cron

---

## 4. COMPLETE ROUTE DIRECTORY

### User-Facing Routes (`app/`)
| Path | File | Purpose |
|---|---|---|
| `/` | `app/page.jsx` | Homepage: Hero showcase, curated categories, live showcase, testimonials, Vedic astrology preview |
| `/about` | `app/about/page.jsx` | Heritage story, craftsmanship, gemstone authenticity standards |
| `/collection` | `app/collection/page.jsx` | Infinite-scroll jewelry catalog, multi-category filter bar, live search, sort |
| `/collection/[id]` | `app/collection/[id]/page.jsx` | Product detail page: High-res gallery, live metal rate breakdown, inquiry drawer, bookmark toggle |
| `/liked-collection`| `app/liked-collection/page.jsx` | Client-side bookmarked jewelry pieces (localStorage persisted) |
| `/contact` | `app/contact/page.jsx` | Boutique address, showroom map, direct inquiry form |
| `/reviews` | `app/reviews/page.jsx` | Verified customer reviews & synced Google Business testimonials |
| `/my-inquiry` | `app/my-inquiry/page.jsx` | Customer tracking page for submitted custom orders and inquiries |
| `/llms.txt` | `app/llms.txt/route.ts` | Machine-readable context endpoint for LLMs and AI search crawlers |

### Admin-Facing Routes (`app/admin/`)
| Path | File | Purpose |
|---|---|---|
| `/admin/login` | `app/admin/login/page.jsx` | Secure administrative authentication with rate limiting & JWT |
| `/admin` | `app/admin/page.jsx` | Admin Dashboard: Live visitor metrics, product counts, inquiry alerts |
| `/admin/product` | `app/admin/product/page.jsx` | Product Management: Create, edit, multi-category assign, image upload, formula pricing |
| `/admin/product-mapping` | `app/admin/product-mapping/page.jsx` | Category showcase mapping and featured collection ordering |
| `/admin/metal-rates` | `app/admin/metal-rates/page.jsx` | Live gold (24K, 22K, 18K) & silver rate management (instantly updates catalog) |
| `/admin/inquiries` | `app/admin/inquiries/page.jsx` | Lead management: View, filter, and change status of customer inquiries |
| `/admin/reviews` | `app/admin/reviews/page.jsx` | Review moderation, manual review addition, Google Review sync trigger |
| `/admin/home-page` | `app/admin/home-page/page.jsx` | Homepage Studio: Visual mirrored editor for in-place text & media updates |
| `/admin/homepage-grid`| `app/admin/homepage-grid/page.jsx`| Visual grid layout curator for homepage |
| `/admin/about-page` | `app/admin/about-page/page.jsx` | About Page Studio: Visual mirrored editor for in-place text & media updates |
| `/admin/history` | `app/admin/history/page.jsx` | Audit log of all changes made across products, rates, and CMS |
| `/admin/profile` | `app/admin/profile/page.jsx` | Admin account security, email, password update |

---

## 5. BACKEND API ENDPOINTS & CONTROLLER MAP

### Public / User Endpoints
- `GET /api/user/products`: Calls `searchProducts(req)` if `?search=` exists; otherwise calls `getProducts()` with pagination & live formula pricing.
- `GET /api/user/products/[id]`: Fetches single product, calculates live formula price from current metal rates.
- `GET /api/user/products/homepage`: Returns curated featured pieces for the homepage.
- `GET /api/user/recommendations`: Calculates astrological or category-based recommendations (`controllers/recommendationController.ts`).
- `GET /api/user/site-content`: Returns dynamic CMS page copy.
- `GET /api/user/site-images`: Returns image slot mappings for banners and promos.
- `POST /api/inquiry`: Creates a customer inquiry in MongoDB and dispatches confirmation emails via Resend.
- `GET /api/reviews`: Returns public reviews and Google rating aggregate.
- `POST /api/upload`: Generates presigned AWS S3 / Cloudflare R2 upload URLs for client-side uploads.

### Admin Endpoints (`middlewares/adminMiddleware.ts` protected)
- `POST /api/admin/login`: Authenticates admin, sets secure HTTP-only cookie.
- `POST /api/admin/logout`: Clears authentication session cookie.
- `GET /api/admin/verify`: Validates current admin session token.
- `POST /api/admin/refresh`: Refreshes short-lived tokens.
- `GET / POST / PUT / DELETE /api/admin/products`: CRUD for products. Enforces dual-write to `SearchIndex` on every mutation (`productController.ts`).
- `GET / PUT /api/admin/metal-rates`: Fetches and updates current 24k/22k/18k gold and silver rates (`metalRateController.ts`).
- `GET / PUT /api/admin/inquiries`: Lists inquiries, allows status update (`PENDING`, `CONTACTED`, `RESOLVED`).
- `GET / POST / PUT / DELETE /api/admin/reviews`: Admin review moderation.
- `GET / POST /api/admin/site-images`: Admin slot image upload & assignment.
- `GET /api/admin/dashboard`: Aggregated dashboard analytics (`adminDashController.ts`).
- `GET /api/admin/visitors`: Clarity and analytics visit tracking (`adminVisitorsController.ts`).
- `GET /api/admin/history`: Audit log tracking (`adminHistoryController.ts`).

### Cron Endpoints
- `GET /api/cron/metal-rates`: Automated periodic sync for commodity rates.
- `GET /api/cron/google-reviews`: Automated sync pulling verified Google business reviews via Apify.

---

## 6. CORE DATABASE MODELS (`models/`)
1. **`Product` (`models/product.ts`)**:
   - `productName` (String, required)
   - `price` (Number, base/snapshot price)
   - `category` ([String], multi-category array e.g. `["Gold", "Rings"]`)
   - `pricingMode` (`"FIXED" | "FORMULA"`, default `"FIXED"`)
   - `metal` (`"GOLD" | "SILVER" | null`)
   - `purity` (`"24K" | "22K" | "18K" | null`)
   - `metalWeight` (Number, grams)
   - `labourCost` (Number, making charges)
   - `description`, `imageUrl`, `discount`, `offerPrice`, `offertime`
2. **`SearchIndex` (`models/searchIndex.ts`)**:
   - `keyword` (String, lowercased product name, indexed)
   - `category` ([String], indexed)
   - `productRefId` (ObjectId ref to `Product`)
   - **Index**: Atlas Search index `"default"` covering `["keyword", "category"]`
3. **`MetalRate` (`models/metalRate.ts`)**:
   - Stores current gold rates (24K, 22K, 18K per gram) and silver rate (per gram).
4. **`Inquiry` (`models/Inquiry.ts`)**:
   - Customer name, phone, email, productRefId, custom notes, status.
5. **`Review` (`models/reviews.ts`)**:
   - Author, rating, comment, source (`"GOOGLE" | "DIRECT"`), isApproved.
6. **`SiteImage` (`models/siteImage.ts`)**:
   - Slot identifier (`HERO_BANNER`, `PROMO_CARD`, etc.), image URL, title, link.
7. **`Admin` (`models/admin.ts`)**:
   - Email, hashed password, role, permissions.
8. **`VisitLog` & `ClarityStat` (`models/VisitLog.ts`, `models/ClarityStat.ts`)**:
   - Traffic monitoring and visitor journey logs.

---

## 7. CORE BUSINESS LOGIC & CRITICAL ENGINES

### A. Live Formula Pricing Engine (`lib/pricing.ts`)
- Products with `pricingMode: "FORMULA"` are recalculated on-the-fly when read from database:
  $$\text{Final Price} = (\text{metalWeight} \times \text{liveRateForPurity}) + \text{labourCost}$$
- When admin changes gold or silver rates in `/admin/metal-rates`, the entire catalog updates instantaneously without needing to re-save individual products.

### B. Dual-Write Atlas Search Fuzzy Engine
- Full search uses MongoDB Atlas `$search` aggregation on `SearchIndex`:
  ```javascript
  $search: {
    index: "default",
    text: {
      query: search,
      path: ["keyword", "category"],
      fuzzy: { maxEdits: 2, prefixLength: 0 }
    }
  }
  ```
- Fast count aggregation runs on `SearchIndex` before `$lookup` to the `products` collection.
- Dual-write pattern: `addProduct` and `updateProduct` write both to `Product` and `SearchIndex`.

### C. Multi-Category System
- Products have an array of categories (`category: [String]`).
- Material category (`Gold`, `Silver`, `Diamond`, `Gemstone`) + Product type (`Rings`, `Necklaces`, `Earrings`, `Bangles`, `Coins`).
- Formatter helper in `lib/formatCategory.js` ensures clean UI pills and labels.

### D. Vedic Astrology / Jyotish Recommendation Engine
- `lib/jyotish.ts` & `lib/birthPlaces.ts`:
  Calculates Vedic birth chart (Lagna, Rashi, Navamsha) based on date, time, and birthplace coordinates to suggest authentic astrological gemstones (Ruby, Yellow Sapphire, Blue Sapphire, Emerald, Pearl, Coral, Diamond).

---

## 8. ACTIVE WORK DIRECTION & PENDING TASKS
1. **Search Typo Display Correction**:
   - When a user enters a typo like `"solver"`, the fuzzy search retrieves silver products.
   - The UI display text should extract the best-matching keyword/category from the top `SearchIndex` hit and show: `1 result for "Silver"` instead of raw `"solver"`.
2. **Category & Typo Sync**:
   - Ensure `collection/page.jsx` properly sets and clears `correctedQuery` across filter toggles.
3. **Safety Guarantee**:
   - Verify every change with `npx tsc --noEmit` before concluding.

## 9. HOMEPAGE CONTENT DIRECTION
- Planned homepage addition: Add a curated Instagram/Reels section, titled something like “From the Atelier” or “Follow Our Journey.” This section has been recommended but is not implemented yet.
- Placement: Put it immediately after the three sections rendered by `sections/home/FeaturedCollections.jsx` (Certified Diamonds, Rare Gemstones, Gold Artistry) and immediately before `sections/home/Testimonials.jsx` (Patron Experiences).
- Intended homepage sequence: Hero → The Legacy → Authenticity & Certification → Selected Masterpieces → Certified Diamonds → Rare Gemstones → Gold Artistry → Instagram Reels → Patron Experiences → Footer.
- Visitor psychology: move from brand introduction and heritage, through authenticity reassurance and product discovery, into current visual social content, then finish with customer testimonials as final reassurance. Keep the Instagram area curated and focused on selected reels.
