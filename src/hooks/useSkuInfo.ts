import { useState } from 'react';
import useLoading from './useLoading';
import { SKUInfoData, fetchSkuInfoByClientId } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useSkuInfo = () => {
  const [skuInfoData, setSkuInfoData] = useState<SKUInfoData[] | null>(null);
  const { isLoading: isSkuInfoLoading, startLoading: startSkuInfoLoading, stopLoading: stopSkuInfoLoading } = useLoading();
  const navigate = useNavigate();

  const fetchLatestSkuInfo = async (clientId: string) => {
    startSkuInfoLoading();
    try {
      const data = await fetchSkuInfoByClientId(clientId);
      setSkuInfoData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch SKU information. Please try again.");
      navigate("/");
    } finally {
      stopSkuInfoLoading();
    }
  };

  return { skuInfoData, isSkuInfoLoading, setSkuInfoData, fetchLatestSkuInfo };
};

export default useSkuInfo;
