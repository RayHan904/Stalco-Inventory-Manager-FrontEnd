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
import { Form } from 'react-bootstrap';
import MyDateRangePicker from "../components/orders/DateRangePicker";
import { FilteredData, filterSKUOrderDetails, filterSKUOrderDetailsByWeek } from "../utils/dataTransformationsByClient";
import useLoading from "../hooks/useLoading";
import DoubleBarChartComponent from "../components/charts/DoubleBarChartComponent";

const OrdersByCustomerDashboard: React.FC = () => {
  const { selectedCustomer } = useSelectedCustomer();
  const { ordersByClientData, top10OrdersConfimredBySku, top10UnitsConfimredBySku, summary, setClientId, dateRange, setApiCallToggle, handleDateRangeChange, isFilterdOrdersDataLoading } = useOrdersByClientDashboardData()
  
  const [searchTerm, setSearchTerm] = useState<string>(""); // Searching from list of SKUs
  const [selectedItem, setSelectedItem] = useState<string>(""); //selected SKU from the list
  const [showByOrders, setShowByOrders] = useState<boolean>(false); // for toggling between top10 units and orders 
  const [showDaily, setShowDaily] = useState<boolean>(false); // for toggling between top10 units and orders 
  const [ filteredDetails, setFilteredDetails] = useState<FilteredData | null>();

  const { isLoading, startLoading, stopLoading } = useLoading(); 
  
  const [listShow, setListShow] = useState(true); //list on mobile view
  const [overviewShow, setOverviewShow] = useState(true); //overview on mobile view
  
  const dataToShow = {
    labels: filteredDetails?.dates ?? [""],
    datasets: [
      {
        label: "# of Orders",
        data: filteredDetails?.totalOrders ?? [0],
        backgroundColor: '#FF6384',
        hoverBackgroundColor: '#d35671',
        borderWidth: 2,
      },
      {
        label: "# of units",
        data: filteredDetails?.totalUnits ?? [0],
        backgroundColor: '#FFCE56',
        hoverBackgroundColor: '#e6b453',
        borderWidth: 2,
      }]
    }
    const shouldShowLineChart = dataToShow && dataToShow.labels && dataToShow.labels.length >= 15;

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


  const uniqueItems = ordersByClientData && getUniqueItems(ordersByClientData.dbData.skusales)
  const filteredItems = uniqueItems && filterItemsBySearchTerm(uniqueItems, searchTerm)



  const handleSKUSelect = (item: string): void => {
    setListShow(false);
    setOverviewShow(false);
    setSelectedItem(item);
  };

  useEffect(() => {
    setClientId(selectedCustomer.customerId.toString())
    setSelectedItem("")

  }, [selectedCustomer]);
  useEffect(() => {
    setSelectedItem("")

  }, [dateRange]);

  useEffect(() => {
    const asyncFilter = async () => {
      startLoading();

        const result = await showDaily ? filterSKUOrderDetails(ordersByClientData.dbData.skusales, dateRange.startDate.toString(), dateRange.endDate.toString()) : filterSKUOrderDetailsByWeek(ordersByClientData.dbData.skusales, dateRange.startDate.toString(), dateRange.endDate.toString()) ;
        
        setFilteredDetails(result);
        stopLoading();
    };

    asyncFilter();
  }, [ordersByClientData, showDaily]);


  const clearSearch = () => {
    setListShow(true);
    setSearchTerm("");
  };

  return (
    <Container fluid style={{ minHeight: "85vh" }}>
      <Row
        style={{
          height: innerWidth < 500 ? (overviewShow ? "70vh" : "5vh") : "63vh",
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
        {isFilterdOrdersDataLoading ? (
          <Loader />
        ) : (
          <>
        <Row className="sub-row" md={5} style={{display:'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Form.Label style={{display: 'flex',justifyContent:'right', alignItems: 'center', width: 'auto'}}>Date Range:</Form.Label>
          <MyDateRangePicker dateRange={dateRange} handleDateRangeChange={handleDateRangeChange} setApiCallToggle={setApiCallToggle} />
              {summary &&
                <OrdersByClientSummary summary={summary} width="20%" />
              }
        </Row>
            <Col md={4} sm={12} style={{ margin: 'auto 0' }}>
              <>
                <Form.Group>
                  <div className="inline-checkbox">
                    <Form.Check
                      type="switch"
                      label="By orders"
                      checked={showByOrders}
                      onChange={() => setShowByOrders(!showByOrders)}
                    />
                  </div>
                </Form.Group>

                {
                  showByOrders
                    ? (
                      top10OrdersConfimredBySku
                        ? <BarChartComponent barChartData={top10OrdersConfimredBySku ?? {}} dataLabel={true} isArranged={true} />
                        : <Loader dims={50} />
                    )
                    : (
                      top10UnitsConfimredBySku
                        ? <BarChartComponent barChartData={top10UnitsConfimredBySku ?? {}} dataLabel={true} isArranged={true} />
                        : <Loader dims={50} />
                    )
                }
              </>
            </Col>

            <Col xs={12} md={8}>
            <Row>
            <Form.Group>
                  <div className="inline-checkbox">
                    <Form.Check
                      type="switch"
                      label="Daily"
                      checked={showDaily}
                      onChange={() => setShowDaily(!showDaily)}
                    />
                  </div>
                </Form.Group>
            </Row>
            <Row  style={{ display: "flex", justifyContent: "center", height: "26rem"  }}>
            {isLoading && isFilterdOrdersDataLoading ? (
                <Loader />
              ) : shouldShowLineChart && dataToShow ? (
                <LineChartComponent lineChart={dataToShow} />
              ) : dataToShow ? (
                <DoubleBarChartComponent doubleBarChart={dataToShow} />
              ) : null}
            </Row>


            </Col>
          </>
        )}
      </Row>
      <hr />
      <Row>
        <Col lg={3} md={4} sm={6} xs={12} style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {!filteredItems ? <Loader /> : <SKUList
            items={filteredItems}
            selectedItem={selectedItem}
            searchTerm={searchTerm}
            isLoading={isFilterdOrdersDataLoading}
            onSelect={handleSKUSelect}
            listShow={listShow}
            setListShow={setListShow}
            onSearch={setSearchTerm}
            onClearSearch={clearSearch}
          />}

        </Col>
        {window.innerWidth <= 768 ? <hr /> : <></>}
        <Col lg={9} md={8} sm={6} xs={12} style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <div>
            {isFilterdOrdersDataLoading ? <Loader /> : selectedItem ? (
              <>
                <SKUOrderDetails
                  selectedItem={selectedItem}
                  details={ordersByClientData.dbData.skusales || {}}
                  dateRange={dateRange}
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
