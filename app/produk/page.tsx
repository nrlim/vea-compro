import { Navbar } from "@/components/navbar";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ProductGrid } from "@/components/products/ProductGrid";

export const metadata = {
  title: "Katalog Produk — PT Vanguard Energy Amanah",
  description: "Katalog produk profesional PT Vanguard Energy Amanah. Menyediakan perangkat keras mutakhir dan sistem evaluasi energi andal.",
};

export default function ProdukPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <ProductGrid />
      </main>
      <WhatsAppButton />
    </>
  );
}
