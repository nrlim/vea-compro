"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Server,
  Lock,
  Eye,
  EyeOff,
  Send,
  Save,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  Mail,
  User,
  Globe,
  KeyRound,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upsertSmtpSettingsAction } from "@/app/actions/smtp-settings";

// ─── Zod (client-side mirror) ─────────────────────────────────────────────────

const formSchema = z.object({
  smtpHost: z
    .string()
    .min(1, "SMTP Host is required")
    .regex(/^[a-zA-Z0-9.-]+$/, "Invalid hostname — no spaces or special chars"),
  smtpPort: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "Port ≥ 1")
    .max(65535, "Port ≤ 65535"),
  smtpEncryption: z.enum(["None", "SSL", "TLS"] as const),
  smtpUser: z.string().min(1, "SMTP Username required"),
  smtpPass: z.string().optional(),
  fromName: z.string().min(1, "From Name required"),
  fromEmail: z.string().email("Must be a valid email"),
  testEmail: z.string().email("Must be a valid email").optional().or(z.literal("")),
  bccEmail: z.string().optional(),
  ignoreTls: z.boolean().default(false),
});

type FormValues = {
  smtpHost: string;
  smtpPort: number;
  smtpEncryption: "None" | "SSL" | "TLS";
  smtpUser: string;
  smtpPass?: string;
  fromName: string;
  fromEmail: string;
  testEmail?: string;
  bccEmail?: string;
  ignoreTls: boolean;
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface SmtpSettingsClientProps {
  initialSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpEncryption: string;
    smtpUser: string;
    fromName: string;
    fromEmail: string;
    lastTestStatus: string | null;
    lastTestMsg: string | null;
    lastTestedAt: Date | string | null;
    hasPassword: boolean;
    bccEmail?: string | null;
    ignoreTls?: boolean;
  } | null;
  userEmail?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SmtpSettingsClient({
  initialSettings,
  userEmail,
}: SmtpSettingsClientProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, startTesting] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [testResult, setTestResult] = useState<{
    status: "success" | "error" | null;
    message: string;
  }>({ status: null, message: "" });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isDirty },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      smtpHost: initialSettings?.smtpHost ?? "",
      smtpPort: initialSettings?.smtpPort ?? 587,
      smtpEncryption: (initialSettings?.smtpEncryption as "None" | "SSL" | "TLS") ?? "TLS",
      smtpUser: initialSettings?.smtpUser ?? "",
      smtpPass: "",
      fromName: initialSettings?.fromName ?? "PT VEA Notification",
      fromEmail: initialSettings?.fromEmail ?? "",
      testEmail: userEmail ?? "",
      bccEmail: initialSettings?.bccEmail ?? "",
      ignoreTls: initialSettings?.ignoreTls ?? false,
    },
  });

  const watchEncryption = watch("smtpEncryption");
  const watchHost = watch("smtpHost");
  const watchPort = watch("smtpPort");
  const watchIgnoreTls = watch("ignoreTls");

  // Auto-suggest port based on encryption selection
  const [autoPort, setAutoPort] = useState<number | null>(null);
  useEffect(() => {
    if (watchEncryption === "SSL") setAutoPort(465);
    else if (watchEncryption === "TLS") setAutoPort(587);
    else if (watchEncryption === "None") setAutoPort(25);
  }, [watchEncryption]);

  // ── Validate helper ─────────────────────────────────────────────────────────

  const validate = (data: FormValues): boolean => {
    const result = formSchema.safeParse(data);
    if (!result.success) {
      const issues = result.error.issues;
      issues.forEach((issue) => {
        const path = issue.path[0] as keyof FormValues;
        if (path) setError(path, { message: issue.message });
      });
      return false;
    }
    return true;
  };

  // ── Save ────────────────────────────────────────────────────────────────────

  const onSave = (data: FormValues) => {
    if (!validate(data)) return;
    startSaving(async () => {
      const fd = new FormData();
      fd.append("smtpHost", data.smtpHost);
      fd.append("smtpPort", String(data.smtpPort));
      fd.append("smtpEncryption", data.smtpEncryption);
      fd.append("smtpUser", data.smtpUser);
      if (data.smtpPass) fd.append("smtpPass", data.smtpPass);
      fd.append("fromName", data.fromName);
      fd.append("fromEmail", data.fromEmail);
      if (data.bccEmail) fd.append("bccEmail", data.bccEmail);
      if (data.ignoreTls) fd.append("ignoreTls", "on");

      const result = await upsertSmtpSettingsAction(fd);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  // ── Test Connection ──────────────────────────────────────────────────────────

  const onTest = (data: FormValues) => {
    if (!validate(data)) return;
    startTesting(async () => {
      setTestResult({ status: null, message: "" });
      try {
        const res = await fetch("/api/admin/smtp/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            ...data,
            testEmail: data.testEmail || userEmail 
          }),
        });
        const json = await res.json();
        if (json.success) {
          setTestResult({ status: "success", message: json.message });
          toast.success("SMTP connection verified & test email sent!");
        } else {
          setTestResult({ status: "error", message: json.error });
          toast.error(json.error || "SMTP test failed");
        }
      } catch (err: any) {
        setTestResult({ status: "error", message: err.message });
        toast.error("Network error during SMTP test");
      }
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full pb-20 space-y-6">
      {/* ── Header banner ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-navy via-navy/95 to-slate-800 shadow-lg p-6 md:p-8">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/20 shrink-0 backdrop-blur-sm">
            <Server className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              SMTP Gateway Configurator
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="h-2.5 w-2.5" /> SUPER ADMIN
              </span>
            </h2>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              Configure the outbound mail server for the PT VEA platform. Credentials are
              encrypted with <strong className="text-white">AES-256</strong> before storage — never plaintext.
            </p>
          </div>
        </div>

        {/* Last test status banner */}
        {initialSettings?.lastTestStatus && (
          <div
            className={`mt-5 flex items-start gap-3 p-3.5 rounded-xl border text-sm backdrop-blur-sm ${
              initialSettings.lastTestStatus === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            {initialSettings.lastTestStatus === "success" ? (
              <Wifi className="h-4 w-4 shrink-0 mt-0.5" />
            ) : (
              <WifiOff className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-semibold capitalize">{initialSettings.lastTestStatus === "success" ? "Connected" : "Connection Error"}</span>
              {initialSettings.lastTestMsg && (
                <p className="opacity-80 text-xs mt-0.5">{initialSettings.lastTestMsg}</p>
              )}
              {initialSettings.lastTestedAt && (
                <p className="opacity-60 text-[10px] mt-1 flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  Last tested: {new Date(initialSettings.lastTestedAt).toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Live Test Result ──────────────────────────────────────────────────── */}
      {testResult.status && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${
            testResult.status === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {testResult.status === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          )}
          <div>
            <p className="font-semibold">
              {testResult.status === "success" ? "Connection Successful" : "Connection Failed"}
            </p>
            <p className={`text-xs mt-0.5 ${testResult.status === "success" ? "text-emerald-700" : "text-red-700"}`}>
              {testResult.message}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        {/* ── Server Configuration Card ───────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-navy/8 rounded-lg border border-navy/10">
                <Globe className="h-4 w-4 text-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-navy text-sm">Server Configuration</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Outbound mail server endpoint and security settings</p>
              </div>
            </div>
            
            {/* Presets */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs bg-white text-navy hover:bg-slate-50 border-slate-200 shadow-sm"
                onClick={() => {
                  setValue("smtpHost", "127.0.0.1", { shouldDirty: true });
                  setValue("smtpPort", 587, { shouldDirty: true });
                  setValue("smtpEncryption", "TLS", { shouldDirty: true });
                  setValue("ignoreTls", true, { shouldDirty: true });
                }}
              >
                iRedMail Local
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs bg-white text-navy hover:bg-slate-50 border-slate-200 shadow-sm"
                onClick={() => {
                  setValue("smtpHost", "smtp-relay.brevo.com", { shouldDirty: true });
                  setValue("smtpPort", 587, { shouldDirty: true });
                  setValue("smtpEncryption", "TLS", { shouldDirty: true });
                  setValue("ignoreTls", false, { shouldDirty: true });
                }}
              >
                Brevo Direct
              </Button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Host */}
            <div className="md:col-span-6 space-y-2">
              <Label htmlFor="smtpHost" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                SMTP Host <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="smtpHost"
                  {...register("smtpHost")}
                  placeholder="mail.ptvea.com"
                  className="pl-9 bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all"
                />
              </div>
              {errors.smtpHost && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {errors.smtpHost.message}
                </p>
              )}
            </div>

            {/* Port */}
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="smtpPort" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                Port <span className="text-red-500">*</span>
              </Label>
              <select
                id="smtpPort"
                {...register("smtpPort")}
                className="w-full pl-3 pr-8 h-11 rounded-md border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/30 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="587">587 (STARTTLS/TLS)</option>
                <option value="465">465 (SSL)</option>
                <option value="25">25 (Unencrypted)</option>
                <option value={watch("smtpPort") as any}>
                  {![25, 465, 587].includes(Number(watch("smtpPort"))) && watch("smtpPort") ? `${watch("smtpPort")} (Custom)` : 'Custom...'}
                </option>
              </select>
              {autoPort && Number(watch("smtpPort")) !== autoPort && (
                <p className="text-[10px] text-amber-600 flex items-center gap-1">
                  <Info className="h-3 w-3" /> Suggested port for {watchEncryption}: <strong>{autoPort}</strong>
                </p>
              )}
              {errors.smtpPort && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {errors.smtpPort.message}
                </p>
              )}
            </div>

            {/* Encryption */}
            <div className="md:col-span-3 space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                Encryption <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                <select
                  {...register("smtpEncryption")}
                  className="w-full pl-9 pr-4 h-11 rounded-md border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/30 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="TLS">TLS (STARTTLS)</option>
                  <option value="SSL">SSL/TLS</option>
                  <option value="None">None (Unencrypted)</option>
                </select>
              </div>
              {watchEncryption === "None" && (
                <p className="text-[10px] text-red-500 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> Unencrypted — not recommended for production.
                </p>
              )}
            </div>

            {/* Ignore TLS */}
            <div className="md:col-span-12 flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="ignoreTls"
                  type="checkbox"
                  {...register("ignoreTls")}
                  className="w-4 h-4 rounded border-slate-300 text-navy focus:ring-navy focus:ring-2 cursor-pointer transition-all"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Label htmlFor="ignoreTls" className="text-sm font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5 w-fit">
                  Ignore TLS/SSL Certificate Errors
                </Label>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Aktifkan jika menggunakan <strong className="font-semibold text-slate-700">127.0.0.1</strong> atau server <strong className="font-semibold text-slate-700">iRedMail</strong> lokal untuk melewati error sertifikat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Authentication Card ────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-100">
              <KeyRound className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-navy text-sm">Authentication Credentials</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Password is encrypted with AES-256 before being stored in the database
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* username */}
            <div className="space-y-2">
              <Label htmlFor="smtpUser" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                SMTP Username <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="smtpUser"
                  {...register("smtpUser")}
                  placeholder="system@ptvea.com"
                  autoComplete="username"
                  className="pl-9 bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all"
                />
              </div>
              {errors.smtpUser && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {errors.smtpUser.message}
                </p>
              )}
            </div>

            {/* password */}
            <div className="space-y-2">
              <Label htmlFor="smtpPass" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                SMTP Password
                {initialSettings?.hasPassword && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold uppercase tracking-wider">
                    <Lock className="h-2 w-2" /> Encrypted
                  </span>
                )}
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="smtpPass"
                  type={showPassword ? "text" : "password"}
                  {...register("smtpPass")}
                  placeholder={
                    initialSettings?.hasPassword
                      ? "Leave blank to keep existing password"
                      : "Enter SMTP password"
                  }
                  autoComplete="new-password"
                  className="pl-9 pr-11 bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Lock className="h-2.5 w-2.5" />
                Stored using AES-256-CBC encryption — never saved in plaintext.
              </p>
            </div>
          </div>
        </div>

        {/* ── Sender Identity Card ───────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-navy text-sm">Sender Identity</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Defines the "From" header visible to recipients — must be authorized by SMTP user
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* from name */}
            <div className="space-y-2">
              <Label htmlFor="fromName" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                From Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fromName"
                {...register("fromName")}
                placeholder="PT VEA Notification"
                className="bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all"
              />
              {errors.fromName && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {errors.fromName.message}
                </p>
              )}
            </div>

            {/* from email */}
            <div className="space-y-2">
              <Label htmlFor="fromEmail" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                From Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="fromEmail"
                  type="email"
                  {...register("fromEmail")}
                  placeholder="noreply@ptvea.com"
                  className="pl-9 bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all"
                />
              </div>
              {errors.fromEmail && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {errors.fromEmail.message}
                </p>
              )}
              <p className="text-[10px] text-slate-400">Must match or be SPF-authorized for the SMTP user domain.</p>
            </div>

            {/* bcc email */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="bccEmail" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                BCC Monitoring Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="bccEmail"
                  {...register("bccEmail")}
                  placeholder="admin.monitor@ptvea.com"
                  className="pl-9 bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Alamat email monitoring internal. (Pisahkan dengan koma jika multple)
              </p>
            </div>
          </div>
        </div>

        {/* ── Test Connection Card ───────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-1.5 bg-purple-50 rounded-lg border border-purple-100">
              <Wifi className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-navy text-sm">Connection Test</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Verify the SMTP gateway is reachable before saving — send a diagnostic email
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              <Label htmlFor="testEmail" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Send Test Email To
              </Label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-1 relative w-full min-w-0">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="testEmail"
                    type="email"
                    {...register("testEmail")}
                    placeholder={userEmail || "admin@ptvea.com"}
                    className="pl-9 bg-slate-50/50 border-slate-200 h-11 focus:bg-white transition-all"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleSubmit(onTest)}
                  disabled={isTesting}
                  variant="outline"
                  className="h-11 px-6 border-slate-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all group shrink-0 font-semibold w-full sm:w-auto"
                >
                  {isTesting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                  )}
                  {isTesting ? "Testing..." : "Test Connection"}
                </Button>
              </div>

              {errors.testEmail && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {errors.testEmail.message}
                </p>
              )}
              <p className="text-[10px] text-slate-400">
                Test will use <strong>your current inputs above</strong> dynamically. No need to save first.
              </p>
            </div>
          </div>
        </div>

        {/* ── Security Note ──────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50">
          <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Security Notice</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              All changes to this module are recorded in the Audit Log with the actor's
              email, timestamp, and IP address. Only users with <strong>Admin</strong> or{" "}
              <strong>Super Admin</strong> roles can access this page.
            </p>
          </div>
        </div>

        {/* ── Action Bar ────────────────────────────────────────────────────── */}
        <div className="sticky bottom-0 z-20 -mx-px">
          <div className="flex items-center justify-between bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg px-5 py-3.5">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Info className="h-3.5 w-3.5" />
              {isDirty ? (
                <span className="text-amber-600 font-medium">You have unsaved changes</span>
              ) : (
                "All changes are automatically audit-logged"
              )}
            </div>
            <Button
              id="smtp-save-button"
              type="submit"
              disabled={isSaving}
              className="bg-navy hover:bg-navy/90 text-white px-6 h-10 font-semibold shadow-sm transition-all"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save SMTP Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
