import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { addDays } from 'date-fns';
import useOrdersData from '../hooks/useOrdersData';
import useLoading from '../hooks/useLoading'
import { OrdersData } from '../services/api';
import { DynamicData, Order, Top10BarChartData, WHLvsClaysonData, WhiteLabelData, regionShipped } from '../components/orders/OrdersDashboardComponent';
import { filterOrders, filterRegionShipped, transformOrdersDataForOrderVolumeByRegionPerDate, transformOrdersDataForTop10OrdersByCountry, transformOrdersDataForTop10OrdersByState, transformOrdersDataForTop10OrdersConfirmed, transformOrdersDataForWHLAndClayson, transformOrdersDataForWhiteLabel } from '../utils/dataTransformatinos';
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
  fetchOrdersDatawithRange: () => void; 
  isFilterdOrdersDataLoading: boolean;
  handleSelectCustomerNames: (selectedOptions: any) => void;
  handleSelectRegions: (region: string) => void;
  handleSelectCountries: (selectedOptions: any) => void;
  handleSelectStates: (selectedOptions: any) => void;
  handleDateRangeChange: (ranges: { [key: string]: DateRange; }) => void;
  handleApplyFilter: () => void;
  dynamicData:DynamicData | null | undefined;
  ordersData: OrdersData | null;
  top10OrdersConfimredByCustomer: Top10BarChartData | null | undefined;
  countryShipped: Top10BarChartData | null | undefined;
  stateShipped: Top10BarChartData | null | undefined;
  WHLvsClaysonData: WHLvsClaysonData | null | undefined;
  WhiteLabelData: WhiteLabelData | null | undefined;
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


  const [filteredOrdersData, setFilterdOrdersData] = useState<Order[]>([]);
  const [filteredRegionShippedData, setfilteredRegionShippedData] = useState<regionShipped[]>([]);
  const [selectedCustomerNames, setSelectedCustomerNames] = useState<any[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['US', 'INTERNAL', 'CA', 'INTL']);
  const [selectedCountries, setSelectedCountries] = useState<any[]>([]);
  const [selectedStates, setSelectedStates] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>(
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  );
  const [dynamicData, setDynamicData] = useState<DynamicData | null>()
  const [top10OrdersConfimredByCustomer, setTop10OrdersConfimredByCustomer] = useState<Top10BarChartData | null>()
  const [WHLvsClaysonData, setWHLvsClaysonData] = useState<WHLvsClaysonData | null>()
  const [WhiteLabelData, setWhiteLabelData] = useState<WhiteLabelData | null>()
  const [countryShipped, setCountryShipped] = useState<Top10BarChartData | null>()
  const [stateShipped, setStateShipped] = useState<Top10BarChartData | null>()



  useEffect(() => {

    setDynamicData(!isOrdersDataLoading && ordersData ? transformOrdersDataForOrderVolumeByRegionPerDate(ordersData.dbData.orders) : null);
    setTop10OrdersConfimredByCustomer(!isOrdersDataLoading && ordersData ? transformOrdersDataForTop10OrdersConfirmed(ordersData.dbData.orders,customersData ) : null);
    setWHLvsClaysonData(!isOrdersDataLoading && ordersData ? transformOrdersDataForWHLAndClayson(ordersData.dbData.orders) : null);
    setWhiteLabelData(!isOrdersDataLoading && ordersData ? transformOrdersDataForWhiteLabel(ordersData.dbData.orders) : null);
    setCountryShipped(!isOrdersDataLoading && ordersData ? transformOrdersDataForTop10OrdersByCountry(ordersData.dbData.regionShipped) : null);
    setStateShipped(!isOrdersDataLoading && ordersData ? transformOrdersDataForTop10OrdersByState(ordersData.dbData.regionShipped) : null);
console.log("Countries",countryShipped);
}, [ordersData]);

const handleApplyFilter = async () => {
    startFilterdOrdersDataLoading();
    console.log("Countries",countryShipped);

    const filteredData : Order[] =  filterOrders({
        dateRange,
        selectedRegions,
        selectedCustomerNames
    }, ordersData?.dbData.orders)
    const filteredRegionData : regionShipped[] =  filterRegionShipped({
        dateRange,
        selectedRegions,
        selectedCustomerNames
    }, ordersData?.dbData.regionShipped)


    setFilterdOrdersData(filteredData);
    setfilteredRegionShippedData(filteredRegionData);

    setDynamicData( filteredData && transformOrdersDataForOrderVolumeByRegionPerDate(filteredData))
    setTop10OrdersConfimredByCustomer( filteredData && transformOrdersDataForTop10OrdersConfirmed(filteredData, customersData))
    setWHLvsClaysonData( filteredData && transformOrdersDataForWHLAndClayson(filteredData))
    setWhiteLabelData( filteredData && transformOrdersDataForWhiteLabel(filteredData))
    setCountryShipped( filteredRegionData && transformOrdersDataForTop10OrdersByCountry(filteredRegionData) )
    setStateShipped( filteredRegionData && transformOrdersDataForTop10OrdersByState(filteredRegionData) )
    console.log("HERE is ", selectedRegions)

    stopFilterdOrdersDataLoading();
}

  const handleSelectCustomerNames = (selectedOptions: any) => {
    setSelectedCustomerNames(selectedOptions);
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

  const handleDateRangeChange = (ranges: { [key: string]: DateRange }) => {
    const newSelection = ranges.selection;
    if (newSelection && newSelection.startDate && newSelection.endDate) {
      console.log('New selection:', newSelection);
      setDateRange({
        startDate: newSelection.startDate,
        endDate: newSelection.endDate,
        key: 'selection'
      });
    }
  };

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
    handleApplyFilter,
    dynamicData, 
    top10OrdersConfimredByCustomer,
    countryShipped,
    stateShipped,
    WHLvsClaysonData,
    WhiteLabelData,
    ordersData, 
    isOrdersDataLoading
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
