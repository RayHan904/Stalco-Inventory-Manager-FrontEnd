export const BASE_URL: string = 
process.env.NODE_ENV === "development"
  ? "http://localhost:8000"
  : "https://www.stalcobackend.online";
export const OFF_SITE_INVENTORY_URL: String = "/api/inventory";
export const CUSTOMERS_URL: string = "/api/customer";
export const REPLENISHMENT_URL: string = "/api/replenishment";
export const SKUINFO_URL: string = "/api/skuInfo";
export const ORDERS_URL: string = "/api/orders";




// WHL clients
export const WHLClients = [
  { name: "Ausica UAB (306238207)", id: 1405 },
  { name: "Charmed Aroma Inc", id: 1270 },
  { name: "Furme (Argos Enterprises LLC)", id: 1398 },
  { name: "Kicking Horse Coffee Co. Ltd", id: 1342 },
  { name: "Petlab Group Limited", id: 1376 },
  { name: "Soylent Nutrition Inc", id: 1302 }
];
// White label clients
export const WhiteLabelClients = [
  { name: "1000057862 Ontario Inc", id: 1384 },
  { name: "1000777135 Ontario Inc", id: 1402 },
  { name: "Green Digital Inc", id: 1394 },
  { name: "15234085 Canada Inc", id: 1399 },
  { name: "1000476461 Ontario Inc", id: 1395 }
];


export const WHLClientIds = WHLClients.map(client => client.id);
export const WhiteLabelClientIds = WhiteLabelClients.map(client => client.id);