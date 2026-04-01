"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const EmailRouteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  triggerEvent: z.string().min(1, "Trigger event is required"),
  subjectTemplate: z.string().min(1, "Subject template is required"),
  toEmail: z.string().optional(),
  bccEmail: z.string().optional(),
  htmlTemplate: z.string().optional(),
  attachProduct: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export async function createEmailRouteAction(formData: FormData) {
  try {
    const raw = {
      name: (formData.get("name") as string) || "",
      triggerEvent: (formData.get("triggerEvent") as string) || "",
      subjectTemplate: (formData.get("subjectTemplate") as string) || "",
      toEmail: (formData.get("toEmail") as string) || "",
      bccEmail: (formData.get("bccEmail") as string) || "",
      htmlTemplate: (formData.get("htmlTemplate") as string) || "",
      attachProduct: formData.get("attachProduct") === "true",
      isActive: formData.get("isActive") === "true",
    };

    const parsed = EmailRouteSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, message: "Invalid form data.", errors: parsed.error.flatten().fieldErrors };
    }

    await (prisma as any).emailRoute.create({
      data: parsed.data,
    });

    revalidatePath("/internal-admin/settings");
    return { success: true, message: "Email route created successfully." };
  } catch (err: any) {
    console.error("createEmailRouteAction error:", err);
    return { success: false, message: err.message || "An error occurred while creating email route." };
  }
}

export async function updateEmailRouteAction(id: string, formData: FormData) {
  try {
    const raw = {
      name: (formData.get("name") as string) || "",
      triggerEvent: (formData.get("triggerEvent") as string) || "",
      subjectTemplate: (formData.get("subjectTemplate") as string) || "",
      toEmail: (formData.get("toEmail") as string) || "",
      bccEmail: (formData.get("bccEmail") as string) || "",
      htmlTemplate: (formData.get("htmlTemplate") as string) || "",
      attachProduct: formData.get("attachProduct") === "true",
      isActive: formData.get("isActive") === "true",
    };

    const parsed = EmailRouteSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, message: "Invalid form data.", errors: parsed.error.flatten().fieldErrors };
    }

    await (prisma as any).emailRoute.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/internal-admin/settings");
    return { success: true, message: "Email route updated successfully." };
  } catch (err: any) {
    console.error("updateEmailRouteAction error:", err);
    return { success: false, message: err.message || "An error occurred while updating email route." };
  }
}

export async function deleteEmailRouteAction(id: string) {
  try {
    await (prisma as any).emailRoute.delete({
      where: { id },
    });
    revalidatePath("/internal-admin/settings");
    return { success: true, message: "Email route deleted successfully." };
  } catch (err: any) {
    console.error("deleteEmailRouteAction error:", err);
    return { success: false, message: err.message || "Failed to delete email route." };
  }
}

export async function toggleEmailRouteStatusAction(id: string, isActive: boolean) {
  try {
    await (prisma as any).emailRoute.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/internal-admin/settings");
    return { success: true, message: "Email route status updated successfully." };
  } catch (err: any) {
    console.error("toggleEmailRouteStatusAction error:", err);
    return { success: false, message: err.message || "Failed to update status." };
  }
}
