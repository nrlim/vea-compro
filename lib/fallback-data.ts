import fallbackJson from "./fallback-data.json";

export interface FallbackSettings {
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  phone: string;
  telephone: string;
  address: string;
  siteUrl: string;
}

export interface FallbackBrand {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl: string;
  order: number;
  isActive: boolean;
}

export interface FallbackMitra {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  order: number;
  isActive: boolean;
}

export interface FallbackProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  images: string[];
  manualUrl: string | null;
  datasheetUrl: string | null;
  summary: string;
  description: string;
  price: number;
}

export const FALLBACK_DATA = {
  settings: fallbackJson.settings as FallbackSettings,
  brands: fallbackJson.brands as FallbackBrand[],
  mitras: fallbackJson.mitras as FallbackMitra[],
  products: fallbackJson.products as FallbackProduct[],
};
