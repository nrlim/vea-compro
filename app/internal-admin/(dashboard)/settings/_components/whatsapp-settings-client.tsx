"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateWhatsAppAction } from "@/app/actions/settings";

export function WhatsAppSettingsClient({ initialSettings }: { initialSettings: any }) {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await updateWhatsAppAction(formData);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsPending(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-navy">WhatsApp Channel</h2>
              <p className="text-xs text-slate-500">Configure the direct contact hotline.</p>
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="bg-navy hover:bg-navy/90 text-white min-w-[140px] shadow-sm font-semibold h-10 transition-all">
            {isPending ? "Saving..." : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save WhatsApp
              </>
            )}
          </Button>
        </div>

        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-2.5 max-w-sm">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Phone (Intl. Format)</Label>
              <Input 
                name="whatsappNumber" 
                defaultValue={initialSettings.whatsappNumber || "628123456789"} 
                className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm font-semibold"
                placeholder="62812..."
              />
              <p className="text-[10px] text-slate-400 italic">No spaces or plus (+) sign. ID is 62.</p>
            </div>

            <div className="space-y-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Default Conversation Opener</Label>
              <Textarea 
                name="whatsappMessage" 
                defaultValue={initialSettings.whatsappMessage || ""} 
                className="bg-slate-50/50 border-slate-200 min-h-[120px] focus:bg-white transition-all shadow-sm leading-relaxed"
                placeholder="Explain what the message should be..."
              />
              <p className="text-[10px] text-slate-400">This message is pre-typed on the user's phone when they click the WhatsApp icon.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
