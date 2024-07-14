import { useState  } from 'react';
import useLoading from './useLoading';
import { OrdersByClientData, fetchOrdersByClientData, fetchOrdersByClientDataByRange } from "../services/api";
import { toast } from 'react-toastify';



const useOrdersByClientData = () => {
    const [ordersByClientData, setOrdersByClientData] = useState<OrdersByClientData | null>(null);
    const { isLoading: isOrdersByClientDataLoading, startLoading: startOrdersByClientLoading, stopLoading: stopOrdersByClientLoading } = useLoading();

  
        const fetchOrdersByClient = async (clientId: string) => {
            startOrdersByClientLoading();
            try {
                if(clientId) {

                    const data: OrdersByClientData = await fetchOrdersByClientData(clientId);
                    setOrdersByClientData(data);

                }
                   
            } catch (error: any) {  // 'any' type can be replaced with a more specific error type if available
                console.error("Error fetching data:", error);
                toast.error("Unable to connect to API");
            } finally {
                stopOrdersByClientLoading();
            }
        };



    const fetchOrdersByClientDatawithRange = async (startDate: Date, endDate: Date, clientId: string) => {
        startOrdersByClientLoading();
        try {
            const data: OrdersByClientData = await fetchOrdersByClientDataByRange(startDate, endDate, clientId);
            setOrdersByClientData(data);
        } catch (error: any) {  // 'any' type can be replaced with a more specific error type if available
            console.error("Error fetching data:", error);
            toast.error("Unable to connect to API");
        } finally {
            stopOrdersByClientLoading();
        } }
    return { ordersByClientData, isOrdersByClientDataLoading, setOrdersByClientData,fetchOrdersByClientDatawithRange , fetchOrdersByClient};
};

export default useOrdersByClientData;
