import type { MetadataRoute } from "next";
import dbConnect from "@/db/db";
import Product from "@/models/product";

const BASE_URL = "https://shagunratna.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();
  const products = await Product.find().select("_id updatedAt").lean();

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/collection/${product._id}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/collection`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/reviews`, changeFrequency: "weekly", priority: 0.7 },
  ];

  return [...staticEntries, ...productEntries];
}
