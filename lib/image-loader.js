export default function cloudflareLoader({ src, width, quality }) {
  // 1. If it's a full URL, extract the path (everything after the domain)
  let path = src;
  if (src.startsWith('http')) {
    const url = new URL(src);
    path = url.pathname;
  }

  // 2. Remove leading slash so the path is clean (e.g., "products/my-image.jpg")
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  
  // 3. Define Cloudflare Image Resizing parameters
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto'];
  
  // 4. Return the path routed through Cloudflare's optimization engine
  // Use your custom domain here (e.g., assets.yourdomain.com)
  return `/cdn-cgi/image/${params.join(',')}/${normalizedPath}`;
}