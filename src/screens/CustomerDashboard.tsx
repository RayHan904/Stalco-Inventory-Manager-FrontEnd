import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  InputGroup,
  FormControl,
  Form,
  Button,
} from "react-bootstrap";
import { BsX, BsChevronUp, BsChevronDown } from "react-icons/bs";
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

import PieChartComponent from "../components/PieChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import Loader from "../components/Loader";
import InventorySummary from "../components/InventorySummary";
import useReplenishment, { ReplenishmentData } from "../hooks/useReplenishment";
import useSkuInfo from "../hooks/useSkuInfo";
import { validateThreshold } from "../validations/thresholdValidations";
import { validateQtyPerPallet } from "../validations/qtyPerPalletValidations";

const CustomerDashboard: React.FC = () => {
  const { selectedCustomer } = useSelectedCustomer();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [inventoryData, setInventoryData] = useState<{
    summary: { [key: string]: number };
    detail: { [key: string]: { [key: string]: number } };
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<string>(""); //selected SKU from the list
  const [SKUReplenishmentData, setSKUReplenishmentData] =
    useState<ReplenishmentData | null>(null); //replenishment data of selected SKU.
  const [selectedSkuInfoData, setSelectedSkuInfoData] =
    useState<SKUInfoData | null>(null); //Sku info data of selected SKU.
  const [searchTerm, setSearchTerm] = useState<string>(""); // Searching from list of SKUs
  const [thresholdFieldValue, setThresholdFieldValue] = useState<string>(""); //Threshold value
  const [qtyPerPalletFieldValue, setQtyPerPalletFieldValue] = useState<string>(""); //QtyPerPallet value
  const [errMsgThreshold, setErrMsgThreshold] = useState(""); //for Thereshold input validation
  const [errMsgQtyPerPallet, setErrMsgQtyPerPallet] = useState(""); //for Qty per pallet input validation
  const [listShow, setListShow] = useState(true); //list on mobile view
  const [overviewShow, setOverviewShow] = useState(true); //overview on mobile view

  const { replenishmentData, isReplenishmentLoading, setReplenishmentData } =
    useReplenishment();
  const { skuInfoData, isSkuInfoLoading, setSkuInfoData,fetchLatestSkuInfo } =
  useSkuInfo();

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
    if (replenishmentData) {
      const filteredSKUData: ReplenishmentData | null =
        replenishmentData.find((data) => data.sku === item) || null;
      setSKUReplenishmentData(filteredSKUData);
      if (filteredSKUData) setThresholdFieldValue(filteredSKUData?.threshold.toString());
      console.log(SKUReplenishmentData);
    }
    if (skuInfoData) {
      const filteredSKUData2: SKUInfoData | null =
        skuInfoData.find((data) => data.sku === item) || null;
        setSelectedSkuInfoData(filteredSKUData2);
      if (filteredSKUData2) setQtyPerPalletFieldValue(filteredSKUData2?.qtyPerPallet.toString());
      console.log( skuInfoData);
    }
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

  let claysonData = 0;
  let whlData = 0;

  const barChartData = {
    data: [claysonCount, whlCount],
  };
  return (
    <Container fluid style={{ minHeight: "85vh" }}>
      <Row
        style={{
          height: innerWidth < 500 ? (overviewShow ? "65vh" : "5vh") : "35vh",
          overflowY:
            innerWidth < 500 ? (overviewShow ? "auto" : "hidden") : "auto",
          transition: "height 0.5s ease-in-out", // Add transition for height change
        }}
      >
        <div className="flex-apart">
          <h1>{selectedCustomer?.companyName}</h1>{" "}
          <div>
            {" "}
            {innerWidth < 500 ? (
              overviewShow ? (
                <BsChevronUp
                  className="arrow-icon"
                  onClick={() => setOverviewShow(false)}
                />
              ) : (
                <BsChevronDown
                  className="arrow-icon"
                  onClick={() => setOverviewShow(true)}
                />
              )
            ) : (
              ""
            )}{" "}
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Col md={6} sm={12}>
              <InventorySummary
                summary={
                  summary as { Total: number; Clayson: number; WHL: number }
                }
              />
            </Col>
            <Col md={6} sm={12} style={{ maxHeight: "24vh" }}>
              <BarChartComponent barChartData={barChartData} />
            </Col>
          </>
        )}
      </Row>
      <hr />
      <Row>
        <Col
          lg={3}
          md={4}
          sm={6}
          xs={12}
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <h2>SKUs</h2>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search..."
              value={searchTerm}
              onFocus={() => setListShow(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setListShow(true);
              }}
            />
            <InputGroup.Text
              onClick={clearSearch}
              style={{ cursor: "pointer" }}
            >
              <BsX />
            </InputGroup.Text>
          </InputGroup>
          {isLoading ? (
            <div className="m-5">
              <Loader />
            </div>
          ) : (
            <ListGroup
              style={{
                height:
                  window.innerWidth <= 768 ? (listShow ? "30vh" : "0") : "100%",
                overflowY: "auto",
              }}
            >
              {filteredItems.map((item) => (
                <ListGroup.Item
                  key={item}
                  action
                  active={selectedItem === item}
                  onClick={() => handleSKUSelect(item)}
                >
                  {item}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        {window.innerWidth <= 768 ? <hr /> : <></>}

        <Col
          lg={9}
          md={8}
          sm={6}
          xs={12}
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <div>
            {selectedItem ? (
              <div
                className="mb-2"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2>{selectedItem}</h2>

                  <ListGroup>
                    {Object.entries(details[selectedItem] || {}).map(
                      ([key, value]) => {
                        if (key === "Clayson") {
                          claysonData = value;
                        } else {
                          whlData = value;
                        }
                        return (
                          <ListGroup.Item key={key}>
                            {key}:{" "}
                            {typeof value === "number"
                              ? value.toLocaleString()
                              : value}
                          </ListGroup.Item>
                        );
                      },
                    )}
                    <>
                      <ListGroup.Item>
                        Clayson's Percentage:{" "}
                        {(
                          (claysonData / (claysonData + whlData)) *
                          100
                        ).toFixed(2)}
                        %
                      </ListGroup.Item>
                      <ListGroup.Item>
                        WHL's Percentage:{" "}
                        {((whlData / (claysonData + whlData)) * 100).toFixed(2)}
                        %
                      </ListGroup.Item>
                    </>
                  </ListGroup>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  {isReplenishmentLoading ? (
                    <div className="m-4">
                      <Loader dims={50} />
                    </div>
                  ) : (
                    <Form className="p-3">
                      <Form.Group controlId="thresholdInput">
                        <Form.Label>Threshold</Form.Label>
                        <FormControl
                          placeholder={
                            SKUReplenishmentData?.threshold
                              ? SKUReplenishmentData.threshold.toString()
                              : "Enter threshold value"
                          }
                          aria-label="Item Threshold"
                          value={thresholdFieldValue}
                          onChange={(e) => setThresholdFieldValue(e.target.value)}
                          className={errMsgThreshold ? "is-invalid" : ""}
                        />
                        {errMsgThreshold && (
                          <Form.Control.Feedback type="invalid">
                            {errMsgThreshold}
                          </Form.Control.Feedback>
                        )}
                        <Button
                          variant="primary"
                          className="mt-2"
                          onClick={handleThresholdButtonClick}
                        >
                          {SKUReplenishmentData ? "UPDATE" : "ADD"}
                        </Button>
                      </Form.Group>
                    </Form>
                  )}
                </div>
{/* //qtyPerPallet */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  {isSkuInfoLoading ? (
                    <div className="m-4">
                      <Loader dims={50} />
                    </div>
                  ) : (
                    <Form className="p-3">
                      <Form.Group controlId="qtyPerPalletInput">
                        <Form.Label>Qty per Pallet</Form.Label>
                        <FormControl
                          placeholder={
                            selectedSkuInfoData?.qtyPerPallet
                              ? selectedSkuInfoData.qtyPerPallet.toString()
                              : "Enter Qty per pallet"
                          }
                          aria-label="Qty per pallet"
                          value={qtyPerPalletFieldValue}
                          onChange={(e) => setQtyPerPalletFieldValue(e.target.value)}
                          className={errMsgQtyPerPallet ? "is-invalid" : ""}
                        />
                        {errMsgQtyPerPallet && (
                          <Form.Control.Feedback type="invalid">
                            {errMsgQtyPerPallet}
                          </Form.Control.Feedback>
                        )}
                        <Button
                          variant="primary"
                          className="mt-2"
                          onClick={handleQtyPerPalletButtonClick}
                        >
                          {selectedSkuInfoData ? "UPDATE" : "ADD"}
                        </Button>
                      </Form.Group>
                    </Form>
                  )}
                </div>
              </div>
            ) : (
              <p>Select an item to view details</p>
            )}
            {selectedItem && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "30rem",
                  }}
                >
                  <PieChartComponent
                    pieChartData={{ data: [claysonData, whlData] }}
                  />
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerDashboard;
