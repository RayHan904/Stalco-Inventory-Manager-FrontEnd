export const BASE_URL: string = 
process.env.NODE_ENV === "development"
  ? "http://localhost:8000"
  : "https://www.stalcobackend.online";
export const OFF_SITE_INVENTORY_URL: String = "/api/inventory";
export const CUSTOMERS_URL: string = "/api/customer";
export const REPLENISHMENT_URL: string = "/api/replenishment";
export const SKUINFO_URL: string = "/api/skuInfo";
