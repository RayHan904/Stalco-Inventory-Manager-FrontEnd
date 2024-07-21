import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";

import { useSelectedCustomer } from "../contexts/SelectedCustomerContext";

import Loader from "../components/layout/Loader";
import SKUList from "../components/common/SKUList";
import BarChartComponent from "../components/charts/BarChartComponent";
import { useOrdersByClientDashboardData } from "../contexts/OrdersByClientDashboardDataContext";
import OrdersByClientSummary from "../components/inventory/OrdersByClientSummary";
import LineChartComponent from "../components/charts/LineChartComponent";
import SKUOrderDetails from "../components/common/SKUOrderDetails";
import {  Form } from 'react-bootstrap';
import MyDateRangePicker from "../components/orders/DateRangePicker";

const OrdersByCustomerDashboard: React.FC = () => {
  const { selectedCustomer } = useSelectedCustomer();
  const {ordersByClientData, top10OrdersConfimredBySku,summary, setClientId, dateRange, setApiCallToggle,handleDateRangeChange,isFilterdOrdersDataLoading  } = useOrdersByClientDashboardData()
  // console.log("FETCHED ORDERS",ordersByClientData)

  const dataToShow = {

    labels: ["1st", "2nd", "3rd", "4th", "5th"],
    datasets: [
        {
            label: "# of units",
            data: [10, 20,30, 23,19],
            backgroundColor: '#FF6384',
            borderColor:'#FF6384',
            hoverBackgroundColor: '#d35671',
            borderWidth: 2,
        },
        {
            label: "# of orders",
            data: [8, 20, 24, 20, 10],
            backgroundColor: '#FFCE56',
            borderColor:'#FFCE56',
            hoverBackgroundColor: '#e6b453',
            borderWidth: 2,
        }]
  }

  const [searchTerm, setSearchTerm] = useState<string>(""); // Searching from list of SKUs
  const [selectedItem, setSelectedItem] = useState<string>(""); //selected SKU from the list

  const [listShow, setListShow] = useState(true); //list on mobile view
  const [overviewShow, setOverviewShow] = useState(true); //overview on mobile view


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
    setClientId(selectedCustomer.customerId.toString())
  }, [selectedCustomer]);
  useEffect(() => {
    setSelectedItem("")
  }, [ordersByClientData]);


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
              <Row className="sub-row" md={4}>
        <Form.Label>Date Range</Form.Label>
        <MyDateRangePicker dateRange={dateRange} handleDateRangeChange={handleDateRangeChange} setApiCallToggle={setApiCallToggle} />
      </Row>
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
        {isFilterdOrdersDataLoading ? (
          <Loader />
        ) : (
          <>
            <Col md={4} sm={12} style={{margin:'auto 0'}}>
            {

!top10OrdersConfimredBySku  ? <Loader dims={50}/> : <BarChartComponent barChartData={top10OrdersConfimredBySku ? top10OrdersConfimredBySku : {}} dataLabel={true} isArranged={true} />
                    }
            </Col>
            <Col md={3} sm={12} style={{margin:'auto 0'}}>
              {summary &&  
             <OrdersByClientSummary summary={summary} width="80%" />
              }</Col>
            <Col md={5} sm={12} style={{margin:'auto 0'}}>
            {

<LineChartComponent lineChart={dataToShow} minHeight='auto' minWidth="auto"/>
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
            isLoading={isFilterdOrdersDataLoading}
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
            {isFilterdOrdersDataLoading ? <Loader/> : selectedItem ? (
              <>
              <SKUOrderDetails
                selectedItem={selectedItem}
                details={ordersByClientData.dbData.skusales|| {}}
                dateRange = {dateRange}
              />
              </>
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
