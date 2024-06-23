import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { addDays } from 'date-fns';
import useOrdersData from '../hooks/useOrdersData';
import useLoading from '../hooks/useLoading'
import { OrdersData } from '../services/api';
import { DynamicData, Order, Top10BarChartData } from '../components/orders/OrdersDashboardComponent';
import { filterOrders, transformOrdersDataForOrderVolumeByRegionPerDate, transformOrdersDataForTop10OrdersConfirmed } from '../utils/dataTransformatinos';

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
  isOrdersDataLoading:  boolean;
}

const DataContext = createContext<DataContextType | null>(null);

interface DataProviderProps {
  children: ReactNode;
}

export const OrdersDashboardDataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const { ordersData, isOrdersDataLoading, fetchOrdersDatawithRange } = useOrdersData();
    const { isLoading: isFilterdOrdersDataLoading, startLoading: startFilterdOrdersDataLoading, stopLoading: stopFilterdOrdersDataLoading } = useLoading();


  const [filteredOrdersData, setFilterdOrdersData] = useState<Order[]>([]);
  const [selectedCustomerNames, setSelectedCustomerNames] = useState<any[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
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



  useEffect(() => {
    setDynamicData(!isOrdersDataLoading && ordersData ? transformOrdersDataForOrderVolumeByRegionPerDate(ordersData.dbData.orders) : null);
    setTop10OrdersConfimredByCustomer(!isOrdersDataLoading && ordersData ? transformOrdersDataForTop10OrdersConfirmed(ordersData.dbData.orders) : null);
}, [ordersData]);

const handleApplyFilter = async () => {
    startFilterdOrdersDataLoading();

    const filteredData : Order[] =  filterOrders({
        dateRange,
        selectedRegions,
        selectedCustomerNames
    }, ordersData?.dbData.orders)

    setFilterdOrdersData(filteredData);

    setDynamicData( filteredData && transformOrdersDataForOrderVolumeByRegionPerDate(filteredData))
    setTop10OrdersConfimredByCustomer( filteredData && transformOrdersDataForTop10OrdersConfirmed(filteredData))
    console.log("HERE is ", top10OrdersConfimredByCustomer)

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
