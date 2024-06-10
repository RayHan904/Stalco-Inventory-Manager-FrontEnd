import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelectedCustomer } from "../contexts/SelectedCustomerContext";
import { useLoading } from "../contexts/LoadingContext";
import {
  addSKUReplenishment,
  fetchInventory,
  updateSKUReplenishment,
  deleteSKUReplenishment,
  addSkuInfo,
  updateSkuInfo,
  SKUInfoData
} from "../services/api";

import Loader from "../components/Loader";
import InventorySummary from "../components/InventorySummary";
import SKUList from "../components/SKUList";
import SKUDetail from "../components/SKUDetail";
import useReplenishment, { ReplenishmentData } from "../hooks/useReplenishment";
import useSkuInfo from "../hooks/useSkuInfo";
import { validateThreshold } from "../validations/thresholdValidations";
import { validateQtyPerPallet } from "../validations/qtyPerPalletValidations";
import BarChartComponent from "../components/BarChartComponent";

const CustomerDashboard: React.FC = () => {
  const { selectedCustomer } = useSelectedCustomer();

  const { isLoading, startLoading, stopLoading } = useLoading(); //while loading inventoryData
  const { replenishmentData, isReplenishmentLoading, setReplenishmentData } = useReplenishment(); //fetching data from Replenishment Collection
  const { skuInfoData, isSkuInfoLoading, setSkuInfoData, fetchLatestSkuInfo } = useSkuInfo(); //fetching data from SkuInfo Collection

  const [inventoryData, setInventoryData] = useState<{ summary: { [key: string]: number }; detail: { [key: string]: { [key: string]: number } };} | null>(null); //All the inventory Data is stored here
  const [SKUReplenishmentData, setSKUReplenishmentData] = useState<ReplenishmentData | null>(null); //replenishment data of selected SKU.
  const [selectedSkuInfoData, setSelectedSkuInfoData] = useState<SKUInfoData | null>(null); //Sku info data of selected SKU.

  const [searchTerm, setSearchTerm] = useState<string>(""); // Searching from list of SKUs
  const [selectedItem, setSelectedItem] = useState<string>(""); //selected SKU from the list

  const [thresholdFieldValue, setThresholdFieldValue] = useState<string>(""); //Threshold value
  const [qtyPerPalletFieldValue, setQtyPerPalletFieldValue] = useState<string>(""); //QtyPerPallet value
  const [errMsgThreshold, setErrMsgThreshold] = useState(""); //for Thereshold input validation
  const [errMsgQtyPerPallet, setErrMsgQtyPerPallet] = useState(""); //for Qty per pallet input validation

  const [listShow, setListShow] = useState(true); //list on mobile view
  const [overviewShow, setOverviewShow] = useState(true); //overview on mobile view



  const navigate = useNavigate();

  const validateAndFormatReplenishmentData = () => {
    const validationError = validateThreshold(thresholdFieldValue.toString());
    if (validationError) {
      setErrMsgThreshold(validationError);
      return null;
    } else {
      setErrMsgThreshold("");
    }

    if (!selectedItem || !selectedCustomer) {
      console.error("Error: Selected item or customer is null or undefined.");
      return null;
    }

    return {
      sku: selectedItem,
      clientId: selectedCustomer.customerId.toString(),
      clientName: selectedCustomer.companyName.toString(),
      threshold: thresholdFieldValue,
    };
  };

  const validateAndFormatSkuInfoData = () => {
    const validationError = validateQtyPerPallet(qtyPerPalletFieldValue.toString());
    if (validationError) {
      setErrMsgQtyPerPallet(validationError);
      return null;
    } else {
      setErrMsgQtyPerPallet("");
    }

    if (!selectedItem || !selectedCustomer) {
      console.error("Error: Selected item or customer is null or undefined.");
      return null;
    }

    return {
      sku: selectedItem,
      clientId: selectedCustomer.customerId.toString(),
      clientName: selectedCustomer.companyName.toString(),
      qtyPerPallet: qtyPerPalletFieldValue,
    };
  };


  const updateSkuInfoData = async () => {
    // Retrieve current threshold for the selected item
  const currentSkuInfoItem = skuInfoData?.find((d) => d.sku === selectedItem);
  
    // Check if qtyPerPalletFieldValue is the same as the current Qty per pallet
    if (currentSkuInfoItem?.qtyPerPallet == qtyPerPalletFieldValue) {
      toast.info("No changes detected in SKU Qty per pallet.");
      return; // Exit if the current Qty per pallet is the same as the input value
    }
  
      await updateSkuInfo(selectedItem, qtyPerPalletFieldValue);
      toast.success("SKU Qty per pallet updated successfully.");
      setSkuInfoData(
        (prevData) =>
          prevData?.map((d) =>
            d.sku === selectedItem ? { ...d, qtyPerPallet: qtyPerPalletFieldValue } : d,
          ) || null,
      );
    
  };
  
  const addSkuInfoData = async (data: SKUInfoData) => {
    await addSkuInfo(data);
    toast.success("New SKU Qty per pallet added successfully.");
    setSkuInfoData((prevData) =>
      prevData ? [...prevData, data] : [data],
    );
    setSelectedSkuInfoData(data);
  };
  
    const updateReplenishmentData = async () => {
      // Retrieve current threshold for the selected item
      const currentReplenishmentItem = replenishmentData?.find((d) => d.sku === selectedItem);
  console.log("afasfasdfadf", currentReplenishmentItem?.threshold)
  console.log("afasfasdfadf", thresholdFieldValue)
      // Check if thresholdFieldValue is the same as the current threshold
      if (currentReplenishmentItem?.threshold == thresholdFieldValue) {
        toast.info("No changes detected in SKU Threshold.");
        return; // Exit if the current threshold is the same as the input value
      }
  
      // Proceed with deletion or update based on the thresholdFieldValue
      if (parseInt(thresholdFieldValue) === 0) {
        await deleteSKUReplenishment(selectedItem);
        toast.success("SKU Threshold deleted successfully.");
        setReplenishmentData(
          (prevData) => prevData?.filter((d) => d.sku !== selectedItem) || null,
        );
        setSKUReplenishmentData(null);
        setThresholdFieldValue("");
      } else {
        await updateSKUReplenishment(selectedItem, thresholdFieldValue);
        toast.success("SKU Threshold updated successfully.");
        setReplenishmentData(
          (prevData) =>
            prevData?.map((d) =>
              d.sku === selectedItem ? { ...d, threshold: thresholdFieldValue } : d,
            ) || null,
        );
      }
    };
  
    const addReplenishmentData = async (data: ReplenishmentData) => {
      await addSKUReplenishment(data);
      toast.success("New SKU Threshold added successfully.");
      setReplenishmentData((prevData) =>
        prevData ? [...prevData, data] : [data],
      );
      setSKUReplenishmentData(data);
    };
  const handleThresholdButtonClick = async () => {
    const data = validateAndFormatReplenishmentData();
    if (!data) return;

    try {
      if (SKUReplenishmentData) {
        await updateReplenishmentData();
      } else {
        await addReplenishmentData(data);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Error occurred");
    }
  };

  const handleQtyPerPalletButtonClick = async () => {
    const data = validateAndFormatSkuInfoData();
    if (!data) return;

    try {
      if (selectedSkuInfoData) {
        await updateSkuInfoData();
      } else {
        await addSkuInfoData(data);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Error occurred");
    }
  };

  const handleSKUSelect = (item: string): void => {
    setListShow(false);
    setOverviewShow(false);
    setSelectedItem(item);
    setErrMsgThreshold("");
    setErrMsgQtyPerPallet("");
    setThresholdFieldValue("");
    setQtyPerPalletFieldValue("");

    const filteredSKUData = replenishmentData?.find((data) => data.sku === item) || null;
    setSKUReplenishmentData(filteredSKUData);
    if (filteredSKUData) setThresholdFieldValue(filteredSKUData.threshold.toString());

    const filteredSKUData2 = skuInfoData?.find((data) => data.sku === item) || null;
    setSelectedSkuInfoData(filteredSKUData2);
    if (filteredSKUData2) setQtyPerPalletFieldValue(filteredSKUData2.qtyPerPallet.toString());
  };

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        const data = await fetchInventory(selectedCustomer?.customerId);
        await fetchLatestSkuInfo(selectedCustomer?.customerId.toString());
        setInventoryData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data:");
        navigate("/");
      } finally {
        stopLoading();
      }
    };
    fetchData();
  }, [selectedCustomer]);

  const details = inventoryData?.detail || {};
  const summary = inventoryData?.summary || {};

  const filteredItems = Object.keys(details).filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const clearSearch = () => {
    setListShow(true);
    setSearchTerm("");
  };

  const claysonCount = summary.Clayson || 0;
  const whlCount = summary.WHL || 0;

  const barChartData = {
    data: [claysonCount, whlCount],
  };

  return (
    <Container fluid style={{ minHeight: "85vh" }}>
      <Row
        style={{
          height: innerWidth < 500 ? (overviewShow ? "65vh" : "5vh") : "35vh",
          overflowY: innerWidth < 500 ? (overviewShow ? "auto" : "hidden") : "auto",
          transition: "height 0.5s ease-in-out",
        }}
      >
        <div className="flex-apart">
          <h1>{selectedCustomer?.companyName}</h1>{" "}
          <div>
            {innerWidth < 500 ? (
              overviewShow ? (
                <BsChevronUp className="arrow-icon" onClick={() => setOverviewShow(false)} />
              ) : (
                <BsChevronDown className="arrow-icon" onClick={() => setOverviewShow(true)} />
              )
            ) : (
              ""
            )}
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Col md={6} sm={12}>
              <InventorySummary summary={summary as { Total: number; Clayson: number; WHL: number }} />
            </Col>
            <Col md={6} sm={12} style={{ maxHeight: "24vh" }}>
              <BarChartComponent barChartData={barChartData} />
            </Col>
          </>
        )}
      </Row>
      <hr />
      <Row>
        <Col lg={3} md={4} sm={6} xs={12} style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <SKUList
            items={filteredItems}
            selectedItem={selectedItem}
            searchTerm={searchTerm}
            isLoading={isLoading}
            onSelect={handleSKUSelect}
            listShow={listShow}
            setListShow={setListShow}
            onSearch={setSearchTerm}
            onClearSearch={clearSearch}
          />
        </Col>
        {window.innerWidth <= 768 ? <hr /> : <></>}
        <Col lg={9} md={8} sm={6} xs={12} style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <div>
            {selectedItem ? (
              <SKUDetail
                selectedItem={selectedItem}
                details={details[selectedItem] || {}}
                thresholdFieldValue={thresholdFieldValue}
                qtyPerPalletFieldValue={qtyPerPalletFieldValue}
                errMsgThreshold={errMsgThreshold}
                errMsgQtyPerPallet={errMsgQtyPerPallet}
                isReplenishmentLoading={isReplenishmentLoading}
                isSkuInfoLoading={isSkuInfoLoading}
                SKUReplenishmentData={SKUReplenishmentData}
                selectedSkuInfoData={selectedSkuInfoData}
                onThresholdChange={setThresholdFieldValue}
                onQtyPerPalletChange={setQtyPerPalletFieldValue}
                onThresholdSubmit={handleThresholdButtonClick}
                onQtyPerPalletSubmit={handleQtyPerPalletButtonClick}
              />
            ) : (
              <p>Select an item to view details</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerDashboard;
