import { useState, useEffect } from 'react';
import useLoading from './useLoading';
import { OrdersData, fetchOrdersData, fetchOrdersDataByRange } from "../services/api";
import { toast } from 'react-toastify';



const useOrdersData = () => {
    const [ordersData, setOrdersData] = useState<OrdersData | null>(null);
    const { isLoading: isOrdersDataLoading, startLoading: startOrdersLoading, stopLoading: stopOrdersLoading } = useLoading();

    useEffect(() => {
        const fetchData = async () => {
            startOrdersLoading();
            try {
                const data: OrdersData = await fetchOrdersData();
                setOrdersData(data);
            } catch (error: any) {  // 'any' type can be replaced with a more specific error type if available
                console.error("Error fetching data:", error);
                toast.error("Unable to connect to API");
            } finally {
                stopOrdersLoading();
            }
        };

        fetchData();
    }, []);


    const fetchOrdersDatawithRange = async () => {
        startOrdersLoading();
        try {
            const data: OrdersData = await fetchOrdersDataByRange();
            setOrdersData(data);
        } catch (error: any) {  // 'any' type can be replaced with a more specific error type if available
            console.error("Error fetching data:", error);
            toast.error("Unable to connect to API");
        } finally {
            stopOrdersLoading();
        } }
    return { ordersData, isOrdersDataLoading, setOrdersData,fetchOrdersDatawithRange };
};

export default useOrdersData;
