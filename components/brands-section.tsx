import type { Brand } from "@/app/actions/brands";

export function BrandsSection({ brands }: { brands: Brand[] }) {
  const brandList = brands || [];

  return (
    <section id="brands" className="py-20 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--gold-dark)" }}
          >
            Teknologi & Solusi Terpercaya
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy mb-6">
            Platform & Brands
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Kami bekerjasama dengan berbagai brand terkemuka dunia untuk menghadirkan
            teknologi terkini dan solusi terbaik bagi infrastruktur energi Anda.
          </p>
        </div>

        {brandList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-400">Belum ada brand yang ditampilkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brandList.map((brand) => (
              <div
                key={brand.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col"
              >
                <div className="h-32 mb-6 flex items-center justify-center p-4 bg-slate-50 rounded-xl group-hover:bg-slate-100/50 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.logoUrl}
                    alt={`Logo ${brand.name}`}
                    className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all"
                  />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-[var(--gold-dark)] transition-colors">
                    {brand.name}
                  </h3>
                  
                  {brand.category && (
                    <span className="inline-block px-2.5 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-md mb-3 self-start">
                      {brand.category}
                    </span>
                  )}
                  
                  {brand.description && (
                    <p className="text-slate-600 text-sm leading-relaxed mt-auto line-clamp-3">
                      {brand.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
