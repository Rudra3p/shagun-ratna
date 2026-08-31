import Product from "@/models/product";
import SearchIndex from "@/models/searchIndex";
import { NextResponse } from "next/server";
import dbConnect from '@/db/db';
import { readRates } from "@/controllers/metalRateController";
import { applyPricing, applyPricingToList, computeFormulaPrice } from "@/lib/pricing";

// 💡 CLOUDFLARE CACHE PURGE UTILITY
async function purgeCDNCache(urlToDelete: string): Promise<void> {
  try {
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;
    const token = process.env.CLOUDFLARE_PURGE_TOKEN;

    if (!zoneId || !token) {
      console.warn("Cloudflare environment variables missing. Skipping cache invalidation.");
      return;
    }

    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files: [urlToDelete] })
    });

    const data = await response.json();
    if (data.success) {
      console.log(`Successfully purged CDN cache for URL: ${urlToDelete}`);
    } else {
      console.error("Cloudflare purge error details:", data.errors);
    }
  } catch (err) {
    console.error("Failed to connect to Cloudflare Purge API:", err);
  }
}

// 1. ADD PRODUCT (Dual-write enabled)
export const addProduct = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    const body = await req.json();

    // Sanitization layer
    const sanitizedData: Record<string, any> = {
      ...body,
      imageUrl: (body.imageUrl === "" || body.imageUrl === undefined) ? null : body.imageUrl,
      price: parseFloat(body.price) || 0,
      discount: parseFloat(body.discount) || 0,
      offerPrice: parseFloat(body.offerPrice) || 0,
      offertime: body.offertime ? new Date(body.offertime) : null,
      pricingMode: body.pricingMode === 'formula' ? 'formula' : 'manual',
      metal: body.metal || '',
      metalWeight: parseFloat(body.metalWeight) || 0,
      labourCost: parseFloat(body.labourCost) || 0,
    };

    // Store a snapshot of the formula price so the row has a real value to sort
    // and validate against; reads recompute it from the current rates anyway.
    if (sanitizedData.pricingMode === 'formula') {
      const computed = computeFormulaPrice(sanitizedData, await readRates());
      if (computed === null || computed <= 0) {
        return NextResponse.json({
          success: false,
          error: "Set the metal, weight and that metal’s current rate before saving a formula-priced piece.",
        }, { status: 400 });
      }
      sanitizedData.price = computed;
    }

    // Save to heavy main collection
    const newProduct = new Product(sanitizedData);
    const savedProduct = await newProduct.save();

    // Atomic Dual-Write: Create matching lightweight entry for our CDN search engine
    const searchEntry = new SearchIndex({
      keyword: savedProduct.productName,
      category: savedProduct.category,
      productRefId: savedProduct._id
    });
    await searchEntry.save();

    return NextResponse.json({ 
      success: true, 
      message: "Product added successfully" 
    }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to add product";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
};

// 2. SEARCH PRODUCTS (Fuzzy Search Upgraded to parse native GET URL parameters)
export const searchProducts = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    
    // Parse parameters straight out of the native HTTP GET request URL string
    const url = new URL(req.url);
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (!search || search.trim() === "") {
      return await getProducts(null, 0, page); 
    }

    const skip = (page - 1) * limit;

    // Execute Atlas Search with Fuzzy matching on the lightweight SearchIndex model
    const indexResults = await SearchIndex.aggregate([
      {
        $search: {
          index: "default", 
          text: {
            query: search,
            path: ["keyword", "category"],
            fuzzy: {
              maxEdits: 2,       // Allows up to 2 character changes (e.g., "guld" -> "gold")
              prefixLength: 0,   // 🔥 FIXED: Changed to 0 so "sliver" maps cleanly to "silver"
            }
          }
        }
      },
      { $skip: skip },
      { $limit: limit },
      {
        // Populate the full product payload using the reference pointer link
        $lookup: {
          from: "products", 
          localField: "productRefId",
          foreignField: "_id",
          as: "fullProduct"
        }
      },
      { $unwind: "$fullProduct" },
      {
        // Reshape output matrix structure to match client expectations
        $project: {
          _id: "$fullProduct._id",
          productName: "$fullProduct.productName",
          price: "$fullProduct.price",
          category: "$fullProduct.category",
          purity: "$fullProduct.purity",
          description: "$fullProduct.description",
          discount: "$fullProduct.discount",
          offerPrice: "$fullProduct.offerPrice",
          offertime: "$fullProduct.offertime",
          imageUrl: "$fullProduct.imageUrl",
          createdAt: "$fullProduct.createdAt",
          updatedAt: "$fullProduct.updatedAt",
          // Needed so search results can be repriced from the live metal rates too
          pricingMode: "$fullProduct.pricingMode",
          metal: "$fullProduct.metal",
          metalWeight: "$fullProduct.metalWeight",
          labourCost: "$fullProduct.labourCost"
        }
      }
    ]);

    // Fast count calculation using the search index
    const totalResults = await SearchIndex.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: search,
            path: ["keyword", "category"],
            fuzzy: { maxEdits: 2 }
          }
        }
      },
      { $count: "total" }
    ]);
    const total = totalResults.length > 0 ? totalResults[0].total : 0;

    // Capture the clean gateway response
    const gatewayResponse = await getProducts(indexResults, Math.ceil(total / limit), page, total);

    // Apply Cloudflare CDN caching instruction headers onto your text payload response
    gatewayResponse.headers.set(
      "Cache-Control", 
      "public, s-maxage=3600, stale-while-revalidate=60"
    );

    return gatewayResponse;

  } catch (error) {
    console.error("Search system error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
};

// 3. GET PRODUCTS (Standard Data Gateway pagination)
export const getProducts = async (
  products: any[] | null = null,
  totalPages: number = 0,
  currentPage: number = 1,
  total: number = 0,
  limitOverride: number = 10
): Promise<NextResponse> => {
  try {
    // Formula-priced pieces are repriced here from the live metal rates, so the
    // whole catalog updates the moment the admin changes gold or silver.
    const rates = await readRates();

    if (products) {
      return NextResponse.json(
        { products: applyPricingToList(products, rates), totalPages, currentPage, total },
        { status: 200 }
      );
    }

    const page = currentPage;
    const limit = limitOverride;
    const skip = (page - 1) * limit;

    const allProducts = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const totalCount = await Product.countDocuments();

    return NextResponse.json({
      products: applyPricingToList(allProducts, rates),
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      total: totalCount
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
};

// 4. UPDATE PRODUCT (Dual-write sync preservation enabled)
export const updateProduct = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    
    const url = new URL(req.url);
    const id = url.searchParams.get("id"); 
    
    if (!id) {
      return NextResponse.json({ error: "ID missing in URL" }, { status: 400 });
    }

    const body = await req.json();
    const patch: Record<string, any> = { ...body };

    // Same snapshot rule as create — keep the stored price consistent with the
    // formula inputs, even though reads recompute it live.
    if (patch.pricingMode === 'formula') {
      const computed = computeFormulaPrice(patch, await readRates());
      if (computed === null || computed <= 0) {
        return NextResponse.json({
          error: "Set the metal, weight and that metal’s current rate before saving a formula-priced piece.",
        }, { status: 400 });
      }
      patch.price = computed;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      patch,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Keep our search index mapping mirror state up to date
    await SearchIndex.findOneAndUpdate(
      { productRefId: id },
      { 
        keyword: updatedProduct.productName,
        category: updatedProduct.category
      }
    );
    
    return NextResponse.json({ message: "Updated", product: updatedProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
};

// 5. DELETE PRODUCT (Atomic cascade cleanup + CDN Purging enabled)
export const deleteProduct = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id"); 
    
    if (!id) {
      return NextResponse.json({ error: "ID missing in URL" }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await SearchIndex.deleteOne({ productRefId: id });

    // Execute instant Cloudflare CDN Cache purging for text payloads and R2 image assets
    const encodedSearch = encodeURIComponent(deletedProduct.productName);
    const cdnSearchUrl = `https://shagunratna.com/api/products?search=${encodedSearch}&page=1&limit=10`;
    
    await purgeCDNCache(cdnSearchUrl); 

    if (deletedProduct.imageUrl) {
      await purgeCDNCache(deletedProduct.imageUrl); 
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
};

// 6. Sets the homepage Product Grid section to show exactly these products —
// anything previously featured but not in `featuredIds` is unfeatured.
export const syncFeaturedProducts = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    const body = await req.json();
    const featuredIds: string[] = Array.isArray(body.featuredIds) ? body.featuredIds : [];

    await Product.updateMany({}, { $set: { featured: false } });
    if (featuredIds.length > 0) {
      await Product.updateMany({ _id: { $in: featuredIds } }, { $set: { featured: true } });
    }

    return NextResponse.json(
      { success: true, message: "Homepage product grid updated", count: featuredIds.length },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to update homepage product grid" }, { status: 500 });
  }
};