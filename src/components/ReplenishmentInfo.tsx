import React from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { CustomerData } from "../services/api";
import Loader from "../components/Loader";
import ReplenishmentTable from "../components/ReplenishmentTable";
import CustomerSelect from "./CustomerSelect";
import { ReplenishmentData } from "../hooks/useReplenishment";

interface ReplenishmentInfoProps {
  selectedCustomer: CustomerData | null;
  customersData: CustomerData[] | null;
  isCustomersLoading: boolean;
  isReplenishmentLoading: boolean;
  replenishmentData: ReplenishmentData[] | null;
  onCustomerSelect: (customer: CustomerData) => void;
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const ReplenishmentInfo: React.FC<ReplenishmentInfoProps> = ({
  selectedCustomer,
  customersData,
  isCustomersLoading,
  isReplenishmentLoading,
  replenishmentData,
  onCustomerSelect,
  onFormSubmit,
}) => {
  return (
    <Container fluid="md" className="text-center my-4">
      <h1>Replenishments</h1>
      <div
        className="d-flex justify-content-center"
        style={{ minHeight: window.innerWidth < 450 ? "50vh" : "65vh" }}
      >
        {isCustomersLoading ? (
          <Loader />
        ) : (
          <Container>
            <Form onSubmit={onFormSubmit}>
              <Row className="justify-content-center mb-3">
                <Col md={6} className="mb-2">
                  <CustomerSelect customers={customersData} onSelect={onCustomerSelect} />
                </Col>
                <Col md="auto">
                  <Button variant="primary" type="submit">
                    Select
                  </Button>
                </Col>
              </Row>
            </Form>

            {isReplenishmentLoading ? (
              <Loader />
            ) : selectedCustomer && replenishmentData && replenishmentData.length > 0 ? (
              <ReplenishmentTable replenishmentData={replenishmentData} />
            ) : (
              <div className="text-center mt-4">
                <h2>
                  {selectedCustomer && replenishmentData && replenishmentData.length === 0
                    ? "No Replenishments to show"
                    : ""}
                </h2>
              </div>
            )}
          </Container>
        )}
      </div>
      <div
        style={{
          height: "90%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <Form.Group
          id="automatedMailingList"
          className="m-4"
          style={{ height: "50px", width: "60%" }}
        >
          <Form.Label>Automated mailing list:</Form.Label>
          <Form.Control
            type="email"
            value="inventory@stalco.ca"
            disabled
            className="disabled-input"
          />
          <small className="text-muted">you are not authorized</small>
        </Form.Group>
      </div>
    </Container>
  );
};

export default ReplenishmentInfo;
