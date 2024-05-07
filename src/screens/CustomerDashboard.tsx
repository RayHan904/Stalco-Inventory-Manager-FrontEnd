import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useSelectedCustomer } from '../contexts/SelectedCustomerContext';
import { useLoading } from '../contexts/LoadingContext';
import { addSKUReplenishment, fetchInventory, updateSKUReplenishment } from "../services/api";

import PieChartComponent from '../components/PieChartComponent';
import BarChartComponent from '../components/BarChartComponent';
import Loader from '../components/Loader';
import InventorySummary from '../components/InventorySummary';
import useReplenishment, { ReplenishmentData } from '../hooks/useReplenishment';
import { validateThreshold } from '../validations/thresholdValidations';





const CustomerDashboard: React.FC = () => {
    const { selectedCustomer } = useSelectedCustomer();
    const { isLoading, startLoading, stopLoading } = useLoading();
    const [inventoryData, setInventoryData] = useState<{ summary: { [key: string]: number }, detail: { [key: string]: { [key: string]: number } } } | null>(null);
    const [selectedItem, setSelectedItem] = useState<string>("");
    const [SKUReplenishmentData, setSKUReplenishmentData] = useState<ReplenishmentData | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [inputValue, setInputValue] = useState<string >('');
    const [errorMessage, setErrorMessage] = useState("");


    const { replenishmentData, isReplenishmentLoading,  setReplenishmentData } = useReplenishment();

    const navigate = useNavigate();

    const handleThresholdButtonClick = async () => {
        const validationError = validateThreshold(inputValue.toString());
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
    
        if (!selectedItem) {
         
            console.error('Error: Selected item is null or undefined.');
            return;
        }

        const data : ReplenishmentData = {
            sku: selectedItem,
            clientId: selectedCustomer.customerId.toString(),
            clientName: selectedCustomer.companyName.toString(),
            threshold: inputValue
        };
    
        try {
            if (SKUReplenishmentData) {
                await updateSKUReplenishment(selectedItem, inputValue);
                toast.success('SKU Threshold updated successfully.');
                setReplenishmentData((prevData: ReplenishmentData[] | null) => {
                    if (prevData) {
                        return prevData.map(data => {
                            if (data.sku === selectedItem) {
                                return { ...data, threshold: inputValue };
                            }
                            return data;
                        });
                    }
                    return null;
                });
                
                
            } else {
                await addSKUReplenishment(data);
                toast.success('New SKU Threshold added successfully.');
                setReplenishmentData((prevData: ReplenishmentData[] | null) => {
                    if (prevData) {
                        const newData = [...prevData];
                        newData.push(data);
                        return newData;
                    }
                    return null;
                });
                
            }
        } catch (error) {
            console.error('Error occurred:', error);
            toast.error("Error occured");
        
        }
    };
    

    const handleSKUSelect = (item: string): void => {
        setSelectedItem(item);
        setErrorMessage("")
        setInputValue("")
        if (replenishmentData) {
            const filteredSKUData: ReplenishmentData | null = replenishmentData.find(data => data.sku === item) || null;
            setSKUReplenishmentData(filteredSKUData);
           if(filteredSKUData) setInputValue(filteredSKUData?.threshold.toString())
            console.log(SKUReplenishmentData)
        }

    };

    useEffect(() => {

        const fetchData = async () => {
            startLoading();
            try {
                const data = await fetchInventory(selectedCustomer?.customerId);
                setInventoryData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error fetching data:")
                navigate("/")
            } finally {
                stopLoading();
            }
        };

        fetchData();
    }, [selectedCustomer]);

    const details = inventoryData?.detail || {};
    const summary = inventoryData?.summary || {};

    const filteredItems = Object.keys(details).filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clearSearch = () => {
        setSearchTerm('');
    };

    const claysonCount = summary.Clayson || 0;
    const whlCount = summary.WHL || 0;

    let claysonData = 0;
    let whlData = 0;

    const barChartData = {
        data: [claysonCount, whlCount],
    };
    return (
        <Container fluid style={{ minHeight: '85vh' }}>

            <Row style={{ height: '30vh', overflowY: 'auto' }}>
                <h1>{selectedCustomer?.companyName}</h1>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <Col md={6} sm={3}>
                            <InventorySummary summary={summary as { Total: number; Clayson: number; WHL: number; }} />
                        </Col>
                        <Col md={6} style={{ maxHeight: '24vh' }} >
                            <BarChartComponent barChartData={barChartData} />
                        </Col>
                    </>
                )}
            </Row>
            <hr />
            <Row>
                <Col lg={3} md={4} sm={6} xs={12} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <h2>SKUs</h2>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <InputGroup.Text onClick={clearSearch} style={{ cursor: 'pointer' }}>
                            <BsX />
                        </InputGroup.Text>
                    </InputGroup>
                    {isLoading ? (
                        <div className="m-5" >
                            <Loader />

                        </div>
                    ) : (

                        <ListGroup style={{ height: window.innerWidth <= 768 ? '30vh' : '100%', overflowY: 'auto' }} >
                            {filteredItems.map(item => (
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

                <Col lg={9} md={8} sm={6} xs={12} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div>
                        {selectedItem ? (<div className="mb-2" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: "space-between" }}>
                            <div >
                                <h2>{selectedItem}</h2>

                                <ListGroup >
                                    {Object.entries(details[selectedItem] || {}).map(([key, value]) => {
                                        if (key === 'Clayson') {
                                            claysonData = value;
                                        } else {
                                            whlData = value;
                                        }
                                        return (
                                            <ListGroup.Item key={key}>
                                                {key}: {typeof value === 'number' ? value.toLocaleString() : value}
                                            </ListGroup.Item>
                                        );
                                    })}
                                    <>
                                        <ListGroup.Item>
                                            Clayson's Percentage: {(claysonData / (claysonData + whlData) * 100).toFixed(2)}%
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            WHL's Percentage: {(whlData / (claysonData + whlData) * 100).toFixed(2)}%
                                        </ListGroup.Item>
                                    </>
                                </ListGroup>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                {isReplenishmentLoading ? <div className='m-4'><Loader dims={50} /></div> : <Form className="p-3"  >
                                    <Form.Group controlId="thresholdInput">
                                        <Form.Label>Threshold</Form.Label>
                                        <FormControl
                                            placeholder={SKUReplenishmentData?.threshold ? SKUReplenishmentData.threshold.toString() : "Enter a number"}
                                            aria-label="Item Threshold"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className={errorMessage ? 'is-invalid' : ''} 
                                        />
                                        {errorMessage && <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>}
                                        <Button variant="primary" className="mt-2" onClick={handleThresholdButtonClick}>
                                            {SKUReplenishmentData ? "UPDATE" : "ADD"}
                                        </Button>
                                    </Form.Group>

                                </Form>}

                            </div>
                        </div>
                        ) : (
                            <p>Select an item to view details</p>
                        )}
                        {selectedItem && (<>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                height: '30rem'
                            }}>
                                <PieChartComponent pieChartData={{ data: [claysonData, whlData] }} />

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
