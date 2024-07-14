import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelectedCustomer } from "../contexts/SelectedCustomerContext";
import { useLoading } from "../contexts/LoadingContext";

import Loader from "../components/layout/Loader";
import SKUList from "../components/common/SKUList";
import SKUDetail from "../components/common/SKUDetail";
import BarChartComponent from "../components/charts/BarChartComponent";
import { useOrdersByClientDashboardData } from "../contexts/OrdersByClientDashboardDataContext";
import OrdersByClientSummary from "../components/inventory/OrdersByClientSummary";
import LineChartComponent from "../components/charts/LineChartComponent";

const OrdersByCustomerDashboard: React.FC = () => {
  const { selectedCustomer } = useSelectedCustomer();
  const {fetchOrdersByClient,ordersByClientData, top10OrdersConfimredBySku,summary } = useOrdersByClientDashboardData()
  console.log("FETCHED ORDERS",ordersByClientData)




  const { isLoading, startLoading, stopLoading } = useLoading(); //while loading inventoryData

  const [searchTerm, setSearchTerm] = useState<string>(""); // Searching from list of SKUs
  const [selectedItem, setSelectedItem] = useState<string>(""); //selected SKU from the list

  const [listShow, setListShow] = useState(true); //list on mobile view
  const [overviewShow, setOverviewShow] = useState(true); //overview on mobile view

  const navigate = useNavigate();

  //helpers

  const getUniqueItems = (items: any[]): string[] => {
    const seenSkus = new Set<string>();
  
    items.forEach((item: { sku: string }) => {
      seenSkus.add(item.sku);
    });
  
    return Array.from(seenSkus);
  };


  const filterItemsBySearchTerm = (items: string[], searchTerm: string): string[] => {
    return items.filter((item: string) => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  

   const uniqueItems = ordersByClientData &&  getUniqueItems(ordersByClientData.dbData.skusales)
  const filteredItems = uniqueItems && filterItemsBySearchTerm(uniqueItems, searchTerm)  
  
   

  const handleSKUSelect = (item: string): void => {
    setListShow(false);
    setOverviewShow(false);
    setSelectedItem(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        console.log("HELLO THERE")
        await fetchOrdersByClient(selectedCustomer?.customerId.toString());

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data:");
        navigate("/ordersDashboard");
      } finally {
        stopLoading();
      }
    };
    fetchData();
  }, [selectedCustomer]);


  const clearSearch = () => {
    setListShow(true);
    setSearchTerm("");
  };

  return (
    <Container fluid style={{ minHeight: "85vh" }}>
      <Row
        style={{
          height: innerWidth < 500 ? (overviewShow ? "65vh" : "5vh") : "45vh",
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
            <Col md={4} sm={12}>
            {

!top10OrdersConfimredBySku  ? <Loader dims={50}/> : <BarChartComponent barChartData={top10OrdersConfimredBySku ? top10OrdersConfimredBySku : {}} dataLabel={true} isArranged={true} />
                    }
            </Col>
            <Col md={3} sm={12} style={{margin:'auto 0'}}>
              {summary &&  
             <OrdersByClientSummary summary={summary} width="80%" />
              }</Col>
            <Col md={5} sm={12}>
            {

!top10OrdersConfimredBySku  ? <Loader dims={50}/> : <BarChartComponent barChartData={top10OrdersConfimredBySku ? top10OrdersConfimredBySku : {}} dataLabel={true} isArranged={true} />
                    }
            </Col>
          </>
        )}
      </Row>
      <hr />
      <Row>
        <Col lg={3} md={4} sm={6} xs={12} style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {!filteredItems ?  <Loader /> :          <SKUList
            items={filteredItems}
            selectedItem={selectedItem}
            searchTerm={searchTerm}
            isLoading={isLoading}
            onSelect={handleSKUSelect}
            listShow={listShow}
            setListShow={setListShow}
            onSearch={setSearchTerm}
            onClearSearch={clearSearch}
          />  }

        </Col>
        {window.innerWidth <= 768 ? <hr /> : <></>}
        <Col lg={9} md={8} sm={6} xs={12} style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <div>
            {selectedItem ? (
              <></>
              // <SKUDetail
              //   selectedItem={selectedItem}
              //   details={details[selectedItem] || {}}
              //   thresholdFieldValue={thresholdFieldValue}
              //   qtyPerPalletFieldValue={qtyPerPalletFieldValue}
              //   errMsgThreshold={errMsgThreshold}
              //   errMsgQtyPerPallet={errMsgQtyPerPallet}
              //   isReplenishmentLoading={isReplenishmentLoading}
              //   isSkuInfoLoading={isSkuInfoLoading}
              //   SKUReplenishmentData={SKUReplenishmentData}
              //   selectedSkuInfoData={selectedSkuInfoData}
              //   onThresholdChange={setThresholdFieldValue}
              //   onQtyPerPalletChange={setQtyPerPalletFieldValue}
              //   onThresholdSubmit={handleThresholdButtonClick}
              //   onQtyPerPalletSubmit={handleQtyPerPalletButtonClick}
              // />
            ) : (
              <p>Select an item to view details</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrdersByCustomerDashboard;
