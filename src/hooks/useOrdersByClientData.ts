import { useState  } from 'react';
import useLoading from './useLoading';
import { OrdersByClientData, TotalOrderByClientData, fetchOrdersByClientData, fetchOrdersByClientDataByRange, fetchTotalOrdersByClientDataByRange } from "../services/api";
import { toast } from 'react-toastify';
import { addDays, startOfWeek, subDays, subMonths } from 'date-fns';


const endDate = new Date();
// const startDate = new Date();
const yesterday = subDays(new Date(), 1);
const sixMonthsAgo = subMonths(yesterday, 6);
const startOfWeekAfterSixMonthsAgo = addDays(startOfWeek(sixMonthsAgo, { weekStartsOn: 1 }), 7);

const useOrdersByClientData = () => {
    const [ordersByClientData, setOrdersByClientData] = useState<OrdersByClientData | null>(null);
    const [totalOrdersData, setTotalOrdersData] = useState<TotalOrderByClientData | null>(null);
    const { isLoading: isOrdersByClientDataLoading, startLoading: startOrdersByClientLoading, stopLoading: stopOrdersByClientLoading } = useLoading();

  
        const fetchOrdersByClient = async (clientId: string) => {
            startOrdersByClientLoading();
            try {
                if(clientId) {

                    const totalOrdersData: TotalOrderByClientData = await fetchTotalOrdersByClientDataByRange(startOfWeekAfterSixMonthsAgo, endDate, clientId);
                    const data: OrdersByClientData = await fetchOrdersByClientData(clientId);
                    setOrdersByClientData(data);
                    setTotalOrdersData(totalOrdersData);
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

    const fetchTotalOrdersByClientDataWithRange = async (startDate: Date, endDate: Date, clientId: string) => {
        startOrdersByClientLoading();
        try {
            const data: TotalOrderByClientData = await fetchTotalOrdersByClientDataByRange(startDate, endDate, clientId);
            setTotalOrdersData(data);
        } catch (error: any) {  // 'any' type can be replaced with a more specific error type if available
            console.error("Error fetching data:", error);
            toast.error("Unable to connect to API");
        } finally {
            stopOrdersByClientLoading();
        } }
    return { ordersByClientData, isOrdersByClientDataLoading, setOrdersByClientData,fetchOrdersByClientDatawithRange , fetchOrdersByClient, fetchTotalOrdersByClientDataWithRange, totalOrdersData};
};

export default useOrdersByClientData;
