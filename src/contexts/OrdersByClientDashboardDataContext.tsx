import React, { createContext, useContext,  ReactNode, useState, useEffect } from 'react';
// import {  addDays, startOfWeek, subDays, subMonths } from 'date-fns';
import useOrdersByClientData
 from '../hooks/useOrdersByClientData'
import { useLoading } from './LoadingContext';
import { Top10BarChartData } from '../components/orders/OrdersDashboardComponent';
import { Summary, createSummary, transformOrdersDataForTop10SkusOrdered } from '../utils/dataTransformationsByClient';

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
summary: Summary | null |undefined;
isOrdersByClientDataLoading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

interface DataProviderProps {
  children: ReactNode;
}

export const OrdersByClientDashboardDataProvider: React.FC<DataProviderProps> = ({ children }) => {
   const { fetchOrdersByClient, ordersByClientData, isOrdersByClientDataLoading } = useOrdersByClientData();
//    const { isLoading: isFilterdOrdersDataLoading, startLoading: startFilterdOrdersDataLoading, stopLoading: stopFilterdOrdersDataLoading } = useLoading();
   const [top10OrdersConfimredBySku, setTop10OrdersConfimredBySku] = useState<Top10BarChartData | null>()
   const [summary, setSummary] = useState<Summary | null>()
   console.log("TOP !) SKUS:" , top10OrdersConfimredBySku)


    // const { isLoading: isFilterdOrdersDataLoading, startLoading: startFilterdOrdersDataLoading, stopLoading: stopFilterdOrdersDataLoading } = useLoading();
    // const {customersData} = useCustomers();

    // const yesterday = subDays(new Date(), 1);
    // const now = new Date();
    // const dayB4Yesterday = new Date(now);
    // dayB4Yesterday.setDate(dayB4Yesterday.getDate() - 2);
    // const sixMonthsAgoFromYesterday = new Date(dayB4Yesterday);
    // sixMonthsAgoFromYesterday.setMonth(sixMonthsAgoFromYesterday.getMonth() - 6);
    

//     const sixMonthsAgo = subMonths(yesterday, 6);
// const startOfWeekAfterSixMonthsAgo = addDays(startOfWeek(sixMonthsAgo, { weekStartsOn: 1 }), 7); // Adding 7 days to get the start of the next week


// const [apiCall, setApiCall] = useState<boolean>(false);
//   const [filteredOrdersData, setFilterdOrdersData] = useState<Order[]>([]);
//   const [selectedCustomerNames, setSelectedCustomerNames] = useState<any[]>([]);
//   const [isDaily , setIsDaily] = useState<boolean>(false);
//   const [isDisplayDaily, setIsDisplayDaily] = useState<boolean>(false);
//   const [dateRange, setDateRange] = useState<DateRange>({
//     startDate: startOfWeekAfterSixMonthsAgo,
//     endDate: yesterday,
//     key: 'selection',
//   });
//   const [dynamicData, setDynamicData] = useState<DynamicData | null>()

//   const [prevDateRange, setPrevDateRange] = useState<DateRange | null>({startDate: startOfWeekAfterSixMonthsAgo, endDate: new Date(now),  key: 'selection',});


    useEffect(() => {
if(ordersByClientData) {

    setTop10OrdersConfimredBySku(transformOrdersDataForTop10SkusOrdered(ordersByClientData.dbData.skusales));
    setSummary(createSummary(ordersByClientData.dbData.skusales))
}
    }, [ordersByClientData])

//   useEffect(() => {

//     setDynamicData(!isOrdersDataLoading && ordersData ? transformOrdersDataForOrderVolumeByRegionPerWeek(ordersData.dbData.orders, dateRange) : null);
//     setByCarrierDynamicData(!isOrdersDataLoading && ordersData ? transformOrdersDataForOrderVolumeByCarrierPerWeek(ordersData.dbData.orders, dateRange) : null);
//     setTop10OrdersConfimredByCustomer(!isOrdersDataLoading && ordersData ? transformOrdersDataForTop10OrdersConfirmed(ordersData.dbData.orders,customersData ) : null);

// }, [ordersData]);

// useEffect(() => {
//   fetchDataIfRequired(dateRange);

// }, [apiCall, setApiCall])

// const handleApplyFilter = async () => {
//     startFilterdOrdersDataLoading();
//     setIsDisplayDaily(isDaily);

//     const filteredData : Order[] =  filterOrders({
//         dateRange,
//         selectedRegions,
//         selectedCustomerNames
//     }, ordersData?.dbData.orders, isCarrier)
  

//     setFilterdOrdersData(filteredData);
//     console.log(filteredRegionShippedData);

//    isDaily ?  setDynamicData( filteredData && transformOrdersDataForOrderVolumeByRegionPerDate(filteredData, dateRange)) : setDynamicData( filteredData && transformOrdersDataForOrderVolumeByRegionPerWeek(filteredData, dateRange))
//    isDaily ? setByCarrierDynamicData( filteredData && transformOrdersDataForOrderVolumeByCarrierPerDate(filteredData, dateRange)) : setByCarrierDynamicData( filteredData && transformOrdersDataForOrderVolumeByCarrierPerWeek(filteredData, dateRange))
//     setTop10OrdersConfimredByCustomer( filteredData && transformOrdersDataForTop10OrdersConfirmed(filteredData, customersData))
//     stopFilterdOrdersDataLoading();
//     console.log("DATE range current:", prevDateRange)
// }



//   const handleDailyToggle = (toggleValue: boolean) => {
//     setIsDaily(toggleValue);
//   };

//   const handleDateRangeChange = async (ranges: { [key: string]: DateRange }) => {
   
//     const newSelection = ranges.selection;
//     if (newSelection && newSelection.startDate && newSelection.endDate) {
//       setDateRange({
//         startDate: newSelection.startDate,
//         endDate: newSelection.endDate,
//         key: 'selection'
//       });
//     }
//   };

//   const setApiCallToggle = () =>  {
//     setApiCall(!apiCall)
//   }

//   const fetchDataIfRequired = async (dr : DateRange) => {

//     console.log("I am being called")
//     const isWithingPrevDateRange = (startDate: Date, endDate: Date): boolean => {
//       if(prevDateRange) {
//        return startDate >= prevDateRange?.startDate && endDate <= prevDateRange?.endDate;
//       } 
//      else return false;
//    };
 
//    const { startDate, endDate } = dr;

//    console.log("DATE RANGE ISSSSSSS:", dateRange)
   
//    if (!isWithingPrevDateRange(startDate, endDate)) {
//     startFilterdOrdersDataLoading();

//        await fetchOrdersDatawithRange(startDate, endDate)
//        setPrevDateRange({startDate: startDate, endDate: endDate, key: 'selection',} )
//        console.log("FROM INSIDE the function")
//        stopFilterdOrdersDataLoading();
//    }
//   }

  const value: DataContextType = {
    // selectedCustomerNames,
    // setSelectedCustomerNames,
    ordersByClientData,
    fetchOrdersByClient,
    top10OrdersConfimredBySku,
    isOrdersByClientDataLoading,
    summary
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
