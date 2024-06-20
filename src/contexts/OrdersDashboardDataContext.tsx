import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { addDays } from 'date-fns';
import useOrdersData from '../hooks/useOrdersData';
import useLoading from '../hooks/useLoading'
import { OrdersData } from '../services/api';

interface DateRange {
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
  dateRange: DateRange[];
  setDateRange: React.Dispatch<React.SetStateAction<DateRange[]>>;
  filteredOrdersData: any; 
  fetchOrdersDatawithRange: () => void; 
  isFilterdOrdersDataLoading: boolean;
  handleSelectCustomerNames: (selectedOptions: any) => void;
  handleSelectRegions: (region: string) => void;
  handleSelectCountries: (selectedOptions: any) => void;
  handleSelectStates: (selectedOptions: any) => void;
  handleDateRangeChange: (ranges: { selection: DateRange }) => void;
}

const DataContext = createContext<DataContextType | null>(null);

interface DataProviderProps {
  children: ReactNode;
}

export const OrdersDashboardDataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const { ordersData, isOrdersDataLoading, fetchOrdersDatawithRange } = useOrdersData();
    const { isLoading: isFilterdOrdersDataLoading, startLoading: startFilterdOrdersDataLoading, stopLoading: stopFilterdOrdersDataLoading } = useLoading();


  const [filteredOrdersData, setFilterdOrdersData] = useState<OrdersData>();
  const [selectedCustomerNames, setSelectedCustomerNames] = useState<any[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<any[]>([]);
  const [selectedStates, setSelectedStates] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);




  useEffect(() => {
    startFilterdOrdersDataLoading();

    const handleDataLoading = () => {
        if (!isOrdersDataLoading) {
            if (ordersData) {
                setFilterdOrdersData(ordersData);
                stopFilterdOrdersDataLoading();
            } else {
                // If ordersData is still not available, wait and check again
                setTimeout(() => {
                    if (ordersData) {
                        setFilterdOrdersData(ordersData);
                    }
                    stopFilterdOrdersDataLoading();
                }, 5000);
            }
        }
    };

    handleDataLoading();
}, [ordersData]);



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

  const handleDateRangeChange = (ranges: { selection: DateRange }) => {
    setDateRange([ranges.selection]);
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
