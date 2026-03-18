"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateEmailRoutingAction } from "@/app/actions/settings";

export function EmailSettingsClient({ initialSettings }: { initialSettings: any }) {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    // Explicitly handle the custom checkbox since it might not be in the form data if unchecked
    const result = await updateEmailRoutingAction(formData);
    
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
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-navy">Email Routing</h2>
              <p className="text-xs text-slate-500">Configure where consulting leads are delivered.</p>
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="bg-navy hover:bg-navy/90 text-white min-w-[140px] shadow-sm font-semibold h-10 transition-all">
            {isPending ? "Saving..." : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Routing
              </>
            )}
          </Button>
        </div>

        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="max-w-3xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">From Name / Email</Label>
                <Input 
                  name="emailFrom" 
                  defaultValue={initialSettings.emailFrom} 
                  className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm"
                  placeholder="PT VEA <noreply@ptvea.com>"
                />
                <p className="text-[10px] text-slate-400 font-medium">Example: PT VEA Notification &lt;noreply@ptvea.com&gt;</p>
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
                <p className="text-[10px] text-slate-400">The main sales inbox.</p>
              </div>

              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">BCC Recipients</Label>
                <Input 
                  name="emailBcc" 
                  defaultValue={initialSettings.emailBcc || ""} 
                  placeholder="manager@ptvea.com"
                  className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm"
                />
                <p className="text-[10px] text-slate-400 italic">Comma-separated emails.</p>
              </div>
              
              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject Line Template</Label>
                <Input 
                  name="emailSubject" 
                  defaultValue={initialSettings.emailSubject} 
                  className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all shadow-sm font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400">Tags: {"{{name}}"}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
               <label className="group flex items-center gap-4 p-5 bg-slate-50/50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all border-dashed">
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
                  <p className="text-xs text-slate-500 italic">Physically attach the product image to the outbound email.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
