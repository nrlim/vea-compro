import type { Metadata } from "next";
import { getProducts } from "@/app/actions/products";
import { ProductsClient } from "./_components/products-client";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const { data: products, error } = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight font-serif">Products</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your product catalog — add, edit, or remove items.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Failed to load products: {error}
        </div>
      )}

      <ProductsClient initialProducts={products} />
    </div>
  );
}
