// api.js
import axios from "axios";
import { BASE_URL, CUSTOMERS_URL, OFF_SITE_INVENTORY_URL, ORDERS_URL, REPLENISHMENT_URL, SKUINFO_URL } from "../constants";
import { Order } from "../components/orders/OrdersDashboardComponent";
import { SkuSales } from "../utils/dataTransformationsByClient";

export interface CustomerData {
    customerId: number;
    companyName: string;
    deactivated: boolean;
  }
export interface OrdersData {
dbData:{
  orders: Order[],
  regionShipped: any,
  customers:any,
  filterOptions: any,

}
  }
export interface OrdersByClientData {
dbData:{
  skusales: SkuSales[];


}
  }

 export interface SKUReplenishmentData {
    sku: string;
    clientId: string;
    clientName: string;
    flag?: boolean;
    threshold: string;
    qtyToReplenish?: number;
  }
  
 export interface SKUInfoData {
    sku: string;
    clientId: string;
    clientName: string;
    qtyPerPallet: string;
  }
  
//CUSTOMERS

export async function fetchCustomers() {
    try {
      console.log("FETCHING CUSTOMER DATA")
      const response = await axios.get(BASE_URL + CUSTOMERS_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching Customers data:",error);
      throw error;
    }
  }

 //INVENTORY
export async function fetchInventory(customerId: string | number | undefined) {
    try {
      console.log("FETCHING INVENTORY DATA")

      const response = await axios.get(BASE_URL + OFF_SITE_INVENTORY_URL + `?customerId=${customerId}` );
      return response.data;
    } catch (error) {
      console.error("Error fetching Inventory data:", error);
      throw error;
    }
  }


  //REPLENISHMENT

export async function fetchThreshold() {
    try {
      console.log("FETCHING REPLENISHMENT DATA")

      const response = await axios.get(BASE_URL + REPLENISHMENT_URL );
      return response.data;
    } catch (error) {
      console.error("Error fetching Threshold data:", error);
      throw error;
    }
  }



  export const updateSKUReplenishment = async (sku: string, threshold: string): Promise<void> => {
    try {
      const response = await axios.put(BASE_URL + REPLENISHMENT_URL + `/${sku}`, { threshold });
  
      if (response.status !== 200) {
        throw new Error('Failed to update SKU replenishment.');
      }
  
      console.log('SKU replenishment updated successfully.');
    } catch (error) {

      console.error('Error updating SKU replenishment:', error);
      throw error;
    }
  };
  export const deleteSKUReplenishment = async (sku: string): Promise<void> => {
    try {
      const response = await axios.delete(BASE_URL + REPLENISHMENT_URL + `/${sku}`);
  
      if (response.status !== 200) {
        throw new Error('Failed to delete SKU replenishment.');
      }
  
      console.log('SKU replenishment deleted successfully.');
    } catch (error) {

      console.error('Error deleting SKU replenishment:', error);
      throw error;
    }
  };
  
  export const addSKUReplenishment = async (data: SKUReplenishmentData): Promise<void> => {
    try {
      const response = await axios.post(BASE_URL + REPLENISHMENT_URL, data);
  
      if (response.status !== 201) {
        throw new Error('Failed to add SKU replenishment.');
      }
  
      console.log('SKU replenishment added successfully.');
    } catch (error) {
      console.error('Error adding SKU replenishment:', error);
      throw error;
    }
  };

  export async function fetchReplenishmentsByClientId(clientId: string) {
    try {
      console.log("FETCHING REPLENISHMENT DATA")

      const response = await axios.get(BASE_URL + REPLENISHMENT_URL + "/by-client-flagged/" + clientId);
      return response.data;
    } catch (error) {
      console.error("Error fetching Threshold data:", error);
      throw error;
    }
  }


  //SKU INFO

  export async function fetchAllSkuInfo() {
    try {
      console.log("FETCHING SKU INFO DATA")

      const response = await axios.get(BASE_URL + SKUINFO_URL );
      return response.data;
    } catch (error) {
      console.error("Error fetching QTY PER PALLET data:", error);
      throw error;
    }
  }

  export const updateSkuInfo = async (sku: string, qtyPerPallet: string): Promise<void> => {
    try {
      const response = await axios.put(BASE_URL + SKUINFO_URL + `/${sku}`, { qtyPerPallet });
  
      if (response.status !== 200) {
        throw new Error('Failed to update SKU info.');
      }
  
      console.log('SKU info updated successfully.');
    } catch (error) {

      console.error('Error updating SKU info:', error);
      throw error;
    }
  };
  
  export const addSkuInfo = async (data: SKUInfoData): Promise<void> => {
    try {
      const response = await axios.post(BASE_URL + SKUINFO_URL, data);
  
      if (response.status !== 201) {
        throw new Error('Failed to add SKU info.');
      }
  
      console.log('SKU info added successfully.');
    } catch (error) {
      console.error('Error adding SKU info:', error);
      throw error;
    }
  };

  export async function fetchSkuInfoByClientId(clientId: string) {
    try {
      console.log("FETCHING SKU Info DATA")

      const response = await axios.get(BASE_URL + SKUINFO_URL + "/by-client-flagged/" + clientId);
      return response.data;
    } catch (error) {
      console.error("Error fetching sku info data:", error);
      throw error;
    }
  }

  //ORDERS DATA

  export const fetchOrdersData = async () => {
    try {
      console.log("FETCHING ORDERS DATA")
      const response = await axios.get(BASE_URL + ORDERS_URL + "/last-six-months");
      return response.data;
    } catch (error) {
      console.error("Error fetching Orders data:",error);
      throw error;
    }
  }

  export const fetchOrdersByClientData = async (clientId: string) => {
    try {
      console.log("FETCHING ORDERS DATA FOR A CLIENxT", clientId)

      const response = await axios.get(BASE_URL + ORDERS_URL + "/last-six-months/ " + clientId);
      console.log("client responsedata",response.data)
      return response.data;
    } catch (error) {
      console.error("Error fetching Orders data:",error);
      throw error;
    }
  }

  export const fetchOrdersDataByRange = async (startDate: Date, endDate: Date) => {
    try {
      console.log("FETCHING ORDERS DATA BY RANGE");
      const response = await axios.get(`${BASE_URL}${ORDERS_URL}/date-range`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Orders data by range:", error);
      throw error;
    }
  };

  export const fetchOrdersByClientDataByRange = async (startDate: Date, endDate: Date, clientId:string) => {
    try {
      console.log("FETCHING ORDERS DATA BY RANGE FOR A CLIENT");
      const response = await axios.get(`${BASE_URL}${ORDERS_URL}/date-range/${clientId}`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Orders data by range:", error);
      throw error;
    }
  };