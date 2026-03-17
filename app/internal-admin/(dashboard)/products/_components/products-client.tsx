"use client";

import { useState, useTransition, useRef } from "react";
import { createProduct, updateProduct, deleteProduct, uploadProductImage, type Product } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ImagePlus,
  Search,
  Package,
} from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Instruments", "Pipes & Fittings", "Valves", "Other"];

const CATEGORY_COLORS: Record<string, string> = {
  "Instruments": "bg-navy/5 text-navy border-navy/10",
  "Pipes & Fittings": "bg-amber-50 text-amber-600 border-amber-200",
  "Valves": "bg-indigo-50 text-indigo-600 border-indigo-200",
  "Other": "bg-slate-100 text-slate-600 border-slate-200",
};

interface FormState {
  name: string;
  category: string;
  description: string;
  imageUrl: string;
}

const emptyForm: FormState = {
  name: "",
  category: "",
  description: "",
  imageUrl: "",
};

interface ProductsClientProps {
  initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setSelectedProduct(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl ?? "",
    });
    setDialogOpen(true);
  }

  function openDelete(product: Product) {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const { url, error } = await uploadProductImage(formData);
      
      if (error || !url) throw new Error(error || "Upload failed");

      setForm((f) => ({ ...f, imageUrl: url }));
      toast.success("Image uploaded successfully");
    } catch (err: unknown) {
      toast.error("Upload failed", { description: String(err) });
    } finally {
      setIsUploading(false);
    }
  }

  function handleSave() {
    startTransition(async () => {
      const result = selectedProduct
        ? await updateProduct(selectedProduct.id, form)
        : await createProduct(form);

      if (result.error) {
        toast.error("Failed to save product", { description: result.error });
        return;
      }

      toast.success(
        selectedProduct ? "Product updated!" : "Product created!",
        { description: form.name }
      );
      setDialogOpen(false);

      // Optimistic update
      if (selectedProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === selectedProduct.id
              ? { ...p, ...form, updatedAt: new Date() }
              : p
          )
        );
      } else {
        // Just add a temporary entry — revalidation will sync
        const newProduct: Product = {
          id: Date.now().toString(),
          ...form,
          imageUrl: form.imageUrl || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setProducts((prev) => [newProduct, ...prev]);
      }
    });
  }

  function handleDelete() {
    if (!selectedProduct) return;
    startTransition(async () => {
      const result = await deleteProduct(selectedProduct.id);
      if (result.error) {
        toast.error("Delete failed", { description: result.error });
        return;
      }
      toast.success("Product deleted", { description: selectedProduct.name });
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setDeleteDialogOpen(false);
    });
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="product-search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-200 text-navy placeholder:text-slate-400 focus-visible:ring-gold"
          />
        </div>
        <Button
          id="add-product-btn"
          onClick={openCreate}
          className="bg-navy hover:bg-navy-light text-white shadow-sm gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="text-slate-500 font-semibold w-14">Image</TableHead>
              <TableHead className="text-slate-500 font-semibold">Name</TableHead>
              <TableHead className="text-slate-500 font-semibold">Category</TableHead>
              <TableHead className="text-slate-500 font-semibold hidden md:table-cell">Description</TableHead>
              <TableHead className="text-slate-500 font-semibold text-right w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 border-slate-200">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Package className="h-10 w-10 opacity-30" />
                    <p className="text-sm">No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow
                  key={product.id}
                  className="border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <TableCell>
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <Package className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-navy">{product.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                        CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS["Other"]
                      }`}
                    >
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm hidden md:table-cell max-w-xs">
                    <span className="line-clamp-1">{product.description}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(product)}
                        className="h-8 w-8 text-slate-400 hover:text-navy hover:bg-slate-100"
                        id={`edit-product-${product.id}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openDelete(product)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        id={`delete-product-${product.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Count */}
      <p className="text-xs text-slate-500">
        Showing {filtered.length} of {products.length} products
      </p>

      {/* ── Create / Edit Dialog ─────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-slate-200 text-foreground w-[95vw] sm:max-w-4xl p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-navy font-serif text-xl border-none">
              {selectedProduct ? "Edit Product Details" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 px-8 py-8">
            {/* Image upload */}
            <div className="flex flex-col gap-3">
              <Label className="text-slate-700 font-semibold text-sm">Product Image</Label>
              <div
                onClick={() => !isUploading && fileInputRef.current?.click()} 
                className={`relative group flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                  form.imageUrl ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-gold/50"
                } ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {form.imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-navy/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium bg-navy/80 px-2 py-1 rounded shadow-sm">Change Image</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-navy/50 group-hover:text-gold transition-colors">
                      <ImagePlus className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 group-hover:text-navy transition-colors">
                      Upload to Drive
                    </p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                id="product-image-upload"
              />
              
              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-navy bg-navy/5 py-1.5 rounded-md">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Uploading securely...
                </div>
              )}
            </div>

            {/* Right Side Fields */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="product-name" className="text-slate-700 font-semibold text-sm">Product Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="product-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Fisher Control Valve"
                    className="bg-white border-slate-200 text-navy placeholder:text-slate-400 focus-visible:ring-gold !h-11 px-3.5 py-2.5 transition-shadow rounded-lg shadow-sm text-sm"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <Label htmlFor="product-category" className="text-slate-700 font-semibold text-sm">Category <span className="text-red-500">*</span></Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                  >
                    <SelectTrigger
                      id="product-category"
                      className="bg-white border-slate-200 text-navy data-[placeholder]:text-slate-400 focus-visible:ring-gold !h-11 px-3.5 py-2.5 transition-shadow w-full rounded-lg shadow-sm text-sm"
                    >
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={6} className="bg-white border-slate-200 shadow-xl rounded-xl w-[var(--radix-select-trigger-width)] p-1.5">
                      {CATEGORIES.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="text-slate-600 focus:bg-slate-50 focus:text-navy cursor-pointer py-2.5 pl-3 pr-8 rounded-lg mb-0.5 last:mb-0 transition-colors font-medium text-sm"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 flex-1 flex flex-col">
                <Label htmlFor="product-desc" className="text-slate-700 font-semibold text-sm">Description</Label>
                <Textarea
                  id="product-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Enter detailed specifications and product information meant for the public..."
                  rows={6}
                  className="bg-white border-slate-200 text-navy placeholder:text-slate-400 focus-visible:ring-gold resize-none flex-1 transition-shadow w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="m-0 px-8 py-6 border-t border-slate-100 bg-slate-50/50 gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-slate-500 hover:text-navy hover:bg-slate-200/50"
              id="cancel-product-dialog"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending || !form.name || !form.category}
              className="bg-navy hover:bg-navy-light text-white shadow-sm px-6"
              id="save-product-btn"
            >
              {isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</>
              ) : (
                selectedProduct ? "Save Changes" : "Create Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ─────────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border-slate-200 text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-700 font-serif">Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600 text-sm">
            Are you sure you want to delete{" "}
            <span className="text-navy font-semibold">{selectedProduct?.name}</span>?
            This action cannot be undone.
          </p>
          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-slate-500 hover:text-navy hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
              id="confirm-delete-product"
            >
              {isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting…</>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
