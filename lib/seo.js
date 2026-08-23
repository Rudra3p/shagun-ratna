export const SITE_URL = "https://shagunratna.com";

// Breadcrumb structured data. Google uses this both to render the breadcrumb trail
// in a result (instead of a bare URL) and to understand how sections nest under the
// homepage — one of the signals that makes inner pages eligible for sitelinks.
export function breadcrumbJsonLd(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

// Renders any JSON-LD object as a script tag. Kept here so each layout doesn't
// repeat the dangerouslySetInnerHTML boilerplate.
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
