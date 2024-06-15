import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useSelectedCustomer } from "../contexts/SelectedCustomerContext";
import { useCustomers } from "../contexts/CustomerContext";
import { toast } from "react-toastify";
import Loader from "../components/layout/Loader";
import CustomerSelect from "../components/common/CustomerSelect";
import { CustomerData } from "../services/api";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import useLoading from "../hooks/useLoading";
import InventorySummary from "../components/inventory/InventorySummary";
import DoubleBarChartComponent from "../components/charts/DoubleBarChartComponent";
import UtilizationSummary from "../components/inventory/UtilizationSummary";

const Home: React.FC = () => {
  const { selectedCustomer, setSelectedCustomer } = useSelectedCustomer();
  const { customersData, isCustomersLoading } = useCustomers();
  const { isLoading, startLoading, stopLoading } = useLoading();

  const [overviewShow, setOverviewShow] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        // Fetch utilization data logic here
        setTimeout(() => {
          stopLoading();
        }, 1000); // Reduced the timeout for better UX
      } catch (error) {
        console.error("Error fetching utilization data:", error);
        toast.error("Error fetching capacity utilization data.");
        stopLoading();
      }
    };
    fetchData();
  }, []);

  const handleSelect = (customer: CustomerData) => {
    setSelectedCustomer(customer);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedCustomer) {
      navigate(`Dashboard/${selectedCustomer.companyName}`);
    } else {
      toast.error("Please select a customer.");
    }
  };

  const doubleBarChartData = {
    labels: ['Stalco', 'Clayson', 'WHL'],
    datasets: [
      {
        label: "Capacity",
        data: [150000, 50000, 100000],
        backgroundColor: ['#FF6384', '#FF6384', '#FF6384'],
        hoverBackgroundColor: ['#d35671', '#d35671', '#d35671'],
        borderWidth: 1,
      },
      {
        label: "Utilization",
        data: [150000, 55000, 95000],
        backgroundColor: ['#4BC0C0', '#4BC0C0', '#4BC0C0', ],
        hoverBackgroundColor: ['#3ba3a3', '#3ba3a3', '#3ba3a3'],
        borderWidth: 1,
      }
    ],
  };
  return (
    <div style={{ minHeight: "85vh" }}>
      <Row
        style={{
          height: overviewShow ? (window.innerWidth < 500 ? "65vh" : "40vh") : "5vh",
          overflowY: overviewShow ? "auto" : "hidden",
          transition: "height 0.5s ease-in-out",
        }}
      >
        <div className={window.innerWidth < 500 ? "flex-apart" : "text-center"}>
          <h1 className="mb-4">Capacity Utilization</h1>
          {window.innerWidth < 500 && (
            <div>
              {overviewShow ? (
                <BsChevronUp className="arrow-icon" onClick={() => setOverviewShow(false)} />
              ) : (
                <BsChevronDown className="arrow-icon" onClick={() => setOverviewShow(true)} />
              )}
            </div>
          )}
        </div>
        {isLoading ? (
          <div className="mb-3">
          <Loader />
          </div>
        ) : (
          <>
            <Col md={2} xs={6}>
              <InventorySummary summary={{ Total: 100000, Clayson: 40000, WHL: 60000 }} />
            </Col>
            <Col md={2} xs={6}>
              <UtilizationSummary summary={{ Total: 100000, Clayson: 40000, WHL: 60000 }} />
            </Col>
            <Col md={8} sm={12} style={{ maxHeight: "24vh" }}>
              <DoubleBarChartComponent doubleBarChart={doubleBarChartData} />
            </Col>
          </>
        )}
      </Row>
      <hr />
      <Container style={{ minHeight: "35vh" }}>
        <Container className="text-center" style={{ minHeight: "5vh" }}>
          <h1>Inventory Distribution According to Warehouse Location</h1>
        </Container>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            height: window.innerWidth < 500 ? "40vh" : "35vh",
            overflowY: "auto",
            transition: "height 0.5s ease-in-out",
          }}
        >
          {isCustomersLoading ? (
            <Loader />
          ) : (
            <Container className="mt-3">
              <Row className="justify-content-center">
                <Col md={6} xs={10}>
                  <Form onSubmit={handleSubmit}>
                    <CustomerSelect customers={customersData} onSelect={handleSelect} />
                    <Row className="justify-content-center">
                      <Col xs="auto">
                        <Button variant="primary" type="submit" className="mt-3">
                          Select
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </Container>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Home;
