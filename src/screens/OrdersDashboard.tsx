import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useSelectedCustomer } from "../contexts/SelectedCustomerContext";
import { useCustomers } from "../contexts/CustomerContext";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import CustomerSelect from "../components/CustomerSelect";
import { CustomerData } from "../services/api";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import useLoading from "../hooks/useLoading";
import OrdersDashboardComponent from "../components/OrdersDashboardComponent";

const OrdersDashboard: React.FC = () => {
  const { selectedCustomer, setSelectedCustomer } = useSelectedCustomer();
  const { customersData, isCustomersLoading } = useCustomers();
  const { isLoading, startLoading, stopLoading } = useLoading();

  const [overviewShow, setOverviewShow] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        // Fetch Orders data logic here
        setTimeout(() => {
          stopLoading();
        }, 1000); 
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


  return (
    <div style={{ minHeight: "85vh" }}>
      <Row
        style={{
          height: overviewShow ? "100%" : "5vh",
          overflowY: overviewShow ? "visible" : "hidden",
          transition: "height 0.5s ease-in-out",
        }}
      >
        <div className={window.innerWidth < 500 ? "flex-apart" : "text-center"}>
          <h1 className="mb-4">Orders Dashboard</h1>
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
<OrdersDashboardComponent/>
          </>
        )}
      </Row>
      <hr />
      <Container style={{ minHeight: "35vh" }}>
        <Container className="text-center" style={{ minHeight: "5vh" }}>
          <h1>View Order details for SKU</h1>
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

export default OrdersDashboard;
