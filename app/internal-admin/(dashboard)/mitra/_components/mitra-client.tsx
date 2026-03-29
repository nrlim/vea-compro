"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { createMitra, updateMitra, deleteMitra, reorderMitras, type Mitra } from "@/app/actions/mitra";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, ImagePlus, Search, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FormState {
  name: string;
  websiteUrl: string;
  isActive: boolean;
  file: File | null;
  logoUrl: string; // for preview
}

const emptyForm: FormState = {
  name: "",
  websiteUrl: "",
  isActive: true,
  file: null,
  logoUrl: "",
};

function SortableRow({ mitra, onEdit, onDelete }: { mitra: Mitra, onEdit: (m: Mitra) => void, onDelete: (m: Mitra) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: mitra.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: (isDragging ? "relative" : undefined) as any,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={`border-slate-200 hover:bg-slate-50 transition-colors bg-white ${isDragging ? 'opacity-50' : ''}`}>
      <TableCell className="w-10 px-2 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-slate-400" />
      </TableCell>
      <TableCell>
        {mitra.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mitra.logoUrl}
            alt={mitra.name}
            className="w-12 h-12 rounded-lg object-contain border border-slate-200 shadow-sm bg-slate-50"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
            <Loader2 className="h-4 w-4 text-slate-400" />
          </div>
        )}
      </TableCell>
      <TableCell className="font-semibold text-navy">{mitra.name}</TableCell>
      <TableCell className="text-slate-500 text-sm hidden sm:table-cell">{mitra.websiteUrl || "-"}</TableCell>
      <TableCell>
        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${mitra.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
          {mitra.isActive ? "Active" : "Inactive"}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1 relative z-10" onPointerDown={(e) => e.stopPropagation()}>
          <Button size="icon" variant="ghost" onClick={() => onEdit(mitra)} className="h-8 w-8 text-slate-400 hover:text-navy hover:bg-slate-100">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(mitra)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function MitraClient({ initialMitras }: { initialMitras: Mitra[] }) {
  const [mitras, setMitras] = useState<Mitra[]>(initialMitras);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMitra, setSelectedMitra] = useState<Mitra | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMitras(initialMitras.sort((a, b) => a.order - b.order));
  }, [initialMitras]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filtered = mitras.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setSelectedMitra(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(mitra: Mitra) {
    setSelectedMitra(mitra);
    setForm({
      name: mitra.name,
      websiteUrl: mitra.websiteUrl || "",
      isActive: mitra.isActive,
      file: null,
      logoUrl: mitra.logoUrl,
    });
    setDialogOpen(true);
  }

  function openDelete(mitra: Mitra) {
    setSelectedMitra(mitra);
    setDeleteDialogOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, file, logoUrl: URL.createObjectURL(file) });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setMitras((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order in DB
        const reordered = newItems.map((item, index) => ({ id: item.id, order: index }));
        startTransition(async () => {
          await reorderMitras(reordered);
          toast.success("Order updated successfully!");
        });
        
        return newItems.map((item, index) => ({ ...item, order: index }));
      });
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return toast.error("Name is required");
    if (!selectedMitra && !form.file) return toast.error("Logo is required");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("websiteUrl", form.websiteUrl);
      formData.append("isActive", String(form.isActive));
      if (form.file) formData.append("file", form.file);
      if (selectedMitra && form.logoUrl) formData.append("oldImageUrl", selectedMitra.logoUrl);

      const result = selectedMitra
        ? await updateMitra(selectedMitra.id, formData)
        : await createMitra(formData);

      if (result.error) {
        toast.error("Failed to save", { description: result.error });
      } else {
        toast.success(selectedMitra ? "Mitra updated!" : "Mitra created!");
        setDialogOpen(false);
      }
    });
  }

  function handleDelete() {
    if (!selectedMitra) return;
    startTransition(async () => {
      const result = await deleteMitra(selectedMitra.id);
      if (result.error) {
        toast.error("Delete failed", { description: result.error });
      } else {
        toast.success("Mitra deleted");
        setDeleteDialogOpen(false);
      }
    });
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input placeholder="Cari Mitra…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white border-slate-200" />
        </div>
        <Button onClick={openCreate} className="bg-navy hover:bg-navy-light text-white shadow-sm gap-2">
          <Plus className="h-4 w-4" /> Tambah Mitra
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 bg-slate-50/50">
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-20">Logo</TableHead>
                <TableHead>Nama Mitra</TableHead>
                <TableHead className="hidden sm:table-cell">Website</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="text-right w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-500">Tidak ada mitra ditemukan</TableCell></TableRow>
              ) : (
                <SortableContext items={filtered.map(m => m.id)} strategy={verticalListSortingStrategy}>
                  {filtered.map((mitra) => (
                    <SortableRow key={mitra.id} mitra={mitra} onEdit={openEdit} onDelete={openDelete} />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-slate-200 sm:max-w-xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-navy font-serif text-xl">{selectedMitra ? "Edit Mitra" : "Tambah Mitra"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-6">
              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer w-32 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${form.logoUrl ? "border-slate-200" : "border-slate-300 hover:border-gold hover:bg-slate-50"}`}
                >
                  {form.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.logoUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-center flex flex-col items-center">
                      <ImagePlus className="h-6 w-6 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-500 font-medium tracking-tight px-2">Upload Logo</span>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <p className="text-xs text-slate-400">Rasio 1:1, max 2MB (SVG, PNG, JPG)</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Nama Mitra <span className="text-red-500">*</span></Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label>URL Website</Label>
                  <Input value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} placeholder="https://" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-slate-300 text-navy focus:ring-navy h-4 w-4" />
                  <Label htmlFor="isActive" className="text-sm font-medium">Tampilkan di Landing Page</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isPending} className="bg-navy text-white hover:bg-navy-light">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-red-600">Hapus Mitra?</DialogTitle></DialogHeader>
          <p className="text-slate-600 text-sm">Anda yakin ingin menghapus {selectedMitra?.name}? Ini tidak dapat dibatalkan.</p>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
            <Button onClick={handleDelete} disabled={isPending} className="bg-red-600 text-white hover:bg-red-700">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
