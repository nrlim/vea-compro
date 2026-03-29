import type { Metadata } from "next";
import { getBrands } from "@/app/actions/brands";
import { BrandsClient } from "./_components/brands-client";

export const metadata: Metadata = { title: "Brands" };

export default async function BrandsPage() {
  const { data: brands, error } = await getBrands();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight font-serif">Brands</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Tampilkan brand dan logo untuk memperkuat kepercayaan publik.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Gagal memuat data brands: {error}
        </div>
      )}

      <BrandsClient initialBrands={brands} />
    </div>
  );
}
