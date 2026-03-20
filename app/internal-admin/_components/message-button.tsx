"use client";

import { useState } from "react";
import { MessageSquare, X, Download, User, Building2, Package, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { ContactRequest } from "@prisma/client";

export function ContactDetailModal({ contact }: { contact: ContactRequest }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-semibold text-white bg-navy hover:bg-navy/90 px-3 py-2 rounded-lg transition-colors w-full flex items-center justify-center gap-1.5 shadow-sm"
      >
        <MessageSquare className="w-4 h-4" /> Lihat Detail
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full text-left flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-lg text-navy">Detail Pesan Konsultasi</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* User Data */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Nama & Email</div>
                  <div className="font-semibold text-navy">{contact.name}</div>
                  <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline">{contact.email}</a>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Perusahaan</div>
                  <div className="font-medium text-slate-700">{contact.company || "-"}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Produk Minat</div>
                  <div className="font-medium text-slate-700 whitespace-normal break-words leading-tight">{contact.product || "Umum / Tidak spesifik"}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Waktu Submit</div>
                  <div className="font-medium text-slate-700">{format(new Date(contact.createdAt), "dd MMM yyyy, HH:mm")}</div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-sm font-bold text-navy mb-2 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <MessageSquare className="w-4 h-4" />
                  Isi Kebutuhan / Pesan
                </h4>
                <div className="bg-white border border-slate-200 p-4 rounded-lg text-sm text-slate-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {contact.message}
                </div>
              </div>

              {/* Attachment */}
              {contact.attachment && (
                <div>
                  <h4 className="text-sm font-bold text-navy mb-2 flex items-center gap-2 border-b border-slate-100 pb-2">
                    Lampiran File
                  </h4>
                  <div className="space-y-4 pt-1">
                    {contact.attachment.split(',').map((attPath, idx) => {
                      const cleanPath = attPath.trim();
                      if (!cleanPath) return null;

                      if (cleanPath.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp)$/i)) {
                        return (
                          <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col shadow-sm">
                            <div className="relative w-full overflow-auto max-h-[400px]">
                              <img 
                                src={cleanPath} 
                                alt={`Attachment Preview ${idx + 1}`} 
                                className="w-full h-auto object-contain"
                              />
                            </div>
                            <div className="p-3 bg-white border-t border-slate-200 flex justify-between items-center">
                              <span className="text-xs text-slate-500 font-medium truncate pr-4 max-w-[200px] sm:max-w-xs" title={cleanPath.split('/').pop()}>
                                {cleanPath.split('/').pop()}
                              </span>
                              <a
                                href={`/api/download?file=${encodeURIComponent(cleanPath)}`}
                                download
                                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-navy bg-navy/5 hover:bg-navy/10 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" /> Unduh Asli
                              </a>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div key={idx} className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-xl flex-wrap gap-3 shadow-sm">
                            <div className="text-sm font-medium text-green-800 break-words flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                              File dokumen/zip terlampir
                            </div>
                            <a
                              href={`/api/download?file=${encodeURIComponent(cleanPath)}`}
                              download
                              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                            >
                              <Download className="w-4 h-4" /> Download File
                            </a>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-6 py-2 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
