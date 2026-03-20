import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { ContactDetailModal, DeleteContactButton } from "@/app/internal-admin/_components/message-button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const pageSize = 10; // Set items per page limit

  const totalItems = await prisma.contactRequest.count();
  const totalPages = Math.ceil(totalItems / pageSize);

  const contacts = await prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const allProducts = await prisma.product.findMany();
  const productMap = new Map(allProducts.map(p => [p.id, p.name]));

  const getProductDisplay = (productStr: string | null) => {
    if (!productStr) return "Umum / Tidak spesifik";
    return productStr.split(',').map(p => productMap.get(p.trim()) || p.trim()).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Inbox className="w-6 h-6" /> Daftar Kontak Konsultasi
        </h1>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          Total Pesan Masuk: <span className="font-semibold text-navy">{totalItems}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold">Nama & Email</th>
                <th className="px-6 py-4 font-semibold">Perusahaan</th>
                <th className="px-6 py-4 font-semibold">Produk / Layanan</th>
                <th className="px-6 py-4 font-semibold text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Belum ada pesan kontak yang masuk.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group align-top">
                    <td className="px-6 py-4 text-slate-600">
                      {format(new Date(contact.createdAt), "dd MMM yyyy")}
                      <div className="text-xs text-slate-400 mt-0.5">
                        {format(new Date(contact.createdAt), "HH:mm")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy">{contact.name}</div>
                      <a href={`mailto:${contact.email}`} className="text-xs text-blue-600 hover:underline mt-0.5">
                        {contact.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {contact.company || "-"}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] whitespace-normal">
                      {contact.product ? (
                        <div className="inline-flex flex-wrap gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium break-words leading-relaxed">
                          {getProductDisplay(contact.product)}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Umum / Tidak spesifik</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col gap-2 items-center">
                        <ContactDetailModal contact={{...contact, product: getProductDisplay(contact.product)}} />
                        <DeleteContactButton id={contact.id} contactName={contact.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination & Count */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <p className="text-xs text-slate-500">
          Menampilkan <span className="font-medium text-navy">{contacts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> hingga <span className="font-medium text-navy">{Math.min(currentPage * pageSize, totalItems)}</span> dari <span className="font-medium text-navy">{totalItems}</span> entri
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Link
              href={currentPage > 1 ? `/internal-admin/contacts?page=${currentPage - 1}` : "#"}
              className={cn(
                "inline-flex items-center justify-center h-8 w-8 rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                currentPage === 1
                  ? "border-slate-200 text-slate-300 pointer-events-none"
                  : "border-slate-200 text-navy hover:bg-slate-50"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/internal-admin/contacts?page=${page}`}
                  className={cn(
                    "inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    currentPage === page 
                      ? "bg-navy text-white hover:bg-navy-light shadow" 
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {page}
                </Link>
              ))}
            </div>

            <Link
              href={currentPage < totalPages ? `/internal-admin/contacts?page=${currentPage + 1}` : "#"}
              className={cn(
                "inline-flex items-center justify-center h-8 w-8 rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                currentPage === totalPages
                  ? "border-slate-200 text-slate-300 pointer-events-none"
                  : "border-slate-200 text-navy hover:bg-slate-50"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
