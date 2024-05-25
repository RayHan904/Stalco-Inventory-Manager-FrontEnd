// api.js
import axios from "axios";
import { BASE_URL, CUSTOMERS_URL, OFF_SITE_INVENTORY_URL, REPLENISHMENT_URL } from "../constants";

export interface CustomerData {
    customerId: number;
    companyName: string;
    deactivated: boolean;
  }

 export interface SKUReplenishmentData {
    sku: string;
    clientId: string;
    clientName: string;
    flag?: boolean;
    threshold: string;
    qtyToReplenish?: number;
  }
  


export async function fetchCustomers() {
    try {
      console.log("FETCHING CUSTOMER DATA")
      const response = await axios.get(BASE_URL + CUSTOMERS_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching Customers data:", error);
      throw error;
    }
  }
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
