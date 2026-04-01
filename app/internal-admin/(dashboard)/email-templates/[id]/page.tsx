import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EmailTemplateEditor from "../_components/email-template-editor";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Email Configuration Editor" };

export default async function EmailTemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  let initialData = null;
  const p = await params;

  if (p.id !== "new") {
    initialData = await (prisma as any).emailRoute.findUnique({
      where: { id: p.id },
    });

    if (!initialData) {
      notFound();
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-navy tracking-tight font-serif italic">
          {p.id === "new" ? "Create Workflow" : "Edit Workflow"}
        </h2>
        <p className="text-slate-500 mt-1 max-w-xl text-sm">
          Design your automated email blueprint. Map dynamic tags into the subject and HTML body. Active workflows will listen to specific event triggers.
        </p>
      </div>

      <EmailTemplateEditor initialData={initialData} routeId={p.id} />
    </div>
  );
}
