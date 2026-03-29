import type { Metadata } from "next";
import { getMitras } from "@/app/actions/mitra";
import { MitraClient } from "./_components/mitra-client";

export const metadata: Metadata = { title: "Mitra" };

export default async function MitraPage() {
  const { data: mitras, error } = await getMitras();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight font-serif">Mitra</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Kelola daftar Mitra (Partner) yang tampil di Landing Page. Fitur drag & drop untuk mengatur urutan.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Gagal memuat data mitra: {error}
        </div>
      )}

      <MitraClient initialMitras={mitras} />
    </div>
  );
}
