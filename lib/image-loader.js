export default function cloudflareLoader({ src, width, quality }) {
  let path = src;
  
  // 1. If it's a full URL string, extract just the raw image pathname
  if (src.startsWith('http')) {
    const url = new URL(src);
    path = url.pathname;
  }

  // 2. Clean up leading slashes
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  
  // 3. Set the optimization parameters for mobile resizing
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto'];
  
  // 4. Force absolute custom domain routing for production optimization
  // Replace 'shagunratna.com' with your actual registered domain name
  return `https://shagunratna.com/cdn-cgi/image/${params.join(',')}/${normalizedPath}`;
}