import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { CreditCard, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const pageSize = 10;

  const totalItems = await prisma.order.count();
  const totalPages = Math.ceil(totalItems / pageSize);

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const parseItemDetails = (jsonStr: string | null) => {
    if (!jsonStr) return [];
    try {
      return JSON.parse(jsonStr) as Array<{ name: string; quantity: number; price: number }>;
    } catch {
      return [];
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "settlement":
      case "capture":
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Berhasil</span>;
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">Menunggu</span>;
      case "expire":
      case "cancel":
      case "deny":
      case "failure":
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">Gagal/Batal</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <CreditCard className="w-6 h-6" /> Riwayat Transaksi
        </h1>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
          Total Transaksi: <span className="font-semibold text-navy">{totalItems}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Waktu Pemesanan</th>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Pelanggan</th>
                <th className="px-6 py-4 font-semibold">Detail Produk</th>
                <th className="px-6 py-4 font-semibold">Total Tagihan</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Belum ada riwayat transaksi.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const items = parseItemDetails(order.itemDetails);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group align-top">
                      <td className="px-6 py-4 text-slate-600">
                        {format(new Date(order.createdAt), "dd MMM yyyy")}
                        <div className="text-xs text-slate-400 mt-0.5">
                          {format(new Date(order.createdAt), "HH:mm")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-navy/80 bg-slate-100 px-2 py-1 rounded">
                          {order.orderId}
                        </span>
                        {order.paymentType && (
                          <div className="text-[10px] text-slate-400 mt-1 uppercase">
                            {order.paymentType.replace(/_/g, " ")}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-navy">{order.customerName}</div>
                        <a href={`mailto:${order.customerEmail}`} className="text-xs text-blue-600 hover:underline mt-0.5 block">
                          {order.customerEmail}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 max-w-[250px] whitespace-normal">
                          {items.length > 0 ? (
                            items.map((item, idx) => (
                              <div key={idx} className="text-xs text-slate-600 border-l-2 border-slate-200 pl-2">
                                <span className="font-medium">{item.name}</span>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  {item.quantity} x {formatRupiah(item.price)}
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">Data produk tidak tersedia</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-navy">
                        {formatRupiah(order.grossAmount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <p className="text-xs text-slate-500">
            Menampilkan <span className="font-medium text-navy">{(currentPage - 1) * pageSize + 1}</span> hingga <span className="font-medium text-navy">{Math.min(currentPage * pageSize, totalItems)}</span> dari <span className="font-medium text-navy">{totalItems}</span> transaksi
          </p>

          <div className="flex items-center gap-1">
            <Link
              href={currentPage > 1 ? `/internal-admin/orders?page=${currentPage - 1}` : "#"}
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
                  href={`/internal-admin/orders?page=${page}`}
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
              href={currentPage < totalPages ? `/internal-admin/orders?page=${currentPage + 1}` : "#"}
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
        </div>
      )}
    </div>
  );
}
