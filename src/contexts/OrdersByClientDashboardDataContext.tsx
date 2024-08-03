import React, { createContext, useContext,  ReactNode, useState, useEffect, Dispatch, SetStateAction } from 'react';
// import {  addDays, startOfWeek, subDays, subMonths } from 'date-fns';
import useOrdersByClientData
 from '../hooks/useOrdersByClientData'
import { useLoading } from './LoadingContext';
import { Top10BarChartData } from '../components/orders/OrdersDashboardComponent';
import { Summary, createSummary, transformOrdersDataForTop10SkusOrdered,transformUnitsDataForTop10SkusOrdered } from '../utils/dataTransformationsByClient';
import { addDays, startOfWeek, subDays, subMonths } from 'date-fns';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface DataContextType {
//   setSelectedCustomerNames: React.Dispatch<React.SetStateAction<any[]>>;
ordersByClientData: any | null;
fetchOrdersByClient: (clientId: string) => any;
top10OrdersConfimredBySku: Top10BarChartData | null |undefined;
top10UnitsConfimredBySku: Top10BarChartData | null |undefined;
summary: Summary | null |undefined;
isOrdersByClientDataLoading: boolean;
dateRange: DateRange;
handleDateRangeChange: (ranges: { [key: string]: DateRange; }) => void;
setApiCallToggle: () => void;
setClientId:  Dispatch<SetStateAction<string | null | undefined>>;
isFilterdOrdersDataLoading: boolean;

}

const DataContext = createContext<DataContextType | null>(null);

interface DataProviderProps {
  children: ReactNode;
}

export const OrdersByClientDashboardDataProvider: React.FC<DataProviderProps> = ({ children }) => {
   const { fetchOrdersByClient, ordersByClientData, isOrdersByClientDataLoading, fetchOrdersByClientDatawithRange } = useOrdersByClientData();
   const { isLoading: isFilterdOrdersDataLoading, startLoading: startFilterdOrdersDataLoading, stopLoading: stopFilterdOrdersDataLoading } = useLoading();
const yesterday = subDays(new Date(), 1);
const now = new Date();
const dayB4Yesterday = new Date(now);
dayB4Yesterday.setDate(dayB4Yesterday.getDate() - 2);

const sixMonthsAgo = subMonths(yesterday, 6);
const startOfWeekAfterSixMonthsAgo = addDays(startOfWeek(sixMonthsAgo, { weekStartsOn: 1 }), 7); // Adding 7 days to get the start of the next week


 const [clientId, setClientId] = useState<string | null>();
   const [top10OrdersConfimredBySku, setTop10OrdersConfimredBySku] = useState<Top10BarChartData | null>()
   const [top10UnitsConfimredBySku, setTop10UnitsConfimredBySku] = useState<Top10BarChartData | null>()
   const [summary, setSummary] = useState<Summary | null>()
   const [dateRange, setDateRange] = useState<DateRange>({
    startDate: startOfWeekAfterSixMonthsAgo,
    endDate: yesterday,
    key: 'selection',
  });

const [apiCall, setApiCall] = useState<boolean>(false);
  const [prevDateRange, setPrevDateRange] = useState<DateRange | null>({startDate: startOfWeekAfterSixMonthsAgo, endDate: new Date(now),  key: 'selection',});


    useEffect(() => {
if(ordersByClientData) {
    setTop10OrdersConfimredBySku(transformOrdersDataForTop10SkusOrdered(ordersByClientData.dbData.skusales));
    setTop10UnitsConfimredBySku(transformUnitsDataForTop10SkusOrdered(ordersByClientData.dbData.skusales));
    setSummary(createSummary(ordersByClientData.dbData.skusales))
}
    }, [ordersByClientData])

useEffect(() => {
  fetchDataIfRequired(dateRange);

}, [apiCall, setApiCall])
useEffect(() => {
  const fetchData = async () => {
    startFilterdOrdersDataLoading()
    await clientId && clientId != undefined && fetchOrdersByClient(clientId);
stopFilterdOrdersDataLoading();
  } 
  fetchData();

}, [clientId])

  const handleDateRangeChange = async (ranges: { [key: string]: DateRange }) => {
    const newSelection = ranges.selection;
    if (newSelection && newSelection.startDate && newSelection.endDate) {
      setDateRange({
        startDate: newSelection.startDate,
        endDate: newSelection.endDate,
        key: 'selection'
      });
    }
  };

  const setApiCallToggle = () =>  {
    setApiCall(!apiCall)
  }

  const fetchDataIfRequired = async (dr : DateRange) => {

   const { startDate, endDate } = dr;

    startFilterdOrdersDataLoading();

       await clientId && clientId != undefined && fetchOrdersByClientDatawithRange(startDate, endDate, clientId)
       setPrevDateRange({startDate: startDate, endDate: endDate, key: 'selection',} )
       stopFilterdOrdersDataLoading();
   
  }

  const value: DataContextType = {
    isFilterdOrdersDataLoading,
    ordersByClientData,
    fetchOrdersByClient,
    top10OrdersConfimredBySku,
    top10UnitsConfimredBySku,
    isOrdersByClientDataLoading,
    summary,
    dateRange,
    handleDateRangeChange,
    setApiCallToggle,
    setClientId,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useOrdersByClientDashboardData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useOrdersByClientDashboardData must be used within a OrdersByClientDashboardDataProvider');
  }
  return context;
};
