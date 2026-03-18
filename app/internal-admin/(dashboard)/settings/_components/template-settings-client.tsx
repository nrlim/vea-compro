"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Save, Eye, Workflow, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateEmailTemplateAction } from "@/app/actions/settings";

export function TemplateSettingsClient({ initialSettings }: { initialSettings: any }) {
  const [isPending, setIsPending] = useState(false);
  const [htmlContent, setHtmlContent] = useState(initialSettings.emailHtml || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData();
    formData.set("emailHtml", htmlContent);

    const result = await updateEmailTemplateAction(formData);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsPending(false);
  };

  const insertTag = (tag: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newContent = htmlContent.substring(0, start) + tag + htmlContent.substring(end);
    setHtmlContent(newContent);
    
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  const renderPreview = () => {
    let mock = htmlContent;
    mock = mock.replace(/\{\{name\}\}/gi, "<b>John Doe</b>");
    mock = mock.replace(/\{\{company\}\}/gi, "<b>PT Corp Maju</b>");
    mock = mock.replace(/\{\{email\}\}/gi, "<b>john@corpmaju.com</b>");
    mock = mock.replace(/\{\{product\}\}/gi, "<b>Solar Panel 500W</b>");
    mock = mock.replace(/\{\{productImage\}\}/gi, "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=200&auto=format&fit=crop");
    mock = mock.replace(/\{\{subject\}\}/gi, "Inquiry Konsultasi Baru: John Doe - PT Corp Maju");
    mock = mock.replace(/\{\{message\}\}/gi, "<i>Halo, kami sangat tertarik dengan produk yang ditawarkan dan ingin konsultasi lebih lanjut. Terima kasih.</i>");
    return mock;
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg text-white">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-navy">Content Designer</h2>
              <p className="text-xs text-slate-500">Design the global inquiry notification blueprint.</p>
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="bg-navy hover:bg-navy/90 text-white min-w-[140px] shadow-sm font-semibold h-10 transition-all">
            {isPending ? "Applying Changes..." : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Apply Changes
              </>
            )}
          </Button>
        </div>

        <div className="p-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[700px]">
           <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Editor */}
              <div className="flex flex-col border-r border-slate-100 min-h-[650px] bg-white">
                <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-slate-100 bg-white sticky top-0 z-10">
                  {[
                    { label: "Name", tag: "{{name}}" },
                    { label: "Company", tag: "{{company}}" },
                    { label: "Email", tag: "{{email}}" },
                    { label: "Product", tag: "{{product}}" },
                    { label: "Product Img", tag: "{{productImage}}" },
                    { label: "Subject", tag: "{{subject}}" },
                    { label: "Message", tag: "{{message}}" },
                  ].map((t) => (
                    <button
                      key={t.tag}
                      type="button"
                      onClick={() => insertTag(t.tag)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:bg-navy hover:text-white hover:border-navy text-slate-500 rounded text-[10px] font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" /> {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex-1 p-0 group">
                   <Textarea 
                    ref={textareaRef}
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    className="w-full h-full border-0 bg-[#1e1e1e] text-[#d4d4d4] p-6 font-mono text-[13px] leading-relaxed resize-none rounded-none focus-visible:ring-0 focus-visible:outline-none min-h-[600px]"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Right Preview */}
              <div className="flex flex-col bg-slate-50/30">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white">
                  <Eye className="h-3.5 w-3.5" /> Live High Fidelity Preview
                </div>
                <div className="flex-1 min-h-[600px] h-full relative">
                  {htmlContent ? (
                    <iframe 
                      title="Live Email Preview"
                      srcDoc={renderPreview()}
                      className="w-full h-full border-none bg-white"
                      sandbox="allow-same-origin"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 p-8 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                        <Workflow className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="text-sm italic">Blank Template</p>
                    </div>
                  )}
                </div>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
