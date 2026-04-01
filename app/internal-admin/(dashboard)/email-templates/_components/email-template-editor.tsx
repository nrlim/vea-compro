"use client";

import { useState, useRef } from "react";
import { Workflow, Plus, Eye, Save, Trash2, ArrowLeft, MessageSquare, CreditCard, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createEmailRouteAction, updateEmailRouteAction, deleteEmailRouteAction } from "@/app/actions/email-routes";
import Link from "next/link";

export default function EmailTemplateEditor({ initialData, routeId }: { initialData: any, routeId: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [triggerEvent, setTriggerEvent] = useState(initialData?.triggerEvent || "INQUIRY");
  const [htmlContent, setHtmlContent] = useState(initialData?.htmlTemplate || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [attachProduct, setAttachProduct] = useState(initialData?.attachProduct ?? false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    formData.set("triggerEvent", triggerEvent);
    formData.set("htmlTemplate", htmlContent);
    formData.set("isActive", isActive.toString());
    formData.set("attachProduct", attachProduct.toString());

    let result;
    if (routeId === "new") {
      result = await createEmailRouteAction(formData);
    } else {
      result = await updateEmailRouteAction(routeId, formData);
    }
    
    if (result.success) {
      toast.success(result.message);
      router.push("/internal-admin/email-templates");
    } else {
      toast.error(result.message);
    }
    setIsPending(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this specific email routing rule? This action cannot be undone.")) return;
    setIsPending(true);
    const result = await deleteEmailRouteAction(routeId);
    if (result.success) {
      toast.success(result.message);
      router.push("/internal-admin/email-templates");
    } else {
      toast.error(result.message);
      setIsPending(false);
    }
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
    if (triggerEvent === "INQUIRY") {
      mock = mock.replace(/\{\{name\}\}/gi, "<b>John Doe</b>");
      mock = mock.replace(/\{\{company\}\}/gi, "<b>PT Corp Maju</b>");
      mock = mock.replace(/\{\{email\}\}/gi, "<b>john@corpmaju.com</b>");
      mock = mock.replace(/\{\{product\}\}/gi, "<b>Solar Panel 500W</b>");
      mock = mock.replace(/\{\{productImage\}\}/gi, "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=200&auto=format&fit=crop");
      mock = mock.replace(/\{\{subject\}\}/gi, "Inquiry Konsultasi Baru: John Doe - PT Corp Maju");
      mock = mock.replace(/\{\{message\}\}/gi, "<i>Halo, kami sangat tertarik dengan produk yang ditawarkan dan ingin konsultasi lebih lanjut. Terima kasih.</i>");
    } else if (triggerEvent === "TRANSACTION") {
      mock = mock.replace(/\{\{order_id\}\}/gi, "<b>VEA-173873-F2X</b>");
      mock = mock.replace(/\{\{customer_name\}\}/gi, "<b>Amanda Smith</b>");
      mock = mock.replace(/\{\{customer_email\}\}/gi, "<b>amanda@mail.com</b>");
      mock = mock.replace(/\{\{tagihan\}\}/gi, "<b>Rp 150.000</b>");
      mock = mock.replace(/\{\{product_list\}\}/gi, "<li>Filter Mesin Industri x2</li><li>Oli Pelumas R x1</li>");
      mock = mock.replace(/\{\{subject\}\}/gi, "Pemberitahuan Transaksi PT VEA - VEA-173873-F2X");
    }
    return mock;
  };

  const activeTags = triggerEvent === "INQUIRY" ? [
    { label: "Name", tag: "{{name}}" },
    { label: "Company", tag: "{{company}}" },
    { label: "Email", tag: "{{email}}" },
    { label: "Product", tag: "{{product}}" },
    { label: "Product Img", tag: "{{productImage}}" },
    { label: "Msg", tag: "{{message}}" },
  ] : [
    { label: "Order ID", tag: "{{order_id}}" },
    { label: "Customer", tag: "{{customer_name}}" },
    { label: "Email", tag: "{{customer_email}}" },
    { label: "Amount", tag: "{{tagihan}}" },
    { label: "Item List", tag: "{{product_list}}" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Route Info Section */}
      <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Workflow className="w-64 h-64 -mt-16 -mr-16" />
        </div>
        
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <Link href="/internal-admin/email-templates" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Link>
            <h3 className="font-bold text-navy text-lg tracking-tight uppercase">Route Definition</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Configuration Name</Label>
              <Input 
                name="name" 
                required
                defaultValue={initialData?.name || ""} 
                placeholder="e.g. Sales Notification Alert"
                className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Trigger Event</Label>
              <input type="hidden" name="triggerEvent" value={triggerEvent} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                <button 
                  type="button" 
                  onClick={() => setTriggerEvent("INQUIRY")} 
                  className={`p-3 border rounded-xl flex items-start gap-3 transition-all text-left group ${triggerEvent === "INQUIRY" ? "border-purple-600 bg-purple-50 ring-2 ring-purple-600/20" : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"}`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${triggerEvent === "INQUIRY" ? "bg-purple-600 text-white shadow-sm" : "bg-slate-100 text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600"}`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${triggerEvent === "INQUIRY" ? "text-purple-900" : "text-slate-700"}`}>Contact Inquiry</div>
                    <div className={`text-xs mt-0.5 leading-snug ${triggerEvent === "INQUIRY" ? "text-purple-700/80" : "text-slate-500"}`}>Triggered when user submits a consultation form.</div>
                  </div>
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setTriggerEvent("TRANSACTION")} 
                  className={`p-3 border rounded-xl flex items-start gap-3 transition-all text-left group ${triggerEvent === "TRANSACTION" ? "border-amber-600 bg-amber-50 ring-2 ring-amber-600/20" : "border-slate-200 hover:border-amber-300 hover:bg-slate-50"}`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${triggerEvent === "TRANSACTION" ? "bg-amber-600 text-white shadow-sm" : "bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600"}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${triggerEvent === "TRANSACTION" ? "text-amber-900" : "text-slate-700"}`}>Transaction Settlement</div>
                    <div className={`text-xs mt-0.5 leading-snug ${triggerEvent === "TRANSACTION" ? "text-amber-700/80" : "text-slate-500"}`}>Triggered after a successful Midtrans payment.</div>
                  </div>
                </button>
              </div>
            </div>

             <div className="flex items-center gap-4 py-2">
                <Switch 
                  id="isActive" 
                  checked={isActive} 
                  onCheckedChange={setIsActive} 
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  <span className="font-bold text-navy">Enable / Active</span>
                  <p className="text-xs text-slate-400 font-normal">Active routes will automatically dispatch when triggered.</p>
                </Label>
              </div>
          </div>
        </div>

        <div className="space-y-6 pt-10 lg:pt-0 relative z-10 lg:pl-8 lg:border-l lg:border-slate-100">
           <h3 className="font-bold text-navy text-lg tracking-tight uppercase">Email Headers</h3>

           <div className="space-y-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject Blueprint</Label>
              <Input 
                name="subjectTemplate" 
                defaultValue={initialData?.subjectTemplate || ""} 
                placeholder="e.g. You have a new message from {{name}}"
                required
                className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm font-mono text-xs"
              />
            </div>

            <div className={`grid gap-4 ${triggerEvent === "TRANSACTION" ? "grid-cols-1" : "grid-cols-2"}`}>
              {triggerEvent !== "TRANSACTION" && (
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Send To (Leave blank if dynamic)</Label>
                  <Input 
                    name="toEmail" 
                    defaultValue={initialData?.toEmail || ""} 
                    placeholder="sales@ptvea.com"
                    className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              )}

              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  {triggerEvent === "TRANSACTION" ? "BCC Emails (Admin Notifications)" : "BCC Emails"}
                </Label>
                <MultiEmailInput 
                  name="bccEmail"
                  initialValue={initialData?.bccEmail || ""}
                  placeholder="Type email and press Enter or ';'"
                />
              </div>
            </div>

             {triggerEvent === "INQUIRY" && (
              <div className="flex items-center gap-4 py-2 mt-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                <Switch 
                  id="attachProduct" 
                  checked={attachProduct} 
                  onCheckedChange={setAttachProduct} 
                />
                <Label htmlFor="attachProduct" className="cursor-pointer">
                  <span className="font-bold text-orange-900">Attach Product Image</span>
                  <p className="text-xs text-orange-700/70 font-normal">Automatically append the product image to this email if available.</p>
                </Label>
              </div>
             )}
        </div>
      </div>

      {/* Action Bar */}
       <div className="flex items-center justify-between bg-white p-4 border border-slate-200 rounded-xl shadow-sm sticky top-4 z-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg text-white">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-navy">Responsive Mail Designer</h2>
              <p className="text-xs text-slate-500">HTML Code and Live Rendering output</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {routeId !== "new" && (
              <Button type="button" onClick={handleDelete} variant="destructive" disabled={isPending} className="h-10 min-w-[40px] px-3 shadow-sm rounded-lg" title="Delete Workflow">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button type="submit" disabled={isPending} className="bg-navy hover:bg-navy/90 text-white min-w-[140px] shadow-sm font-semibold h-10 transition-all rounded-lg">
              {isPending ? "Validating..." : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Workflow
                </>
              )}
            </Button>
          </div>
        </div>

      {/* Editor Section */}
      <div className="p-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[700px]">
         <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Editor */}
            <div className="flex flex-col border-r border-slate-100 min-h-[650px] bg-white h-full relative">
              <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-slate-100 bg-white sticky top-0 z-10 transition-all">
                {activeTags.map((t) => (
                  <button
                    key={t.tag}
                    type="button"
                    onClick={() => insertTag(t.tag)}
                    className="px-2 py-1.5 bg-slate-50 hover:bg-navy hover:text-white border border-slate-200 hover:border-navy text-slate-500 rounded text-[10px] font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> {t.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 p-0 absolute inset-0 top-[50px]">
                 <Textarea 
                  ref={textareaRef}
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full h-full border-0 bg-[#0f111a] text-[#a6accd] p-6 font-mono text-[13px] leading-relaxed resize-none rounded-none focus-visible:ring-0 focus-visible:outline-none"
                  spellCheck={false}
                  placeholder={`<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Dynamic Subject: {{subject}}</h1>\n  </body>\n</html>`}
                />
              </div>
            </div>

            {/* Right Preview */}
            <div className="flex flex-col bg-slate-50/50 h-full relative">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/80 backdrop-blur z-10 sticky top-0">
                <Eye className="h-4 w-4" /> Live High Fidelity Preview
              </div>
              <div className="flex-1 w-full h-full absolute inset-0 top-[45px]">
                {htmlContent ? (
                  <iframe 
                    title="Live Email Preview"
                    srcDoc={renderPreview()}
                    className="w-full h-full border-none bg-white"
                    sandbox="allow-same-origin"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <Workflow className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm italic">Engine waiting for valid HTML input.</p>
                  </div>
                )}
              </div>
            </div>
         </div>
      </div>
    </form>
  );
}

function MultiEmailInput({ name, initialValue, placeholder }: { name: string, initialValue: string, placeholder: string }) {
  const [emails, setEmails] = useState<string[]>(initialValue ? initialValue.split(/[;,]/).map(s => s.trim()).filter(Boolean) : []);
  const [inputValue, setInputValue] = useState("");

  const addEmail = (email: string) => {
    const val = email.trim();
    if (val && !emails.includes(val)) {
      setEmails([...emails, val]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ";" || e.key === ",") {
      e.preventDefault();
      addEmail(inputValue);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue) {
      e.preventDefault();
      setEmails(emails.slice(0, -1));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Only add if there's actual text
    if (inputValue.trim()) {
      addEmail(inputValue);
      setInputValue("");
    }
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2 items-center bg-slate-50/50 border border-slate-200 p-1.5 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-navy focus-within:bg-white transition-all min-h-[44px]">
      <input type="hidden" name={name} value={emails.join(";")} />
      {emails.map((email, i) => (
        <span key={i} className="flex items-center gap-1.5 bg-navy text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
          {email}
          <button type="button" onClick={() => removeEmail(i)} className="hover:bg-red-500/20 rounded-full p-0.5 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={emails.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm px-2 text-slate-700 placeholder:text-slate-400"
      />
    </div>
  );
}
