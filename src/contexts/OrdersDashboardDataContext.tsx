import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {  addDays, startOfWeek, subDays, subMonths } from 'date-fns';
import useOrdersData from '../hooks/useOrdersData';
import useLoading from '../hooks/useLoading'
import { OrdersData } from '../services/api';
import { ByCarrierDynamicData, DynamicData, Order, Top10BarChartData, WHLvsClaysonData, WhiteLabelData, regionShipped } from '../components/orders/OrdersDashboardComponent';
import { filterOrders, filterRegionShipped, transformOrdersDataForOrderVolumeByCarrierPerDate, transformOrdersDataForOrderVolumeByCarrierPerWeek, transformOrdersDataForOrderVolumeByRegionPerDate, transformOrdersDataForOrderVolumeByRegionPerWeek, transformOrdersDataForTop10OrdersByCountry, transformOrdersDataForTop10OrdersByState, transformOrdersDataForTop10OrdersConfirmed, transformOrdersDataForWHLAndClayson, transformOrdersDataForWhiteLabel } from '../utils/dataTransformatinos';
import { useCustomers } from './CustomerContext';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface DataContextType {
  selectedCustomerNames: any[];
  setSelectedCustomerNames: React.Dispatch<React.SetStateAction<any[]>>;
  selectedRegions: string[];
  setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCountries: any[];
  setSelectedCountries: React.Dispatch<React.SetStateAction<any[]>>;
  selectedStates: any[];
  setSelectedStates: React.Dispatch<React.SetStateAction<any[]>>;
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  filteredOrdersData: any; 
  fetchOrdersDatawithRange: (startDate: Date, endDate: Date) => void; 
  isFilterdOrdersDataLoading: boolean;
  handleSelectCustomerNames: (selectedOptions: any) => void;
  handleSelectRegions: (region: string) => void;
  handleSelectCountries: (selectedOptions: any) => void;
  handleSelectStates: (selectedOptions: any) => void;
  handleCarrierToggle: (selectedOptions: boolean) => void;
  handleDailyToggle: (selectedOptions: boolean) => void;
  handleCountryToggle: (selectedOptions: boolean) => void;
  handleDateRangeChange: (ranges: { [key: string]: DateRange; }) => void;
  setApiCallToggle: () => void;
  handleApplyFilter: () => void;
  dynamicData:DynamicData | null | undefined;
  byCarrierDynamicData:ByCarrierDynamicData | null | undefined;
  ordersData: OrdersData | null;
  top10OrdersConfimredByCustomer: Top10BarChartData | null | undefined;
  countryShipped: Top10BarChartData | null | undefined;
  stateShipped: Top10BarChartData | null | undefined;
  WHLvsClaysonData: WHLvsClaysonData | null | undefined;
  WhiteLabelData: WhiteLabelData | null | undefined;
  isCarrier: boolean;
  isCountry: boolean;
  isDaily: boolean;
  displayCarriersInfo: boolean;
  isDisplayByCountry: boolean;
  isDisplayDaily: boolean;
  isOrdersDataLoading:  boolean;
}

const DataContext = createContext<DataContextType | null>(null);

interface DataProviderProps {
  children: ReactNode;
}

export const OrdersDashboardDataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const { ordersData, isOrdersDataLoading, fetchOrdersDatawithRange } = useOrdersData();
    const { isLoading: isFilterdOrdersDataLoading, startLoading: startFilterdOrdersDataLoading, stopLoading: stopFilterdOrdersDataLoading } = useLoading();
    const {customersData} = useCustomers();

    const yesterday = subDays(new Date(), 1);
    const now = new Date();
    const dayB4Yesterday = new Date(now);
    dayB4Yesterday.setDate(dayB4Yesterday.getDate() - 2);
    // const sixMonthsAgoFromYesterday = new Date(dayB4Yesterday);
    // sixMonthsAgoFromYesterday.setMonth(sixMonthsAgoFromYesterday.getMonth() - 6);
    

    const sixMonthsAgo = subMonths(yesterday, 6);
const startOfWeekAfterSixMonthsAgo = addDays(startOfWeek(sixMonthsAgo, { weekStartsOn: 1 }), 7); // Adding 7 days to get the start of the next week


const [apiCall, setApiCall] = useState<boolean>(false);
  const [filteredOrdersData, setFilterdOrdersData] = useState<Order[]>([]);
  const [filteredRegionShippedData, setfilteredRegionShippedData] = useState<regionShipped[]>([]);
  const [selectedCustomerNames, setSelectedCustomerNames] = useState<any[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['US', 'INTERNAL', 'CA', 'INTL']);
  const [selectedCountries, setSelectedCountries] = useState<any[]>([]);
  const [selectedStates, setSelectedStates] = useState<any[]>([]);
  const [isCarrier, setIsCarrier] = useState<boolean>(false);
  const [displayCarriersInfo, setDisplayCarriersInfo] = useState<boolean>(false);
  const [isCountry, setIsCountry] = useState<boolean>(false);
  const [isDisplayByCountry, setIsDisplayByCountry] = useState<boolean>(false);
  const [isDaily , setIsDaily] = useState<boolean>(false);
  const [isDisplayDaily, setIsDisplayDaily] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: startOfWeekAfterSixMonthsAgo,
    endDate: yesterday,
    key: 'selection',
  });
  const [dynamicData, setDynamicData] = useState<DynamicData | null>()
  const [byCarrierDynamicData, setByCarrierDynamicData] = useState<ByCarrierDynamicData | null>()
  const [top10OrdersConfimredByCustomer, setTop10OrdersConfimredByCustomer] = useState<Top10BarChartData | null>()
  const [WHLvsClaysonData, setWHLvsClaysonData] = useState<WHLvsClaysonData | null>()
  const [WhiteLabelData, setWhiteLabelData] = useState<WhiteLabelData | null>()
  const [countryShipped, setCountryShipped] = useState<Top10BarChartData | null>()
  const [stateShipped, setStateShipped] = useState<Top10BarChartData | null>()
  const [prevDateRange, setPrevDateRange] = useState<DateRange | null>({startDate: startOfWeekAfterSixMonthsAgo, endDate: new Date(now),  key: 'selection',});



  useEffect(() => {

    setDynamicData(!isOrdersDataLoading && ordersData ? transformOrdersDataForOrderVolumeByRegionPerWeek(ordersData.dbData.orders, dateRange) : null);
    setByCarrierDynamicData(!isOrdersDataLoading && ordersData ? transformOrdersDataForOrderVolumeByCarrierPerWeek(ordersData.dbData.orders, dateRange) : null);
    setTop10OrdersConfimredByCustomer(!isOrdersDataLoading && ordersData ? transformOrdersDataForTop10OrdersConfirmed(ordersData.dbData.orders,customersData ) : null);
    setWHLvsClaysonData(!isOrdersDataLoading && ordersData ? transformOrdersDataForWHLAndClayson(ordersData.dbData.orders) : null);
    setWhiteLabelData(!isOrdersDataLoading && ordersData ? transformOrdersDataForWhiteLabel(ordersData.dbData.orders) : null);
    setCountryShipped(!isOrdersDataLoading && ordersData ? transformOrdersDataForTop10OrdersByCountry(ordersData.dbData.regionShipped) : null);
    setStateShipped(!isOrdersDataLoading && ordersData ? transformOrdersDataForTop10OrdersByState(ordersData.dbData.regionShipped) : null);
}, [ordersData]);

useEffect(() => {
  fetchDataIfRequired(dateRange);

}, [apiCall, setApiCall])

const handleApplyFilter = async () => {
    startFilterdOrdersDataLoading();
    setDisplayCarriersInfo(isCarrier);
    setIsDisplayByCountry(isCountry);
    setIsDisplayDaily(isDaily);

    const filteredData : Order[] =  filterOrders({
        dateRange,
        selectedRegions,
        selectedCustomerNames
    }, ordersData?.dbData.orders, isCarrier)
    const filteredRegionData : regionShipped[] =  filterRegionShipped({
        dateRange,
        selectedRegions,
        selectedCustomerNames
    }, ordersData?.dbData.regionShipped)


    setFilterdOrdersData(filteredData);
    setfilteredRegionShippedData(filteredRegionData);
    console.log(filteredRegionShippedData);

   isDaily ?  setDynamicData( filteredData && transformOrdersDataForOrderVolumeByRegionPerDate(filteredData, dateRange)) : setDynamicData( filteredData && transformOrdersDataForOrderVolumeByRegionPerWeek(filteredData, dateRange))
   isDaily ? setByCarrierDynamicData( filteredData && transformOrdersDataForOrderVolumeByCarrierPerDate(filteredData, dateRange)) : setByCarrierDynamicData( filteredData && transformOrdersDataForOrderVolumeByCarrierPerWeek(filteredData, dateRange))
    setTop10OrdersConfimredByCustomer( filteredData && transformOrdersDataForTop10OrdersConfirmed(filteredData, customersData))
    setWHLvsClaysonData( filteredData && transformOrdersDataForWHLAndClayson(filteredData))
    setWhiteLabelData( filteredData && transformOrdersDataForWhiteLabel(filteredData))
    setCountryShipped( filteredRegionData && transformOrdersDataForTop10OrdersByCountry(filteredRegionData) )
    setStateShipped( filteredRegionData && transformOrdersDataForTop10OrdersByState(filteredRegionData) )

    stopFilterdOrdersDataLoading();
}

  const handleSelectCustomerNames = (selectedOptions: any) => {
    setSelectedCustomerNames(selectedOptions);
  };
  const handleCarrierToggle = (toggleValue: boolean) => {
    setIsCarrier(toggleValue);
  };
  const handleDailyToggle = (toggleValue: boolean) => {
    setIsDaily(toggleValue);
  };
  const handleCountryToggle = (toggleValue: boolean) => {
    setIsCountry(toggleValue);
  };

  const handleSelectRegions = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const handleSelectCountries = (selectedOptions: any) => {
    setSelectedCountries(selectedOptions);
  };

  const handleSelectStates = (selectedOptions: any) => {
    setSelectedStates(selectedOptions);
  };

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

    const isWithingPrevDateRange = (startDate: Date, endDate: Date): boolean => {
      if(prevDateRange) {
       return startDate >= prevDateRange?.startDate && endDate <= prevDateRange?.endDate;
      } 
     else return false;
   };
 
   const { startDate, endDate } = dr;

   console.log("DATE RANGE ISSSSSSS:", dateRange)
   
   if (!isWithingPrevDateRange(startDate, endDate)) {
    startFilterdOrdersDataLoading();

       await fetchOrdersDatawithRange(startDate, endDate)
       setPrevDateRange({startDate: startDate, endDate: endDate, key: 'selection',} )
       console.log("FROM INSIDE the function")
       stopFilterdOrdersDataLoading();
   }
  }

  const value: DataContextType = {
    selectedCustomerNames,
    setSelectedCustomerNames,
    selectedRegions,
    setSelectedRegions,
    selectedCountries,
    setSelectedCountries,
    selectedStates,
    setSelectedStates,
    dateRange,
    setDateRange,
    filteredOrdersData,
    isFilterdOrdersDataLoading,
    handleSelectCustomerNames,
    handleSelectRegions,
    handleSelectCountries,
    fetchOrdersDatawithRange,
    handleSelectStates,
    handleDateRangeChange,
    setApiCallToggle,
    handleApplyFilter,
    handleCarrierToggle,
    handleDailyToggle,
    handleCountryToggle,
    dynamicData, 
    byCarrierDynamicData, 
    top10OrdersConfimredByCustomer,
    countryShipped,
    stateShipped,
    WHLvsClaysonData,
    WhiteLabelData,
    ordersData, 
    isOrdersDataLoading,
    isCarrier,
    isCountry,
    isDaily,
    displayCarriersInfo,
    isDisplayDaily,
    isDisplayByCountry
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useOrdersDashboardData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useOrdersDashboardData must be used within a OrdersDashboardDataProvider');
  }
  return context;
};
