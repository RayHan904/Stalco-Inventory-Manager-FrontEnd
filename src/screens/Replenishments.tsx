import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import { useCustomers } from "../contexts/CustomerContext";
import { toast } from "react-toastify";
import useReplenishment from "../hooks/useReplenishment";
import { CustomerData } from "../services/api";
import ReplenishmentTable from "../components/ReplenishmentTable";

const Replenishments: React.FC = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
    const { customersData, isCustomersLoading } = useCustomers();
    const { replenishmentData, fetchLatestReplenishments, isReplenishmentLoading,setReplenishmentData } = useReplenishment();

    const handleSelect = (event: ChangeEvent) => {
        const target = event.target as HTMLSelectElement;
        const selectedCustomerObject = JSON.parse(target.value);
        setReplenishmentData(null)
        setSelectedCustomer(selectedCustomerObject);
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
        <Container fluid="md" className="text-center my-4">
            
            <h1>Replenishments</h1>
            <div className="d-flex justify-content-center " style={{ minHeight: '70vh' }}>
                {isCustomersLoading ? <Loader /> : (
                    <Container>
                        <Form onSubmit={handleSubmit}>
                            <Row className="justify-content-center mb-3">
                                <Col md={6} className="mb-2">
                                    <Form.Group controlId="selectCustomer">
                                        <Form.Control as="select" onChange={handleSelect} defaultValue="">
                                            <option disabled value="">Select a Customer...</option>
                                            {/* <option value="All">
                                                All
                                            </option> */}
                                            {customersData?.map(customer => (
                                                <option key={customer.customerId} value={JSON.stringify(customer)}>
                                                    {customer.companyName}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md="auto">
                                    <Button className="" variant="primary" type="submit">
                                        Select
                                    </Button>
                                </Col>
                            </Row>
                        </Form>

                        {isReplenishmentLoading ? (
                            <Loader />
                        ) : (
                            selectedCustomer && replenishmentData && replenishmentData.length > 0 ? (
                               <ReplenishmentTable replenishmentData={replenishmentData}/>
                            ) : (
                                <div className="text-center mt-4">
                                    <h2>{selectedCustomer && replenishmentData?.length == 0 ? "No Replenishments to show" : ""}</h2>
                                </div>
                            )
                        )}
 

                    </Container>
                    
                )}
            </div>
            <div style={{height:"90%", display:"flex", alignItems:"flex-end", justifyContent:"center"}}>

<Form.Group id="automatedMailingList" className="m-4 "  style={{height:"50px", width: "50%"}}>
                            <Form.Label>Automated mailing list:</Form.Label>
                            <Form.Control type="email" value="inventory@stalco.ca" disabled   className="disabled-input"/>
                            <small className="text-muted">you are not authorized</small>
                        </Form.Group>
                        </div>

        </Container>
    );
};

export default Replenishments;