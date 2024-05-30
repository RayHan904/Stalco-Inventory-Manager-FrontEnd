import { useState, useEffect } from 'react';
import useLoading from './useLoading';
import { CustomerData, fetchCustomers } from "../services/api";
import { toast } from 'react-toastify';



const useCustomersData = () => {
    const [customersData, setCustomersData] = useState<CustomerData[] | null>(null);
    const { isLoading: isCustomersLoading, startLoading: startCustomersLoading, stopLoading: stopCustomersLoading } = useLoading();

    useEffect(() => {
        const fetchData = async () => {
            startCustomersLoading();
            try {
                const data: CustomerData[] = await fetchCustomers();
                setCustomersData(data);
            } catch (error: any) {  // 'any' type can be replaced with a more specific error type if available
                console.error("Error fetching data:", error);
                toast.error("Unable to connect to API");
            } finally {
                stopCustomersLoading();
            }
        };

        fetchData();
    }, []);

    return { customersData, isCustomersLoading, setCustomersData };
};

export default useCustomersData;
