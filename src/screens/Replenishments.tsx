import React, { useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { CustomerData } from "../services/api";
import { useCustomers } from "../contexts/CustomerContext";
import useReplenishment from "../hooks/useReplenishment";
import ReplenishmentInfo from "../components/replenishments/ReplenishmentInfo";

const Replenishments: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const { customersData, isCustomersLoading } = useCustomers();
  const {
    replenishmentData,
    fetchLatestReplenishments,
    isReplenishmentLoading,
    setReplenishmentData,
  } = useReplenishment();

  const handleSelect = (customer: CustomerData) => {
    setReplenishmentData(null);
    setSelectedCustomer(customer);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedCustomer) {
      try {
        await fetchLatestReplenishments(selectedCustomer.customerId.toString());
      } catch (error) {
        console.error("Error fetching replenishment data:", error);
        toast.error("An error occurred while fetching replenishment data");
      }
    } else {
      toast.error("Please select a customer");
    }
  };

  return (
    <ReplenishmentInfo
      selectedCustomer={selectedCustomer}
      customersData={customersData}
      isCustomersLoading={isCustomersLoading}
      isReplenishmentLoading={isReplenishmentLoading}
      replenishmentData={replenishmentData}
      onCustomerSelect={handleSelect}
      onFormSubmit={handleSubmit}
    />
  );
};

export default Replenishments;
