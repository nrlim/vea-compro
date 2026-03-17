"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Save, Mail, Code, Eye, Workflow, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateAppSettingsAction } from "@/app/actions/settings";
import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings2 } from "lucide-react";

export function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const [isPending, setIsPending] = useState(false);
  const [htmlContent, setHtmlContent] = useState(initialSettings.emailHtml || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    // Make sure we pass the potentially modified state back to the form payload
    const formData = new FormData(e.currentTarget);
    formData.set("emailHtml", htmlContent);

    const result = await updateAppSettingsAction(formData);
    
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
    <div className="w-full max-w-6xl mx-auto pb-20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between bg-white p-4 border border-slate-200 rounded-xl shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-navy/5 rounded-lg">
              <Settings2 className="h-5 w-5 text-navy" />
            </div>
            <div>
              <h2 className="font-bold text-navy">Application Settings</h2>
              <p className="text-xs text-slate-500">Configure your inquiry blueprints and channels.</p>
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="bg-navy hover:bg-navy/90 text-white min-w-[140px] shadow-sm font-semibold h-10 transition-all">
            {isPending ? (
              <span className="flex items-center gap-2">
                 <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Saving...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Apply Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="bg-slate-100 p-1 mb-6 rounded-lg gap-1 border border-slate-200 h-auto">
            <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm px-6 py-2.5 rounded-md transition-all font-medium text-slate-600">
              <Mail className="h-4 w-4 mr-2" /> Email Logic
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm px-6 py-2.5 rounded-md transition-all font-medium text-slate-600">
              <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp Channel
            </TabsTrigger>
            <TabsTrigger value="designer" className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm px-6 py-2.5 rounded-md transition-all font-medium text-slate-600">
              <Workflow className="h-4 w-4 mr-2" /> Content Designer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-0 space-y-6 animate-in fade-in-50 duration-300">
            <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] gap-8">
              <div className="max-w-3xl space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-navy mb-1 italic">Email Routing</h3>
                  <p className="text-sm text-slate-500">Define where consulting inquiries are delivered and how they appear in the inbox.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">From Name / Email</Label>
                    <Input 
                      name="emailFrom" 
                      defaultValue={initialSettings.emailFrom} 
                      className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm"
                      placeholder="PT VEA <noreply@ptvea.com>"
                    />
                    <p className="text-[10px] text-slate-400">Professional recommended format: Display Name &lt;email@domain.com&gt;</p>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Recipient (To)</Label>
                    <Input 
                      name="emailTo" 
                      type="email"
                      defaultValue={initialSettings.emailTo} 
                      className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm"
                      placeholder="sales@ptvea.com"
                    />
                    <p className="text-[10px] text-slate-400">The main inbox that handles all consulting leads.</p>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">BCC Recipients (Blind Carbon Copy)</Label>
                    <Input 
                      name="emailBcc" 
                      defaultValue={initialSettings.emailBcc || ""} 
                      placeholder="manager@ptvea.com, owner@ptvea.com"
                      className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm"
                    />
                    <p className="text-[10px] text-slate-400">Comma-separated emails that will receive a secret copy of every lead.</p>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject Line Blueprint</Label>
                    <Input 
                      name="emailSubject" 
                      defaultValue={initialSettings.emailSubject} 
                      className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm font-mono text-xs"
                    />
                    <p className="text-[10px] text-slate-400">Use {'{{name}}'} or {'{{company}}'} to personalize the subject line.</p>
                  </div>
                </div>

                <div className="pt-4">
                  <label className="group flex items-center gap-4 p-5 bg-slate-50/50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/80 transition-all border-dashed hover:border-navy/30">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        name="emailAttachProduct" 
                        defaultChecked={initialSettings.emailAttachProduct ?? true}
                        value="true"
                        className="peer w-6 h-6 accent-navy rounded-md border-slate-300 transition-all cursor-pointer opacity-0 absolute z-10"
                      />
                      <div className="w-6 h-6 border-2 border-slate-300 rounded-md bg-white peer-checked:bg-navy peer-checked:border-navy transition-all flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-navy">Enable Automated Product Attachments</p>
                      <p className="text-xs text-slate-500 leading-relaxed">Physically attach the selected product image file to the email. Essential for offline review by Sales teams.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="whatsapp" className="mt-0 animate-in slide-in-from-left-4 fade-in duration-400">
            <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
              <div className="max-w-3xl space-y-8">
                <div className="flex items-start gap-4 p-4 bg-green-50/50 border border-green-100 rounded-xl mb-6">
                  <div className="p-2 bg-green-500 rounded-lg text-white">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900">Direct WhatsApp Integration</h3>
                    <p className="text-sm text-green-700/80 leading-relaxed">Changes here update the floating contact button across the entire platform in real-time.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-2.5 max-w-md">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Phone (Intl. Format)</Label>
                    <Input 
                      name="whatsappNumber" 
                      defaultValue={initialSettings.whatsappNumber || "628123456789"} 
                      className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm font-semibold"
                      placeholder="62812..."
                    />
                    <p className="text-[10px] text-slate-400 italic">No spaces or plus (+) sign. Indonesia is 62.</p>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Default Conversation Opener</Label>
                    <Textarea 
                      name="whatsappMessage" 
                      defaultValue={initialSettings.whatsappMessage || ""} 
                      className="bg-slate-50/50 border-slate-200 min-h-[100px] focus:bg-white transition-all shadow-sm leading-relaxed"
                      placeholder="Explain what the message should be..."
                    />
                    <p className="text-[10px] text-slate-400">This message is pre-typed on the user's phone when they click the WhatsApp button.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="designer" className="mt-0 animate-in zoom-in-95 fade-in duration-300">
            <div className="p-1 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                      <Workflow className="h-5 w-5" /> Blueprint Designer
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">Design the structure of the HTML email. Changes reflect immediately in the live preview on the right.</p>
               </div>

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
                      <Eye className="h-3.5 w-3.5" /> High Fidelity Preview
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
                          <div className="space-y-1">
                            <p className="text-sm font-semibold">Blank Canvas</p>
                            <p className="text-xs max-w-[200px]">Start typing your HTML blueprint to see it rendered here in real-time.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
               </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}

